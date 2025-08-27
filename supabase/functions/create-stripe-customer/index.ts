import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Zenia Customer Creation',
    version: '1.0.0',
  },
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

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

    const { user_id, email, name } = await req.json();

    if (!user_id || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: user_id and email' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating Stripe customer for user: ${user_id}, email: ${email}`);

    // Vérifier si le client existe déjà dans notre base
    const { data: existingCustomer, error: checkError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing customer:', checkError);
      throw new Error('Database error while checking existing customer');
    }

    if (existingCustomer) {
      console.log(`Customer already exists: ${existingCustomer.customer_id}`);
      return new Response(
        JSON.stringify({ 
          customer_id: existingCustomer.customer_id,
          message: 'Customer already exists'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Créer le client Stripe
    const stripeCustomer = await stripe.customers.create({
      email: email,
      name: name,
      metadata: {
        user_id: user_id,
        source: 'zenia_app'
      },
      description: `Client Zenia - ${name} (${email})`
    });

    console.log(`Stripe customer created: ${stripeCustomer.id}`);

    // Enregistrer dans notre base de données
    const { data: newCustomer, error: insertError } = await supabase
      .from('stripe_customers')
      .insert({
        user_id: user_id,
        customer_id: stripeCustomer.id
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting customer into database:', insertError);
      // Essayer de supprimer le client Stripe créé
      try {
        await stripe.customers.del(stripeCustomer.id);
        console.log(`Cleaned up Stripe customer: ${stripeCustomer.id}`);
      } catch (cleanupError) {
        console.error('Error cleaning up Stripe customer:', cleanupError);
      }
      throw new Error('Failed to save customer to database');
    }

    console.log(`Customer saved to database: ${newCustomer.customer_id}`);

    return new Response(
      JSON.stringify({ 
        customer_id: stripeCustomer.id,
        message: 'Customer created successfully'
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error creating Stripe customer:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});