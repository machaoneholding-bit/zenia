import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Edit, Shield, CheckCircle, ExternalLink, Loader2, Calendar, Clock, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  link?: {
    email: string;
  };
}

interface StripeCustomer {
  customer_id: string;
  default_payment_method?: string;
}

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [customer, setCustomer] = useState<StripeCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isCreatingSetupIntent, setIsCreatingSetupIntent] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
    }
    
    // Listen for refresh events from successful card additions
    const handleRefresh = () => {
      fetchPaymentMethods();
    };
    
    window.addEventListener('refreshPaymentMethods', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshPaymentMethods', handleRefresh);
    };
  }, [user]);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-payment-methods`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();
      setPaymentMethods(data.payment_methods || []);
      setCustomer(data.customer || null);
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError('Impossible de charger les moyens de paiement');
    } finally {
      setLoading(false);
    }
  };

  const createSetupIntent = async () => {
    try {
      setIsCreatingSetupIntent(true);
      
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-setup-intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create setup intent');
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Error creating setup intent:', err);
      alert('Erreur lors de la création de la session d\'ajout de carte');
    } finally {
      setIsCreatingSetupIntent(false);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/set-default-payment-method`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method_id: paymentMethodId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set default payment method');
      }

      await fetchPaymentMethods(); // Refresh data
    } catch (err) {
      console.error('Error setting default payment method:', err);
      alert('Erreur lors de la définition du moyen de paiement par défaut');
    }
  };

  const handleDelete = async (paymentMethodId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce moyen de paiement ?')) {
      return;
    }

    try {
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-payment-method`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method_id: paymentMethodId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment method');
      }

      await fetchPaymentMethods(); // Refresh data
    } catch (err) {
      console.error('Error deleting payment method:', err);
      alert('Erreur lors de la suppression du moyen de paiement');
    }
  };

  const getBrandIcon = (brand: string) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
      diners: '💳',
      jcb: '💳',
      unionpay: '💳'
    };
    return icons[brand as keyof typeof icons] || '💳';
  };

  const getBrandName = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPaymentMethods}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Moyens de paiement</h2>
              <p className="text-gray-600 mt-1">Gérez vos cartes bancaires et moyens de paiement</p>
            </div>
            <button
              onClick={createSetupIntent}
              disabled={isCreatingSetupIntent}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              {isCreatingSetupIntent ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Ajouter une carte
            </button>
          </div>
        </div>

        <div className="p-6">
          {paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {method.type === 'card' && method.card ? (
                        <>
                          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-lg">
                            {getBrandIcon(method.card.brand)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">
                                •••• •••• •••• {method.card.last4}
                              </p>
                              {customer?.default_payment_method === method.id && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Par défaut
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {getBrandName(method.card.brand)} • Expire {method.card.exp_month.toString().padStart(2, '0')}/{method.card.exp_year}
                            </p>
                          </div>
                        </>
                      ) : method.type === 'link' && method.link ? (
                        <>
                          <div className="w-12 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                            Link
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">Stripe Link</p>
                              {customer?.default_payment_method === method.id && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Par défaut
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{method.link.email}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-lg">
                            💳
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Moyen de paiement</p>
                            <p className="text-sm text-gray-600">Type: {method.type}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {customer?.default_payment_method !== method.id && (
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Définir par défaut
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Supprimer ce moyen de paiement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun moyen de paiement</h3>
              <p className="text-gray-600 mb-4">
                Ajoutez une carte bancaire pour faciliter vos futurs paiements
              </p>
              <button
                onClick={createSetupIntent}
                disabled={isCreatingSetupIntent}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                {isCreatingSetupIntent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Ajouter ma première carte
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stripe Link Section */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
              Link
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Stripe Link</h3>
              <p className="text-gray-600 text-sm">Paiement ultra-rapide en un clic</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ExternalLink className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-medium text-green-900 mb-1">Paiement express avec Link</h4>
                <p className="text-sm text-green-700 mb-3">
                  Stripe Link vous permet de payer en un clic sur tous les sites qui l'acceptent. 
                  Vos informations de paiement sont sécurisées et synchronisées automatiquement.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Paiement en 1 clic
                  </span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Synchronisation automatique
                  </span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Ultra-sécurisé
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Sécurité des paiements</h3>
            <p className="text-sm text-blue-700 mb-3">
              Vos informations de paiement sont cryptées et sécurisées par Stripe, 
              leader mondial du paiement en ligne. Nous ne stockons jamais vos données bancaires.
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Cryptage SSL 256 bits</li>
              <li>• Conformité PCI DSS Level 1</li>
              <li>• Authentification 3D Secure</li>
              <li>• Protection contre la fraude par IA</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}