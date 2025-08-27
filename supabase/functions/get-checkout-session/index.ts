import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Zenia Get Checkout Session',
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

    const { session_id } = await req.json();

    if (!session_id) {
      return new Response(
        JSON.stringify({ error: 'Missing session_id parameter' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Récupérer la session de checkout depuis Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['customer']
    });

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Formater les données pour le frontend
    const paymentData = {
      amount_total: session.amount_total || 0,
      currency: session.currency || 'eur',
      payment_status: session.payment_status || 'unpaid',
      metadata: {
        fps_number: session.metadata?.fps_number || '',
        fps_key: session.metadata?.fps_key || '',
        license_plate: session.metadata?.license_plate || '',
        fps_amount: session.metadata?.fps_amount || '0',
        service_fees: session.metadata?.service_fees || '0',
        total_amount: session.metadata?.total_amount || '0',
        payment_method: session.metadata?.payment_method || 'immediate'
      },
      customer_details: {
        email: session.customer_details?.email || '',
        name: session.customer_details?.name || ''
      }
    };

    return new Response(
      JSON.stringify(paymentData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error retrieving checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
