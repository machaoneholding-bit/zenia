import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, ArrowRight, Home, FileText, Calendar, MapPin, Car, Loader2, AlertCircle, FileDown } from 'lucide-react';
import Logo from './Logo';
import { downloadReceiptPDF } from '../utils/pdfGenerator';

interface SuccessPageProps {
  onNavigate: (page: string) => void;
}

interface PaymentData {
  amount_total: number;
  currency: string;
  payment_status: string;
  metadata: {
    fps_number?: string;
    license_plate?: string;
    fps_amount?: string;
    service_fees?: string;
    total_amount?: string;
    payment_method?: string;
  };
  customer_details?: {
    email?: string;
    name?: string;
  };
}

export default function SuccessPage({ onNavigate }: SuccessPageProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get('session_id');
    setSessionId(sessionIdParam);
    
    if (sessionIdParam) {
      fetchPaymentData(sessionIdParam);
    } else {
      setLoading(false);
      setError('Aucun ID de session trouvé');
    }
  }, []);

  const fetchPaymentData = async (sessionId: string) => {
    try {
      setLoading(true);
      
      // Vérifier que les variables d'environnement sont disponibles
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Configuration manquante - variables d\'environnement Supabase non trouvées');
      }
      
      // Récupérer les vraies données de paiement depuis Stripe
      const response = await fetch(`${supabaseUrl}/functions/v1/get-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          session_id: sessionId
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Erreur ${response.status}: ${errorText || 'Impossible de récupérer les données de paiement'}`);
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error('Aucune donnée reçue du serveur');
      }
      
      setPaymentData(data);
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError(err instanceof Error ? err.message : 'Impossible de récupérer les détails du paiement');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'immediate':
        return 'Paiement en une fois';
      case 'split3':
        return 'Paiement en 3 fois';
      case 'deferred':
        return 'Paiement différé à 30 jours';
      default:
        return 'Paiement unique';
    }
  };

  const formatAmount = (amountInCents: number) => {
    return (amountInCents / 100).toFixed(2);
  };

  const handleDownloadPDF = async () => {
    if (!paymentData?.metadata) return;
    
    setIsDownloadingPDF(true);
    try {
      await downloadReceiptPDF({
        fps_number: paymentData.metadata.fps_number || '',
        fps_key: paymentData.metadata.fps_key || '',
        license_plate: paymentData.metadata.license_plate || '',
        fps_amount: paymentData.metadata.fps_amount || '0',
        service_fees: paymentData.metadata.service_fees || '0',
        total_amount: paymentData.metadata.total_amount || '0',
        payment_method: paymentData.metadata.payment_method || 'immediate',
        session_id: sessionId || undefined
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Erreur lors du téléchargement du justificatif');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vérification du paiement...
          </h2>
          <p className="text-gray-600">
            Nous récupérons les détails de votre transaction
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Logo size="lg" />
            <span className="text-3xl font-bold text-gray-900">Zenia</span>
          </div>
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Erreur de vérification
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => onNavigate('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Retour à l'accueil
          </button>
          
          {/* Debug info for development */}
          {sessionId && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Informations de debug :</p>
              <p className="text-xs text-gray-600 font-mono">Session ID: {sessionId}</p>
              <p className="text-xs text-gray-600">URL Supabase: {import.meta.env.VITE_SUPABASE_URL ? 'Configurée' : 'Manquante'}</p>
              <p className="text-xs text-gray-600">Clé Supabase: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurée' : 'Manquante'}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header avec logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Logo size="lg" />
            <span className="text-3xl font-bold text-gray-900">Zenia</span>
          </div>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Paiement réussi !
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Votre FPS {paymentData?.metadata.fps_number || ''} a été payé avec succès. Vous recevrez votre justificatif par email sous peu.
          </p>
        </div>

        {/* Détails du paiement */}
        {paymentData && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Détails de votre paiement</h2>
                <p className="text-gray-600">Transaction confirmée et sécurisée</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-6">
              {/* Informations FPS */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Informations FPS
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Numéro FPS :</span>
                    <span className="font-mono text-sm text-gray-900 break-all">
                      {paymentData.metadata.fps_number || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Véhicule :</span>
                    <span className="font-mono text-gray-900 flex items-center gap-1">
                      <Car className="w-4 h-4" />
                      {paymentData.metadata.license_plate || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date de paiement :</span>
                    <span className="text-gray-900 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date().toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Détails financiers */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Détails financiers
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Montant FPS :</span>
                    <span className="font-semibold text-gray-900">
                      {paymentData.metadata.fps_amount || '0'}€
                    </span>
                  </div>
                  {paymentData.metadata.service_fees && parseInt(paymentData.metadata.service_fees) > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Frais de service :</span>
                      <span className="font-semibold text-gray-900">
                        {paymentData.metadata.service_fees}€
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-gray-900 font-semibold">Total payé :</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatAmount(paymentData.amount_total)}€
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mode de paiement :</span>
                    <span className="text-gray-900 font-medium text-right">
                      {getPaymentMethodLabel(paymentData.metadata.payment_method || 'immediate')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statut */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Paiement confirmé</h3>
                  <p className="text-green-700 text-sm">
                    Votre transaction a été traitée avec succès. 
                    {paymentData.metadata.payment_method === 'deferred' 
                      ? ' Vous recevrez un rappel avant l\'échéance.'
                      : paymentData.metadata.payment_method === 'split3'
                      ? ' Les prochains prélèvements seront automatiques.'
                      : ''
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloadingPDF || !paymentData}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            {isDownloadingPDF ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Génération du PDF...
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                Télécharger le justificatif PDF
              </>
            )}
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Mon espace
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Accueil
            </button>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Prochaines étapes
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email de confirmation envoyé</p>
                <p className="text-sm text-gray-600">
                  Vous recevrez un email avec votre justificatif de paiement dans les 5 minutes
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Justificatif valide immédiatement</p>
                <p className="text-sm text-gray-600">
                  Votre justificatif de paiement est valide et peut être utilisé immédiatement
                </p>
              </div>
            </div>

            {paymentData?.metadata.payment_method === 'split3' && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Prochains prélèvements</p>
                  <p className="text-sm text-gray-600">
                    Les 2 prochains paiements seront prélevés automatiquement dans 30 et 60 jours
                  </p>
                </div>
              </div>
            )}

            {paymentData?.metadata.payment_method === 'deferred' && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Rappel de paiement</p>
                  <p className="text-sm text-gray-600">
                    Vous recevrez un rappel 3 jours avant l'échéance de paiement
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Support */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Besoin d'aide ?</h3>
          <p className="text-blue-700 mb-4">
            Notre équipe support est disponible pour répondre à toutes vos questions concernant votre paiement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm">
              Contacter le support
            </button>
            <button className="flex-1 border border-blue-300 text-blue-700 hover:bg-blue-100 py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm">
              Centre d'aide
            </button>
          </div>
        </div>

        {/* Session ID pour debug */}
        {sessionId && (
          <div className="text-center">
            <p className="text-xs text-gray-400">
              ID de session : {sessionId.substring(0, 20)}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}