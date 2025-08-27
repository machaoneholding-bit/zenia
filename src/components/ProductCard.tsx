import React, { useState } from 'react';
import { CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { Product } from '../stripe-config';
import { useAuth } from '../hooks/useAuth';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handlePurchase = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/cancel`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        alert('Une erreur est survenue lors de la création de la session de paiement');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Une erreur est survenue lors de la création de la session de paiement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            10,00 €
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Paiement sécurisé</span>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Redirection...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              {user ? 'Acheter maintenant' : 'Se connecter pour acheter'}
            </>
          )}
        </button>

        {product.mode === 'payment' && (
          <p className="text-xs text-gray-500 text-center">
            Paiement unique • Aucun abonnement
          </p>
        )}
      </div>
    </div>
  );
}