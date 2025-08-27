import React, { useState } from 'react';
import { Car, Bell, Smartphone, FileText, CheckCircle, User, Plus, AlertTriangle, Shield } from 'lucide-react';

interface VehicleRegistrationProps {
  onNavigate: (page: string) => void;
}

export default function VehicleRegistration({ onNavigate }: VehicleRegistrationProps) {
  const [vehicles] = useState([
    {
      id: '1',
      licensePlate: 'AB-123-CD',
      brand: 'Renault',
      model: 'Clio',
      year: 2020,
      color: 'Bleu',
      notifications: true,
      lastFPS: '2024-01-20',
      totalFPS: 5,
      isActive: true
    },
    {
      id: '2',
      licensePlate: 'EF-456-GH',
      brand: 'Peugeot',
      model: '308',
      year: 2019,
      color: 'Blanc',
      notifications: true,
      lastFPS: '2024-01-18',
      totalFPS: 3,
      isActive: true
    }
  ]);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" aria-labelledby="vehicle-registration-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Car className="w-4 h-4" />
            Surveillance automatique
          </div>
          <h2 id="vehicle-registration-title" className="text-4xl font-bold text-gray-900 mb-4">
            Simplifiez vos prochains FPS
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Créez votre compte et enregistrez vos véhicules pour une expérience 100% dématérialisée. 
            Plus de courrier, plus d'oublis !
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Benefits */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Détection automatique des FPS</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Notre système surveille automatiquement l'émission de nouveaux FPS pour vos véhicules enregistrés. 
                    Vous recevez une notification instantanée dès qu'un FPS vous est adressé.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Fini le courrier postal</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Plus besoin d'attendre le courrier ! Recevez vos notifications par email et SMS 
                    dès qu'un FPS est émis. Payez directement depuis votre espace client.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Paiement en un clic</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Vos véhicules et moyens de paiement sont enregistrés. 
                    Payez vos FPS en quelques secondes, où que vous soyez.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-semibold text-green-900 text-lg">Service 100% gratuit</span>
              </div>
              <p className="text-green-700">
                La création de compte et l'enregistrement de vos véhicules sont entièrement gratuits. 
                Aucun abonnement, aucun frais cachés. Vous ne payez que vos FPS.
              </p>
            </div>
          </div>

          {/* Vehicle Management Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Mes véhicules</h3>
                  <button className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {vehicles.map((vehicle, index) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{vehicle.licensePlate}</p>
                          <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1">
                            <Bell className="w-3 h-3" />
                            Surveillé
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </p>
                        <p className="text-xs text-gray-500">
                          {vehicle.totalFPS} FPS détectés • Dernier: {new Date(vehicle.lastFPS).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${vehicle.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                  </div>
                ))}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Car className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Ajoutez vos véhicules pour activer la surveillance</p>
                </div>
              </div>

              <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Shield className="w-4 h-4" />
                  <span>Surveillance 24h/24 • Notifications instantanées • Paiement facilité</span>
                </div>
              </div>
            </div>

            {/* Floating notification example */}
            <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Bell className="w-4 h-4" />
                Nouveau FPS détecté !
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Rejoignez plus de 10 000 utilisateurs
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Qui ont simplifié la gestion de leurs FPS avec Zenia
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => onNavigate('register')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <User className="w-5 h-5" />
                  Créer mon compte
                </button>
                
                <button 
                  onClick={() => onNavigate('login')}
                  className="border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 py-4 px-6 rounded-xl font-semibold transition-all duration-200"
                >
                  J'ai déjà un compte
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Gratuit
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Sans engagement
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Sécurisé
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}