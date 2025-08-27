import React, { useState } from 'react';
import { CreditCard, Calendar, Clock, Zap, AlertCircle, CheckCircle } from 'lucide-react';

export default function PaymentForm() {
  const [fpsNumber, setFpsNumber] = useState('');
  const [fpsKey, setFpsKey] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('immediate');
  const [isValidated, setIsValidated] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const paymentOptions = [
    {
      id: 'immediate',
      icon: Zap,
      title: 'Paiement immédiat',
      description: 'En une fois',
      color: 'green'
    },
    {
      id: 'split3',
      icon: CreditCard,
      title: 'Paiement en 3 fois',
      description: 'Sans frais',
      color: 'blue'
    },
    {
      id: 'split4',
      icon: CreditCard,
      title: 'Paiement en 4 fois',
      description: 'Sans frais',
      color: 'purple'
    },
    {
      id: 'deferred',
      icon: Calendar,
      title: 'Paiement différé',
      description: 'Dans 30 jours',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      green: isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300',
      blue: isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300',
      purple: isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300',
      orange: isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
    };
    return colors[color as keyof typeof colors];
  };

  const calculateSplitAmount = (total: number, splits: number) => {
    return (total / splits).toFixed(2);
  };

  const formatFpsNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Apply the format: 14 digits + 2 digits + 1 + 3 + 3 + 3
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

  const handleFpsNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatFpsNumber(e.target.value);
    setFpsNumber(formatted);
  };

  const handleFpsKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 2);
    setFpsKey(value);
  };

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().substring(0, 4);
    setLicensePlate(value);
  };

  const isFormValid = fpsNumber.replace(/\s/g, '').length === 26 && fpsKey.length === 2 && licensePlate.length === 4;

  const handleValidate = async () => {
    if (!isFormValid) return;
    
    setIsValidating(true);
    
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulation d'un montant aléatoire entre 35€ et 135€
    const simulatedAmount = Math.floor(Math.random() * 100) + 35;
    setAmount(simulatedAmount);
    setIsValidated(true);
    setIsValidating(false);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Payer mon FPS
          </h2>
          <p className="text-xl text-gray-600">
            Saisissez vos informations et choisissez votre mode de paiement
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Informations requises</h3>
                    <p className="text-sm text-blue-700">
                      Ces informations se trouvent sur votre avis de paiement FPS
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="fps-number" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de l'avis de paiement *
                </label>
                <input
                  type="text"
                  id="fps-number"
                  value={fpsNumber}
                  onChange={handleFpsNumberChange}
                  placeholder="Ex: 12345678901234 56 7 890 123 456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: 14 chiffres + 2 chiffres + 1 + 3 + 3 + 3 (26 chiffres au total)
                </p>
              </div>

              <div>
                <label htmlFor="fps-key" className="block text-sm font-medium text-gray-700 mb-2">
                  Clé de contrôle *
                </label>
                <input
                  type="text"
                  id="fps-key"
                  value={fpsKey}
                  onChange={handleFpsKeyChange}
                  placeholder="Ex: 89"
                  maxLength={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  2 chiffres situés après le numéro d'avis
                </p>
              </div>

              <div>
                <label htmlFor="license-plate" className="block text-sm font-medium text-gray-700 mb-2">
                  Immatriculation du véhicule *
                </label>
                <input
                  type="text"
                  id="license-plate"
                  value={licensePlate}
                  onChange={handleLicensePlateChange}
                  placeholder="Ex: AB12"
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 font-mono uppercase"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Les 4 premiers caractères de votre plaque d'immatriculation
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleValidate}
                  disabled={!isFormValid || isValidating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isValidating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Vérification en cours...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Valider les informations
                    </>
                  )}
                </button>
                {!isFormValid && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Veuillez remplir tous les champs pour continuer
                  </p>
                )}
              </div>

              {isValidated && amount && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-green-900">Informations validées</h3>
                  </div>
                  <p className="text-sm text-green-700">
                    Montant à régler : <span className="font-bold text-lg">{amount},00 €</span>
                  </p>
                </div>
              )}

              {isValidated && (
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Mode de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = paymentMethod === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentMethod(option.id)}
                        className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${getColorClasses(option.color, isSelected)}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isSelected ? `text-${option.color}-600` : 'text-gray-500'}`} />
                          <div>
                            <p className={`font-medium ${isSelected ? `text-${option.color}-900` : 'text-gray-900'}`}>
                              {option.title}
                            </p>
                            <p className={`text-sm ${isSelected ? `text-${option.color}-600` : 'text-gray-500'}`}>
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Récapitulatif
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro d'avis:</span>
                  <span className="font-mono text-sm">{fpsNumber || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clé:</span>
                  <span className="font-mono">{fpsKey || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Immatriculation:</span>
                  <span className="font-mono">{licensePlate || '-'}</span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="text-gray-600">Montant total:</span>
                  <span className="font-bold text-lg">
                    {amount ? `${amount},00 €` : 'À déterminer'}
                  </span>
                </div>
              </div>

              {isValidated && amount && (
                <div className="bg-white rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Répartition du paiement:</h4>
                <div className="space-y-2 text-sm">
                  {paymentMethod === 'immediate' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paiement unique:</span>
                      <span className="font-medium">{amount},00 €</span>
                    </div>
                  )}
                  {paymentMethod === 'split3' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">3 × {calculateSplitAmount(amount, 3)} €</span>
                        <span className="font-medium">{amount},00 €</span>
                      </div>
                      <p className="text-xs text-gray-500">Prélèvements mensuels automatiques</p>
                    </>
                  )}
                  {paymentMethod === 'split4' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">4 × {calculateSplitAmount(amount, 4)} €</span>
                        <span className="font-medium">{amount},00 €</span>
                      </div>
                      <p className="text-xs text-gray-500">Prélèvements mensuels automatiques</p>
                    </>
                  )}
                  {paymentMethod === 'deferred' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paiement différé:</span>
                        <span className="font-medium">{amount},00 €</span>
                      </div>
                      <p className="text-xs text-gray-500">À régler dans 30 jours</p>
                    </>
                  )}
                </div>
              </div>
              )}

              <button 
                disabled={!isValidated || !amount}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payer maintenant
                </div>
              </button>
              
              {!isValidated && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Validez d'abord vos informations pour accéder au paiement
                </p>
              )}

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  Justificatif immédiat par email
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
