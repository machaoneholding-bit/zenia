import React, { useState } from 'react';
import { CreditCard, Calendar, Clock, Zap, AlertCircle, CheckCircle, Shield, Camera, Scan, Plus, X, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import CameraScanner from './CameraScanner';

export default function PaymentFormAlt() {
  const { user } = useAuth();
  const [fpsList, setFpsList] = useState([{
    id: 1,
    fpsNumber: '',
    fpsKey: '',
    licensePlate: '',
    amount: null as number | null,
    isValidated: false
  }]);
  const [paymentMethod, setPaymentMethod] = useState('immediate');
  const [validatingIndex, setValidatingIndex] = useState<number | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: number]: string}>({});
  const [showScanner, setShowScanner] = useState(false);
  const [scanningForIndex, setScanningForIndex] = useState<number | null>(null);

  const saveFPSToDatabase = async (fpsData: any, sessionId: string) => {
    if (!user) return;

    try {
      // Save all FPS records
      const fpsRecords = fpsList
        .filter(fps => fps.isValidated && fps.amount)
        .map(fps => ({
          user_id: user.id,
          vehicle_id: null,
          fps_number: fps.fpsNumber,
          fps_key: fps.fpsKey,
          amount: fps.amount!,
          status: 'processing',
          location: 'Saisie manuelle',
          payment_method: fpsData.payment_method,
          payment_date: new Date().toISOString()
        }));

      if (fpsRecords.length === 0) return;

      const { error } = await supabase
        .from('fps_records')
        .insert(fpsRecords);

      if (error) {
        console.error('Error saving FPS to database:', error);
      } else {
        console.log('All FPS saved to database successfully');
      }
    } catch (err) {
      console.error('Error in saveFPSToDatabase:', err);
    }
  };

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
      title: 'Paiement fractionné',
      description: 'En 3 fois',
      color: 'blue',
      badge: 'Populaire'
    },
    {
      id: 'deferred',
      icon: Calendar,
      title: 'Paiement différé',
      description: 'Dans 30 jours',
      color: 'orange',
      badge: 'Nouveau'
    }
  ];

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

  const calculateTotalWithFees = (baseAmount: number, method: string) => {
    switch (method) {
      case 'immediate':
        return baseAmount; // 0% de frais
      case 'split3':
        return Math.round(baseAmount * 1.20); // +20% de frais
      case 'deferred':
        return Math.round(baseAmount * 1.15); // +15% de frais
      default:
        return baseAmount;
    }
  };

  const getTotalAmount = () => {
    return fpsList
      .filter(fps => fps.isValidated && fps.amount)
      .reduce((sum, fps) => sum + fps.amount!, 0);
  };

  const getAllValidated = () => {
    return fpsList.every(fps => fps.isValidated && fps.amount);
  };

  const addNewFPS = () => {
    const newId = Math.max(...fpsList.map(fps => fps.id)) + 1;
    setFpsList([...fpsList, {
      id: newId,
      fpsNumber: '',
      fpsKey: '',
      licensePlate: '',
      amount: null,
      isValidated: false
    }]);
  };

  const removeFPS = (id: number) => {
    if (fpsList.length > 1) {
      setFpsList(fpsList.filter(fps => fps.id !== id));
      // Clear validation errors for removed FPS
      const newErrors = { ...validationErrors };
      delete newErrors[id];
      setValidationErrors(newErrors);
    }
  };

  const updateFPS = (id: number, field: string, value: string) => {
    setFpsList(fpsList.map(fps => 
      fps.id === id ? { ...fps, [field]: value, isValidated: false, amount: null } : fps
    ));
    
    // Clear validation error for this FPS
    if (validationErrors[id]) {
      const newErrors = { ...validationErrors };
      delete newErrors[id];
      setValidationErrors(newErrors);
    }
  };
  const handlePayment = async () => {
    const totalAmount = getTotalAmount();
    if (!getAllValidated() || totalAmount === 0) return;
    
    setIsProcessingPayment(true);
    
    try {
      const totalWithFees = calculateTotalWithFees(totalAmount, paymentMethod);
      const serviceFees = totalWithFees - totalAmount;
      
      const fpsData = {
        fps_number: fpsList.map(fps => fps.fpsNumber).join(', '),
        fps_key: fpsList.map(fps => fps.fpsKey).join(', '),
        license_plate: fpsList.map(fps => fps.licensePlate).join(', '),
        payment_method: paymentMethod,
        fps_amount: totalAmount.toString(),
        service_fees: serviceFees.toString(),
        total_amount: totalWithFees.toString()
      };

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          fps_amount: totalAmount,
          service_fees: serviceFees,
          total_amount: totalWithFees,
          currency: 'eur',
          fps_data: fpsData,
          success_url: `${window.location.origin}/?page=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/?page=cancel`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Save FPS to database before redirecting to payment
        if (user) {
          await saveFPSToDatabase(fpsData, data.session_id || '');
        }
        
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

  const handleScanResult = (data: { fpsNumber: string; fpsKey: string; licensePlate: string }) => {
    if (scanningForIndex !== null) {
      updateFPS(scanningForIndex, 'fpsNumber', data.fpsNumber);
      updateFPS(scanningForIndex, 'fpsKey', data.fpsKey);
      updateFPS(scanningForIndex, 'licensePlate', data.licensePlate);
    }
    setShowScanner(false);
    setScanningForIndex(null);
    
    // Auto-focus on validate button after scan
    setTimeout(() => {
      const validateButton = document.getElementById(`validate-button-${scanningForIndex}`) as HTMLButtonElement;
      if (validateButton && !validateButton.disabled) {
        validateButton.focus();
      }
    }, 100);
  };

  const formatFpsNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = '';
    if (numbers.length > 0) {
      formatted += numbers.substring(0, 14);
      if (numbers.length > 14) {
        formatted += ' ' + numbers.substring(14, 16);
        if (numbers.length > 16) {
          formatted += ' ' + numbers.substring(16, 17);
          if (numbers.length > 17) {
            formatted += ' ' + numbers.substring(17, 20);
            if (numbers.length > 20) {
              formatted += ' ' + numbers.substring(20, 23);
              if (numbers.length > 23) {
                formatted += ' ' + numbers.substring(23, 26);
              }
            }
          }
        }
      }
    }
    return formatted;
  };

  const handleFpsNumberChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatFpsNumber(e.target.value);
    updateFPS(id, 'fpsNumber', formatted);
    
    if (formatted.replace(/\s/g, '').length === 26) {
      const fpsKeyInput = document.getElementById(`fps-key-${id}`) as HTMLInputElement;
      if (fpsKeyInput) {
        setTimeout(() => fpsKeyInput.focus(), 100);
      }
    }
  };

  const handleFpsKeyChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 2);
    updateFPS(id, 'fpsKey', value);
    
    if (validationErrors[id]) {
      const newErrors = { ...validationErrors };
      delete newErrors[id];
      setValidationErrors(newErrors);
    }
    
    if (value.length === 2) {
      const licensePlateInput = document.getElementById(`license-plate-${id}`) as HTMLInputElement;
      if (licensePlateInput) {
        setTimeout(() => licensePlateInput.focus(), 100);
      }
    }
  };

  const handleLicensePlateChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().substring(0, 4);
    updateFPS(id, 'licensePlate', value);
    
    if (value.length === 4) {
      const validateButton = document.getElementById(`validate-button-${id}`) as HTMLButtonElement;
      if (validateButton && !validateButton.disabled) {
        setTimeout(() => validateButton.focus(), 100);
      }
    }
  };

  const isFPSValid = (fps: any) => {
    return fps.fpsNumber.replace(/\s/g, '').length === 26 && 
           fps.fpsKey.length === 2 && 
           fps.licensePlate.length === 4;
  };

  const handleValidate = async (fpsIndex: number) => {
    const fps = fpsList[fpsIndex];
    if (!isFPSValid(fps)) return;
    
    if (fps.fpsKey === '00') {
      setValidationErrors({
        ...validationErrors,
        [fps.id]: 'La clé de contrôle "00" n\'est pas valide. Veuillez vérifier votre avis de paiement.'
      });
      return;
    }
    
    setValidatingIndex(fpsIndex);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const simulatedAmount = Math.floor(Math.random() * 100) + 35;
    
    setFpsList(fpsList.map((f, i) => 
      i === fpsIndex ? { ...f, amount: simulatedAmount, isValidated: true } : f
    ));
    setValidatingIndex(null);
  };

  return (
    <section id="payment-section" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" aria-labelledby="payment-form-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Paiement 100% sécurisé
          </div>
          <h2 id="payment-form-title" className="text-4xl font-bold text-gray-900 mb-4">
            Payer mon FPS
          </h2>
          <p className="text-xl text-gray-600">
            Saisissez vos informations et choisissez votre mode de paiement
          </p>
        </header>

        <div className="max-w-5xl mx-auto">
          <form className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden" role="form" aria-labelledby="payment-form-title">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                Informations de votre avis FPS
              </h3>
              <p className="text-blue-100 mt-2">
                Ces informations se trouvent sur votre avis de paiement
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm"
                >
                  <Camera className="w-4 h-4" />
                  Scanner avec la caméra
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid lg:grid-cols-5 gap-8">
                {/* Form Fields */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Scanner Button */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Scan className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-indigo-900">Scan automatique</h3>
                          <p className="text-sm text-indigo-700">Utilisez votre caméra pour remplir automatiquement le formulaire</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowScanner(true);
                          setScanningForIndex(fpsList[0].id);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Scanner
                      </button>
                    </div>
                  </div>

                  {/* FPS Forms */}
                  {fpsList.map((fps, index) => (
                    <div key={fps.id} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          FPS #{index + 1}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowScanner(true);
                              setScanningForIndex(fps.id);
                            }}
                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                          >
                            <Camera className="w-3 h-3" />
                            Scanner
                          </button>
                          {fpsList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFPS(fps.id)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor={`fps-number-${fps.id}`} className="block text-sm font-semibold text-gray-700 mb-2">
                            Numéro de l'avis de paiement *
                          </label>
                          <input
                            type="text"
                            id={`fps-number-${fps.id}`}
                            name={`fps-number-${fps.id}`}
                            autoComplete="off"
                            aria-describedby={`fps-number-help-${fps.id}`}
                            value={fps.fpsNumber}
                            onChange={(e) => handleFpsNumberChange(fps.id, e)}
                            placeholder="Ex: 12345678901234 56 7 890 123 456"
                            className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono"
                          />
                          <p id={`fps-number-help-${fps.id}`} className="text-xs text-gray-500 mt-1">
                            Format: 14 chiffres + 2 chiffres + 1 + 3 + 3 + 3 (26 chiffres au total)
                          </p>
                        </div>

                        <div>
                          <label htmlFor={`fps-key-${fps.id}`} className="block text-sm font-semibold text-gray-700 mb-2">
                            Clé de contrôle *
                          </label>
                          <input
                            type="text"
                            id={`fps-key-${fps.id}`}
                            name={`fps-key-${fps.id}`}
                            autoComplete="off"
                            aria-describedby={`fps-key-help-${fps.id}`}
                            value={fps.fpsKey}
                            onChange={(e) => handleFpsKeyChange(fps.id, e)}
                            placeholder="Ex: 89"
                            maxLength={2}
                            className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 transition-all duration-200 font-mono ${
                              validationErrors[fps.id] && fps.fpsKey === '00'
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                                : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                          />
                          <p id={`fps-key-help-${fps.id}`} className="text-xs text-gray-500 mt-1">
                            2 chiffres après le numéro
                          </p>
                          {validationErrors[fps.id] && fps.fpsKey === '00' && (
                            <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-red-700">{validationErrors[fps.id]}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <label htmlFor={`license-plate-${fps.id}`} className="block text-sm font-semibold text-gray-700 mb-2">
                            Immatriculation *
                          </label>
                          <input
                            type="text"
                            id={`license-plate-${fps.id}`}
                            name={`license-plate-${fps.id}`}
                            autoComplete="off"
                            aria-describedby={`license-plate-help-${fps.id}`}
                            value={fps.licensePlate}
                            onChange={(e) => handleLicensePlateChange(fps.id, e)}
                            placeholder="Ex: AB12"
                            maxLength={4}
                            className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono uppercase"
                          />
                          <p id={`license-plate-help-${fps.id}`} className="text-xs text-gray-500 mt-1">
                            4 premiers caractères
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-300 mt-4">
                        <button
                          id={`validate-button-${fps.id}`}
                          onClick={() => handleValidate(index)}
                          disabled={!isFPSValid(fps) || validatingIndex === index || (fps.fpsKey === '00')}
                          type="button"
                          aria-describedby={`validation-help-${fps.id}`}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          {validatingIndex === index ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Vérification...
                            </>
                          ) : fps.isValidated ? (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Validé - {fps.amount}€
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-5 h-5" />
                              Valider ce FPS
                            </>
                          )}
                        </button>
                        <p id={`validation-help-${fps.id}`} className="sr-only">
                          Cliquez pour valider les informations de ce FPS
                        </p>
                        {!isFPSValid(fps) && !validationErrors[fps.id] && (
                          <p className="text-sm text-gray-500 mt-2 text-center">
                            Veuillez remplir tous les champs pour ce FPS
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add FPS Button */}
                  {fpsList.length < 5 && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={addNewFPS}
                        className="bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 w-full"
                      >
                        <Plus className="w-5 h-5" />
                        Ajouter un autre FPS
                      </button>
                    </div>
                  )}

                  {getAllValidated() && getTotalAmount() > 0 && (
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                        <h3 className="font-semibold text-emerald-900 text-lg">
                          {fpsList.filter(fps => fps.isValidated).length} FPS validé{fpsList.filter(fps => fps.isValidated).length > 1 ? 's' : ''}
                        </h3>
                      </div>
                      <p className="text-emerald-700">
                        Montant total à régler : <span className="font-bold text-2xl">{getTotalAmount()},00 €</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Sidebar avec options de paiement */}
                <aside className="lg:col-span-2 space-y-6" aria-labelledby="payment-info-title">
                  {/* Montant */}
                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600 mb-1">Montant à payer</p>
                      <p className="text-4xl font-bold text-gray-900">
                        {getAllValidated() ? `${getTotalAmount()},00 €` : '35,00 €'}
                      </p>
                      {!getAllValidated() && (
                        <p className="text-xs text-gray-500 mt-1">Exemple de montant</p>
                      )}
                      {fpsList.filter(fps => fps.isValidated).length > 0 && !getAllValidated() && (
                        <p className="text-xs text-blue-600 mt-1">
                          {fpsList.filter(fps => fps.isValidated).length} FPS validé{fpsList.filter(fps => fps.isValidated).length > 1 ? 's' : ''} sur {fpsList.length}
                        </p>
                      )}
                    </div>

                    {/* Options de paiement */}
                    <div className="space-y-3 mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Mode de paiement
                      </label>
                      {paymentOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = getAllValidated() && paymentMethod === option.id;
                        const baseAmount = getAllValidated() ? getTotalAmount() : 35; // Exemple de montant
                        const totalWithFees = calculateTotalWithFees(baseAmount, option.id);
                        const serviceFees = totalWithFees - baseAmount;
                        const isDisabled = !getAllValidated();
                        
                        return (
                          <label
                            key={option.id}
                            className={`relative p-4 border-2 rounded-xl text-left transition-all duration-200 block ${
                              isDisabled 
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
                                : `cursor-pointer ${getColorClasses(option.color, isSelected)} ${isSelected ? 'shadow-lg transform scale-105' : 'hover:transform hover:scale-102'}`
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment-method"
                              value={option.id}
                              checked={isSelected}
                              onChange={() => getAllValidated() && setPaymentMethod(option.id)}
                              disabled={isDisabled}
                              className="sr-only"
                            />
                            {option.badge && (
                              <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${
                                isDisabled ? 'bg-gray-100 text-gray-500' : getBadgeClasses(option.color)
                              }`}>
                                {option.badge}
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isDisabled 
                                    ? 'bg-gray-100' 
                                    : isSelected ? `bg-${option.color}-100` : 'bg-gray-100'
                                }`}>
                                  <Icon className={`w-4 h-4 ${
                                    isDisabled 
                                      ? 'text-gray-400' 
                                      : isSelected ? `text-${option.color}-600` : 'text-gray-500'
                                  }`} />
                                </div>
                                <div>
                                  <p className={`font-semibold text-sm ${
                                    isDisabled 
                                      ? 'text-gray-500' 
                                      : isSelected ? `text-${option.color}-900` : 'text-gray-900'
                                  }`}>
                                    {option.title}
                                  </p>
                                  <p className={`text-xs ${
                                    isDisabled 
                                      ? 'text-gray-400' 
                                      : isSelected ? `text-${option.color}-600` : 'text-gray-500'
                                  }`}>
                                    {option.description}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-lg font-bold ${isDisabled ? 'text-gray-500' : 'text-gray-900'}`}>
                                  {totalWithFees}€
                                </p>
                              </div>
                            </div>
                            
                            {/* Payment breakdown for selected option */}
                            {getAllValidated() && paymentMethod === option.id && option.id === 'deferred' && (
                              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                  <span>Maintenant</span>
                                  <span className="font-medium">0€</span>
                                </div>
                                <div className="text-center text-xs text-green-600 font-medium py-1">
                                  Recevez votre justificatif
                                </div>
                                <div className="flex justify-between text-gray-600">
                                  <span>Dans 30 jours</span>
                                  <span className="font-medium">{totalWithFees}€</span>
                                </div>
                              </div>
                            )}
                            {getAllValidated() && paymentMethod === option.id && option.id === 'split3' && (
                              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                  <span>1× Maintenant</span>
                                  <span className="font-medium">{Math.round(totalWithFees / 3)}€</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                  <span>1× Dans 30 jours</span>
                                  <span className="font-medium">{Math.round(totalWithFees / 3)}€</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                  <span>1× Dans 60 jours</span>
                                  <span className="font-medium">{Math.round(totalWithFees / 3)}€</span>
                                </div>
                              </div>
                            )}
                          </label>
                        );
                      })}
                    </div>

                    {/* Détail du paiement */}
                    <div className="space-y-3 text-sm mb-6 bg-gray-50 p-4 rounded-lg">
                      {(() => {
                        const baseAmount = getAllValidated() ? getTotalAmount() : 35;
                        const currentMethod = getAllValidated() ? paymentMethod : 'immediate'; // Montrer l'exemple avec l'immédiat
                        const totalWithFees = calculateTotalWithFees(baseAmount, currentMethod);
                        const serviceFees = totalWithFees - baseAmount;
                        
                        return (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Montant FPS:</span>
                              <span className={`font-semibold ${!getAllValidated() ? 'text-gray-500' : ''}`}>
                                {baseAmount},00 €
                              </span>
                            </div>
                            {serviceFees > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Frais de service:</span>
                                <span className={`font-semibold ${!getAllValidated() ? 'text-gray-500' : ''}`}>
                                  {serviceFees},00 €
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                              <span className={!getAllValidated() ? 'text-gray-500' : ''}>Total:</span>
                              <span className={!getAllValidated() ? 'text-gray-500' : ''}>{totalWithFees},00 €</span>
                            </div>
                            {!getAllValidated() && (
                              <p className="text-xs text-gray-500 text-center mt-2">
                                Exemple basé sur un FPS de 35€ (paiement immédiat)
                              </p>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    {/* Bouton de paiement */}
                    <button 
                      onClick={handlePayment}
                      disabled={!getAllValidated() || getTotalAmount() === 0 || isProcessingPayment}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isProcessingPayment ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Redirection...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            {getAllValidated() && getTotalAmount() > 0 ? (
                              `Payer ${(() => {
                                const totalWithFees = calculateTotalWithFees(getTotalAmount(), paymentMethod);
                                return `${totalWithFees},00 €`;
                              })()}`
                            ) : (
                              fpsList.filter(fps => fps.isValidated).length > 0 
                                ? `Validez les ${fpsList.length - fpsList.filter(fps => fps.isValidated).length} FPS restants`
                                : 'Validez d\'abord vos informations'
                            )}
                          </>
                        )}
                      </div>
                    </button>
                    
                    {!getAllValidated() && (
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-600" />
                          <p className="text-sm text-blue-700">
                            {fpsList.filter(fps => fps.isValidated).length > 0 
                              ? `Validez les ${fpsList.length - fpsList.filter(fps => fps.isValidated).length} FPS restants pour continuer`
                              : 'Remplissez et validez au moins un FPS pour activer le paiement'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </aside>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Camera Scanner Modal */}
      {showScanner && (
        <CameraScanner
          onScanResult={handleScanResult}
          onClose={() => setShowScanner(false)}
        />
      )}
    </section>
  );
}
