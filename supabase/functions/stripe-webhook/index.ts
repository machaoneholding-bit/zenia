import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Bolt Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // get the signature from the header
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    // get the raw body
    const body = await req.text();

    // verify the webhook signature
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};

  if (!stripeData) {
    return;
  }

  // Traiter spécifiquement les événements checkout.session.completed pour les paiements FPS
  if (event.type === 'checkout.session.completed') {
    const session = stripeData as Stripe.Checkout.Session;
    const { customer: customerId, mode, payment_status, metadata } = session;

    console.info(`Processing checkout session: ${session.id}, mode: ${mode}, payment_status: ${payment_status}`);

    if (!customerId || typeof customerId !== 'string') {
      console.error(`No customer received on checkout session: ${session.id}`);
      return;
    }

    if (mode === 'subscription') {
      console.info(`Starting subscription sync for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);
    } else if (mode === 'payment' && payment_status === 'paid') {
      console.info(`Processing one-time payment for session: ${session.id}`);
      
      try {
        // Générer une facture détaillée après le paiement FPS
        if (metadata?.fps_number) {
          console.info(`Generating detailed invoice for FPS payment: ${session.id}`);
          
          try {
            // Créer une facture avec deux lignes distinctes
            const invoice = await stripe.invoices.create({
              customer: customerId,
              description: `Paiement FPS ${metadata.fps_number} - Véhicule ${metadata.license_plate}`,
              metadata: {
                fps_number: metadata.fps_number,
                fps_key: metadata.fps_key,
                license_plate: metadata.license_plate,
                fps_amount: metadata.fps_amount,
                service_fees: metadata.service_fees,
                total_amount: metadata.total_amount,
                payment_method: metadata.payment_method,
                checkout_session_id: session.id
              },
              footer: 'Merci d\'avoir utilisé Zenia pour le paiement de votre FPS.',
              custom_fields: [
                {
                  name: 'Numéro FPS',
                  value: metadata.fps_number
                },
                {
                  name: 'Véhicule',
                  value: metadata.license_plate
                },
                {
                  name: 'Mode de paiement',
                  value: metadata.payment_method === 'immediate' ? 'Paiement immédiat' :
                         metadata.payment_method === 'split3' ? 'Paiement en 3 fois' :
                         'Paiement différé 30 jours'
                }
              ]
            });

            console.info(`Invoice created: ${invoice.id}`);

            // Ajouter la ligne FPS (sans TVA)
            await stripe.invoiceItems.create({
              customer: customerId,
              invoice: invoice.id,
              amount: parseInt(metadata.fps_amount) * 100,
              currency: 'eur',
              description: `Forfait Post-Stationnement (FPS) ${metadata.fps_number}`,
              metadata: {
                type: 'fps_amount',
                fps_number: metadata.fps_number,
                license_plate: metadata.license_plate
              }
            });

            console.info(`FPS line item added to invoice: ${invoice.id}`);

            // Ajouter la ligne frais de service (avec TVA 20%)
            if (parseInt(metadata.service_fees) > 0) {
              await stripe.invoiceItems.create({
                customer: customerId,
                invoice: invoice.id,
                amount: parseInt(metadata.service_fees) * 100,
                currency: 'eur',
                description: `Frais de service Zenia - ${metadata.payment_method === 'split3' ? 'Paiement fractionné' : 'Paiement différé'}`,
                tax_rates: ['txr_1S03LCGbujDcxhXqjlkRfdU9'], // TVA 20% sur les frais de service uniquement
                metadata: {
                  type: 'service_fees',
                  payment_method: metadata.payment_method
                }
              });

              console.info(`Service fees line item added to invoice: ${invoice.id}`);
            }

            // Finaliser et envoyer la facture
            const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
            console.info(`Invoice finalized: ${invoice.id}`);
            
            await stripe.invoices.sendInvoice(invoice.id);
            console.info(`Invoice sent: ${invoice.id}`);
            
            // Mettre à jour la commande avec l'ID de facture
            const { error: updateError } = await supabase
              .from('stripe_orders')
              .update({
                invoice_id: finalizedInvoice.id,
                invoice_url: finalizedInvoice.hosted_invoice_url,
                invoice_sent_at: new Date().toISOString()
              })
              .eq('checkout_session_id', session.id);

            if (updateError) {
              console.error('Error updating order with invoice info:', updateError);
            } else {
              console.info(`Order updated with invoice info for session: ${session.id}`);
            }

          } catch (invoiceError) {
            console.error('Error creating detailed invoice:', invoiceError);
            // Don't fail the entire process if invoice handling fails
          }
        }

        // Insert the order into the stripe_orders table
        const { error: orderError } = await supabase.from('stripe_orders').insert({
          checkout_session_id: session.id,
          payment_intent_id: session.payment_intent,
          customer_id: customerId,
          amount_subtotal: session.amount_subtotal,
          amount_total: session.amount_total,
          currency: session.currency,
          payment_status: session.payment_status,
          status: 'completed',
        });

        if (orderError) {
          console.error('Error inserting order:', orderError);
          return;
        }
        console.info(`Successfully processed one-time payment for session: ${session.id}`);
      } catch (error) {
        console.error('Error processing one-time payment:', error);
      }
    }
  }

  // Gérer les événements de souscription
  if (!('customer' in stripeData)) {
    return;
  }

  const { customer: customerId } = stripeData;

  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
    return;
  }

  // Traiter les événements de souscription
  if (event.type !== 'checkout.session.completed') {
    console.info(`Starting subscription sync for customer: ${customerId}`);
    await syncCustomerFromStripe(customerId);
  }
}

// based on the excellent https://github.com/t3dotgg/stripe-recommendations
async function syncCustomerFromStripe(customerId: string) {
  try {
    // fetch latest subscription data from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    // TODO verify if needed
    if (subscriptions.data.length === 0) {
      console.info(`No active subscriptions found for customer: ${customerId}`);
      const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert(
        {
          customer_id: customerId,
          subscription_status: 'not_started',
        },
        {
          onConflict: 'customer_id',
        },
      );

      if (noSubError) {
        console.error('Error updating subscription status:', noSubError);
        throw new Error('Failed to update subscription status in database');
      }
    }

    // assumes that a customer can only have a single subscription
    const subscription = subscriptions.data[0];

    // store subscription state
    const { error: subError } = await supabase.from('stripe_subscriptions').upsert(
      {
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        ...(subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
          ? {
              payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
              payment_method_last4: subscription.default_payment_method.card?.last4 ?? null,
            }
          : {}),
        status: subscription.status,
      },
      {
        onConflict: 'customer_id',
      },
    );

    if (subError) {
      console.error('Error syncing subscription:', subError);
      throw new Error('Failed to sync subscription in database');
    }
    console.info(`Successfully synced subscription for customer: ${customerId}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}
