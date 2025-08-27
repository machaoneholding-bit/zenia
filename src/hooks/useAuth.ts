import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    // Créer un client Stripe si la connexion réussit
    if (data.user && !error) {
      try {
        await createStripeCustomer(data.user)
      } catch (stripeError) {
        console.error('Error creating Stripe customer:', stripeError)
        // Ne pas faire échouer la connexion si la création Stripe échoue
      }
    }
    
    return { data, error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    
    // Créer un client Stripe si l'inscription réussit
    if (data.user && !error) {
      try {
        await createStripeCustomer(data.user)
      } catch (stripeError) {
        console.error('Error creating Stripe customer:', stripeError)
        // Ne pas faire échouer l'inscription si la création Stripe échoue
      }
    }
    
    return { data, error }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      // Si la session n'existe pas côté serveur, considérer comme une déconnexion réussie
      if (error && (error.message?.includes('session_not_found') || error.message?.includes('Auth session missing'))) {
        // Nettoyer l'état local même si la session serveur n'existe plus
        setSession(null)
        setUser(null)
        return { error: null }
      }
      
      return { error }
    } catch (err: any) {
      // Gérer les erreurs de session manquante
      if (err.message?.includes('session_not_found') || err.message?.includes('Auth session missing') || err.message?.includes('Auth session missing!')) {
        setSession(null)
        setUser(null)
        return { error: null }
      }
      return { error: err }
    }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  const createStripeCustomer = async (user: User) => {
    try {
      // Vérifier si le client Stripe existe déjà
      const { data: existingCustomer } = await supabase
        .from('stripe_customers')
        .select('customer_id')
        .eq('user_id', user.id)
        .single()
      
      if (existingCustomer) {
        console.log('Stripe customer already exists:', existingCustomer.customer_id)
        return existingCustomer
      }

      // Créer le client Stripe via l'edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-stripe-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create Stripe customer')
      }

      const result = await response.json()
      console.log('Stripe customer created:', result.customer_id)
      return result
    } catch (error) {
      console.error('Error in createStripeCustomer:', error)
      throw error
    }
  }

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
}
