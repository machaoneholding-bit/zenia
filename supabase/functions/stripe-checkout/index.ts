import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Zenia FPS Payment',
    version: '1.0.0',
  },
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { fps_amount, service_fees, total_amount, currency, fps_data, success_url, cancel_url } = await req.json();

    // Validation des paramètres
    if (fps_amount === undefined || fps_amount === null || service_fees === undefined || service_fees === null || total_amount === undefined || total_amount === null || !currency || !fps_data || !success_url || !cancel_url) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Configuration des méthodes de paiement selon le type choisi
    let paymentMethodTypes = ['card'];

    // Ajouter Klarna pour les paiements fractionnés et différés
    if (fps_data.payment_method === 'split3' || fps_data.payment_method === 'deferred') {
      paymentMethodTypes.push('klarna');
    }

    // Créer une seule ligne pour le checkout (montant total)
    const lineItems = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Démarche administrative',
            description: `Paiement FPS ${fps_data.fps_number} - Véhicule ${fps_data.license_plate}`,
            metadata: {
              fps_number: fps_data.fps_number,
              fps_key: fps_data.fps_key,
              license_plate: fps_data.license_plate,
              payment_method: fps_data.payment_method,
              fps_amount: fps_amount.toString(),
              service_fees: service_fees.toString(),
              type: 'administrative_service'
            }
          },
          unit_amount: total_amount * 100, // Montant total en centimes
          tax_behavior: 'exclusive',
        },
        quantity: 1,
      }
    ];

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      metadata: {
        fps_number: fps_data.fps_number,
        fps_key: fps_data.fps_key,
        license_plate: fps_data.license_plate,
        fps_amount: fps_amount.toString(),
        service_fees: service_fees.toString(),
        total_amount: total_amount.toString(),
        payment_method: fps_data.payment_method,
        generate_detailed_invoice: 'true'
      },
      // Désactiver la création automatique de facture au checkout
      invoice_creation: {
        enabled: false
      }
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`Checkout error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
