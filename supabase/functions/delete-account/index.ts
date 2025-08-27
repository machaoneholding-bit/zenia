import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Zenia Account Deletion',
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

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting account deletion for user: ${user.id}`);

    // 1. Get Stripe customer ID if exists
    const { data: customerData } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .single();

    // 2. Delete Stripe customer and all associated data
    if (customerData?.customer_id) {
      try {
        console.log(`Deleting Stripe customer: ${customerData.customer_id}`);
        
        // Cancel all active subscriptions first
        const subscriptions = await stripe.subscriptions.list({
          customer: customerData.customer_id,
          status: 'active'
        });

        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.cancel(subscription.id);
          console.log(`Cancelled subscription: ${subscription.id}`);
        }

        // Delete all payment methods
        const paymentMethods = await stripe.paymentMethods.list({
          customer: customerData.customer_id,
          type: 'card'
        });

        for (const pm of paymentMethods.data) {
          await stripe.paymentMethods.detach(pm.id);
          console.log(`Detached payment method: ${pm.id}`);
        }

        // Delete the Stripe customer
        await stripe.customers.del(customerData.customer_id);
        console.log(`Stripe customer deleted: ${customerData.customer_id}`);
        
      } catch (stripeError) {
        console.error('Error deleting Stripe data:', stripeError);
        // Continue with account deletion even if Stripe cleanup fails
      }
    }

    // 3. Delete user data from our database (cascade will handle related tables)
    // The foreign key constraints will automatically delete:
    // - vehicles (via profiles cascade)
    // - fps_records (via profiles cascade)
    // - stripe_customers (via profiles cascade)
    // - stripe_subscriptions (via customer_id reference)
    // - stripe_orders (via customer_id reference)

    const { error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileDeleteError) {
      console.error('Error deleting profile:', profileDeleteError);
      throw new Error('Failed to delete user profile');
    }

    console.log(`Profile deleted for user: ${user.id}`);

    // 4. Delete the user from Supabase Auth (this must be last)
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (authDeleteError) {
      console.error('Error deleting auth user:', authDeleteError);
      throw new Error('Failed to delete user account');
    }

    console.log(`Auth user deleted: ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Account deleted successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error deleting account:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
