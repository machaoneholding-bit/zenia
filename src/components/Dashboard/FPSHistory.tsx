import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, MapPin, Car, Filter, Search, AlertCircle, CreditCard, Zap, Clock, X, CheckCircle, FileDown, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { downloadReceiptPDF } from '../../utils/pdfGenerator';

export default function FPSHistory() {
  const { user, session } = useAuth();
  const [selectedFPSIds, setSelectedFPSIds] = useState<string[]>([]);
  const [fpsHistory, setFpsHistory] = useState<any[]>([]);
  const [loadingFPS, setLoadingFPS] = useState(true);
  const [fpsError, setFpsError] = useState('');

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('immediate');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [downloadingPDFs, setDownloadingPDFs] = useState<Set<string>>(new Set());

  // Charger les FPS depuis Supabase
  React.useEffect(() => {
    if (user) {
      loadFPSHistory();
    }
  }, [user]);

  const loadFPSHistory = async () => {
    if (!user) return;
    
    setLoadingFPS(true);
    setFpsError('');
    
    try {
      const { data, error } = await supabase
        .from('fps_records')
        .select(`
          *,
          vehicles (
            license_plate
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading FPS history:', error);
        setFpsError('Erreur lors du chargement de l\'historique FPS');
        return;
      }

      // Transformer les données pour correspondre au format attendu
      const transformedFPS = data.map(fps => ({
        id: fps.fps_number,
        fps_number: fps.fps_number,
        fps_key: fps.fps_key,
        date: fps.created_at,
        amount: parseFloat(fps.amount),
        status: fps.status,
        vehicle: fps.vehicles?.license_plate || 'Saisie manuelle',
        location: fps.location || 'Saisie manuelle',
        paymentMethod: getPaymentMethodLabel(fps.payment_method),
        invoiceUrl: '#',
        receiptUrl: '#',
        payment_date: fps.payment_date
      }));

      setFpsHistory(transformedFPS);
      console.log('Loaded FPS history from Supabase:', transformedFPS);
    } catch (err: any) {
      console.error('Error loading FPS history:', err);
      setFpsError('Une erreur est survenue lors du chargement de l\'historique');
    } finally {
      setLoadingFPS(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'immediate':
        return 'Paiement immédiat';
      case 'split3':
        return 'Klarna 3x';
      case 'deferred':
        return 'Klarna différé';
      default:
        return 'Paiement unique';
    }
  };

  const pendingFPS = fpsHistory.filter(fps => fps.status === 'pending');
  const paidFPS = fpsHistory.filter(fps => fps.status === 'paid');

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-orange-100 text-orange-800',
      failed: 'bg-red-100 text-red-800'
    };
    const labels = {
      paid: 'Payé',
      pending: 'En attente',
      failed: 'Échec'
    };
    return {
      style: styles[status as keyof typeof styles],
      label: labels[status as keyof typeof labels]
    };
  };

  const filteredHistory = fpsHistory.filter(fps => {
    const matchesFilter = filter === 'all' || fps.status === filter;
    const matchesSearch = searchTerm === '' || 
                         fps.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fps.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fps.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPaid = fpsHistory
    .filter(fps => fps.status === 'paid')
    .reduce((sum, fps) => sum + fps.amount, 0);

  const totalPending = pendingFPS.reduce((sum, fps) => sum + fps.amount, 0);
  const selectedFPS = fpsHistory.filter(fps => selectedFPSIds.includes(fps.id));
  const selectedTotal = selectedFPS.reduce((sum, fps) => sum + fps.amount, 0);

  const paymentOptions = [
    {
      id: 'immediate',
      icon: Zap,
      title: 'Paiement immédiat',
      description: 'En une fois',
      color: 'emerald',
      badge: 'Recommandé'
    },
    {
      id: 'split3',
      icon: CreditCard,
      title: 'Paiement en 3 fois',
      description: 'Avec frais (+20%)',
      color: 'blue',
      badge: 'Populaire'
    },
    {
      id: 'deferred',
      icon: Clock,
      title: 'Paiement différé',
      description: 'Dans 30 jours (+15%)',
      color: 'orange',
      badge: 'Nouveau'
    }
  ];

  const calculateTotalWithFees = (baseAmount: number, method: string) => {
    switch (method) {
      case 'immediate':
        return baseAmount;
      case 'split3':
        return Math.round(baseAmount * 1.20);
      case 'deferred':
        return Math.round(baseAmount * 1.15);
      default:
        return baseAmount;
    }
  };

  const calculateSplitAmount = (total: number, splits: number) => {
    return (total / splits).toFixed(2);
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      emerald: isSelected 
        ? 'border-emerald-500 bg-emerald-50 shadow-emerald-100' 
        : 'border-gray-200 hover:border-emerald-300 hover:shadow-md',
      blue: isSelected 
        ? 'border-blue-500 bg-blue-50 shadow-blue-100' 
        : 'border-gray-200 hover:border-blue-300 hover:shadow-md',
      orange: isSelected 
        ? 'border-orange-500 bg-orange-50 shadow-orange-100' 
        : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
    };
    return colors[color as keyof typeof colors];
  };

  const getBadgeClasses = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-100 text-emerald-700',
      blue: 'bg-blue-100 text-blue-700',
      orange: 'bg-orange-100 text-orange-700'
    };
    return colors[color as keyof typeof colors];
  };

  const handleSelectFPS = (fpsId: string) => {
    setSelectedFPSIds(prev => 
      prev.includes(fpsId) 
        ? prev.filter(id => id !== fpsId)
        : [...prev, fpsId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFPSIds.length === pendingFPS.length) {
      setSelectedFPSIds([]);
    } else {
      setSelectedFPSIds(pendingFPS.map(fps => fps.id));
    }
  };

  const handlePaySelected = () => {
    if (selectedFPSIds.length === 0) return;
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (selectedFPSIds.length === 0) return;
    
    const selectedFPSData = fpsHistory.filter(f => selectedFPSIds.includes(f.id));
    if (selectedFPSData.length === 0) return;
    
    setIsProcessingPayment(true);
    
    try {
      const baseTotalAmount = selectedFPSData.reduce((sum, fps) => sum + fps.amount, 0);
      const totalAmount = calculateTotalWithFees(baseTotalAmount, paymentMethod);
      const serviceFees = totalAmount - baseTotalAmount;
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          fps_amount: baseTotalAmount,
          service_fees: serviceFees,
          total_amount: totalAmount,
          currency: 'eur',
          fps_data: {
            fps_number: selectedFPSData.map(f => f.id).join(', '),
            fps_key: '89', // Valeur par défaut pour la démo
            license_plate: selectedFPSData.map(f => f.vehicle).join(', '),
            payment_method: paymentMethod,
          },
          success_url: `${window.location.origin}/?page=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/?page=dashboard&tab=fps`,
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
      setIsProcessingPayment(false);
    }
  };

  const handleDownloadPDF = async (fps: any) => {
    setDownloadingPDFs(prev => new Set(prev).add(fps.id));
    
    try {
      await downloadReceiptPDF({
        fps_number: fps.fps_number || fps.id,
        fps_key: fps.fps_key || '89',
        license_plate: fps.vehicle,
        fps_amount: fps.amount.toString(),
        service_fees: '0', // Pas de frais pour les FPS déjà payés
        total_amount: fps.amount.toString(),
        payment_method: fps.payment_method || 'immediate'
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Erreur lors du téléchargement du justificatif');
    } finally {
      setDownloadingPDFs(prev => {
        const newSet = new Set(prev);
        newSet.delete(fps.id);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Section FPS à payer */}
      {pendingFPS.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl">
          <div className="p-6 border-b border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-orange-900">FPS à payer</h2>
                  <p className="text-orange-700">Vous avez {pendingFPS.length} FPS en attente de paiement</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-orange-600">
                    {selectedFPSIds.length > 0 ? 'Sélectionnés' : 'Total à payer'}
                  </p>
                  <p className="text-2xl font-bold text-orange-900">
                    {selectedFPSIds.length > 0 ? selectedTotal : totalPending}€
                  </p>
                </div>
                {selectedFPSIds.length > 0 && (
                  <button
                    onClick={handlePaySelected}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <CreditCard className="w-4 h-4" />
                    Payer {selectedFPSIds.length} FPS
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Selection Controls */}
          <div className="px-6 py-3 bg-orange-25 border-b border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFPSIds.length === pendingFPS.length && pendingFPS.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-orange-900">
                    Tout sélectionner ({pendingFPS.length})
                  </span>
                </label>
                {selectedFPSIds.length > 0 && (
                  <span className="text-sm text-orange-700">
                    {selectedFPSIds.length} FPS sélectionné{selectedFPSIds.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {selectedFPSIds.length > 0 && (
                <button
                  onClick={() => setSelectedFPSIds([])}
                  className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                >
                  Désélectionner tout
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {pendingFPS.map((fps) => (
                <div key={fps.id} className="bg-white border border-orange-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedFPSIds.includes(fps.id)}
                        onChange={() => handleSelectFPS(fps.id)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900">{fps.id}</h3>
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-medium rounded-full">
                              À payer
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(fps.date).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {fps.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Car className="w-4 h-4" />
                              {fps.vehicle}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-orange-900">{fps.amount}€</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedFPSIds.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Payer {selectedFPSIds.length} FPS
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {selectedFPSIds.length === 1 ? 'Choisissez votre mode de paiement' : 'Paiement groupé - Choisissez votre mode de paiement'}
                  </p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* FPS Details */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {selectedFPSIds.length === 1 ? 'Détails du FPS' : `Détails des ${selectedFPSIds.length} FPS sélectionnés`}
                  </h4>
                  {selectedFPSIds.length === 1 ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {(() => {
                        const fps = selectedFPS[0];
                        return (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Numéro:</span>
                              <span className="font-mono">{fps.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Véhicule:</span>
                              <span className="font-mono">{fps.vehicle}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date:</span>
                              <span>{new Date(fps.date).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Lieu:</span>
                              <span>{fps.location}</span>
                            </div>
                            <div className="flex justify-between col-span-2 border-t pt-2">
                              <span className="text-gray-700 font-medium">Montant FPS:</span>
                              <span className="font-bold text-lg">{fps.amount}€</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedFPS.map((fps) => (
                        <div key={fps.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <FileText className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{fps.id}</p>
                              <p className="text-sm text-gray-600">{fps.vehicle} • {fps.location}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">{fps.amount}€</p>
                        </div>
                      ))}
                      <div className="flex justify-between col-span-2 border-t pt-3">
                        <span className="text-gray-700 font-medium">Total FPS:</span>
                        <span className="font-bold text-lg">{selectedTotal}€</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Options */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    Mode de paiement
                  </label>
                  <div className="grid gap-3">
                    {paymentOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = paymentMethod === option.id;
                      const totalWithFees = calculateTotalWithFees(selectedTotal, option.id);
                      const serviceFees = totalWithFees - selectedTotal;
                      
                      return (
                        <label
                          key={option.id}
                          className={`relative p-4 border-2 rounded-xl text-left transition-all duration-200 cursor-pointer ${getColorClasses(option.color, isSelected)} ${isSelected ? 'shadow-lg transform scale-105' : 'hover:transform hover:scale-102'}`}
                        >
                          <input
                            type="radio"
                            name="payment-method"
                            value={option.id}
                            checked={isSelected}
                            onChange={() => setPaymentMethod(option.id)}
                            className="sr-only"
                          />
                          {option.badge && (
                            <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${getBadgeClasses(option.color)}`}>
                              {option.badge}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? `bg-${option.color}-100` : 'bg-gray-100'}`}>
                                <Icon className={`w-5 h-5 ${isSelected ? `text-${option.color}-600` : 'text-gray-600'}`} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{option.title}</h4>
                                <p className="text-sm text-gray-600">{option.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-gray-900">{totalWithFees}€</p>
                              {serviceFees > 0 && (
                                <p className="text-sm text-gray-500">+{serviceFees}€ frais</p>
                              )}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 mb-3">Récapitulatif du paiement</h4>
                  <div className="space-y-2 text-sm">
                    {(() => {
                      const totalWithFees = calculateTotalWithFees(selectedTotal, paymentMethod);
                      const serviceFees = totalWithFees - selectedTotal;
                      
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Montant FPS ({selectedFPSIds.length} FPS):
                            </span>
                            <span className="font-semibold">{selectedTotal}€</span>
                          </div>
                          {serviceFees > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Frais de service ({paymentMethod === 'split3' ? '20%' : '15%'}):
                              </span>
                              <span className="font-semibold">{serviceFees}€</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span className="text-gray-900">
                              {paymentMethod === 'split3' ? `3 × ${calculateSplitAmount(totalWithFees, 3)}€` : 
                               paymentMethod === 'deferred' ? 'Total différé:' : 'Total:'}
                            </span>
                            <span className="text-gray-900">{totalWithFees}€</span>
                          </div>
                          {paymentMethod === 'split3' && (
                            <p className="text-xs text-gray-500">Prélèvements mensuels automatiques</p>
                          )}
                          {paymentMethod === 'deferred' && (
                            <p className="text-xs text-gray-500">À régler dans 30 jours</p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Payment Button */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    disabled={isProcessingPayment}
                    className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="flex-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Redirection...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Payer {calculateTotalWithFees(selectedTotal, paymentMethod)}€
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {pendingFPS.length > 0 ? 'Historique complet' : 'Historique des FPS'}
              </h2>
              <p className="text-gray-600 mt-1">Consultez et téléchargez vos justificatifs</p>
            </div>
            <div className="flex items-center gap-3">
              {pendingFPS.length > 0 && (
                <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-600">À payer</p>
                  <p className="text-lg font-bold text-orange-900">{totalPending}€</p>
                </div>
              )}
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-green-600">Total payé</p>
                <p className="text-lg font-bold text-green-900">{totalPaid}€</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro, lieu ou véhicule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="paid">Payés</option>
                <option value="pending">En attente</option>
                <option value="failed">Échecs</option>
              </select>
            </div>
          </div>
        </div>

        {/* FPS List */}
        <div className="divide-y divide-gray-200">
          {loadingFPS ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement de l'historique FPS...</p>
            </div>
          ) : fpsError ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
              <p className="text-red-600 mb-4">{fpsError}</p>
              <button
                onClick={loadFPSHistory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Réessayer
              </button>
            </div>
          ) : (
          filteredHistory.map((fps) => {
            const statusBadge = getStatusBadge(fps.status);
            return (
              <div key={fps.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{fps.id}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusBadge.style}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(fps.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {fps.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          {fps.vehicle}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Payé via {fps.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{fps.amount}€</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200 tooltip" title="Voir les détails">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDownloadPDF(fps)}
                        disabled={downloadingPDFs.has(fps.id)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200 tooltip disabled:opacity-50 disabled:cursor-not-allowed" 
                        title="Télécharger le justificatif PDF"
                      >
                        {downloadingPDFs.has(fps.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>

        {!loadingFPS && !fpsError && filteredHistory.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun FPS trouvé</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Vous n\'avez pas encore de FPS enregistrés'
              }
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
            <Download className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Télécharger tout en PDF</p>
              <p className="text-sm text-gray-600">Tous les justificatifs PDF</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200">
            <FileDown className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Rapport annuel</p>
              <p className="text-sm text-gray-600">Synthèse 2024</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Planifier export</p>
              <p className="text-sm text-gray-600">Export automatique</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}