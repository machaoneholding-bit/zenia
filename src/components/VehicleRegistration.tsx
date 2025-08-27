import React, { useState } from 'react';
import { Car, Bell, Smartphone, FileText, CheckCircle, User, Plus, AlertTriangle, Shield, Building2, Users, BarChart3, Clock } from 'lucide-react';

interface VehicleRegistrationProps {
  onNavigate: (page: string) => void;
}

export default function VehicleRegistration({ onNavigate }: VehicleRegistrationProps) {
  const [companyVehicles] = useState([
    {
      id: '1',
      licensePlate: 'ENT-001-FR',
      brand: 'Mercedes',
      model: 'Sprinter',
      year: 2022,
      color: 'Blanc',
      notifications: true,
      lastFPS: '2024-01-20',
      totalFPS: 12,
      isActive: true
    },
    {
      id: '2',
      licensePlate: 'ENT-002-FR',
      brand: 'Ford',
      model: 'Transit',
      year: 2021,
      color: 'Gris',
      notifications: true,
      lastFPS: '2024-01-18',
      totalFPS: 8,
      isActive: true
    },
    {
      id: '3',
      licensePlate: 'ENT-003-FR',
      brand: 'Renault',
      model: 'Master',
      year: 2023,
      color: 'Blanc',
      notifications: true,
      lastFPS: '2024-01-15',
      totalFPS: 5,
      isActive: true
    }
  ]);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" aria-labelledby="company-surveillance-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Building2 className="w-4 h-4" />
            Solution Entreprise
          </div>
          <h2 id="company-surveillance-title" className="text-4xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">Entreprises :</span> Fini le courrier postal !
          </h2>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Surveillez automatiquement les FPS de votre flotte - 100% dématérialisé
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Service dédié aux entreprises pour surveiller automatiquement les FPS de votre flotte. 
            Zéro courrier postal, zéro papier, zéro oubli. Tout se passe en ligne avec SIRET obligatoire.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Benefits */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Service entreprise 100% dématérialisé</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Spécialement conçu pour les entreprises : plus aucun courrier postal à gérer ! 
                    Détection automatique 24h/24 de tous les FPS de votre flotte avec SIRET obligatoire.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Flotte d'entreprise : zéro oubli, zéro majoration</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Surveillance dédiée aux flottes d'entreprise : alertes instantanées dès qu'un FPS est émis 
                    sur l'un de vos véhicules. Plus d'oublis, plus de majorations à 180€ !
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Facturation entreprise centralisée</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Facturation centralisée pour toute votre flotte avec SIRET obligatoire. 
                    Tous les justificatifs sont générés automatiquement pour votre comptabilité d'entreprise.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-semibold text-blue-900 text-lg">Solution Entreprise</span>
              </div>
              <p className="text-blue-700">
                Service dédié aux entreprises : zéro courrier postal, zéro majoration ! 
                Surveillance automatique de votre flotte avec SIRET obligatoire. Économisez jusqu'à 75% sur les pénalités.
              </p>
            </div>
          </div>

          {/* Company Fleet Management Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-white" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">Flotte Entreprise</h3>
                      <p className="text-blue-100 text-sm">SIRET: 123 456 789 00012</p>
                    </div>
                  </div>
                  <button className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {companyVehicles.map((vehicle, index) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{vehicle.licensePlate}</p>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1">
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Statistiques de flotte</p>
                        <p className="text-sm text-blue-700">{companyVehicles.length} véhicules • {companyVehicles.reduce((sum, v) => sum + v.totalFPS, 0)} FPS détectés</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-900">245€</p>
                      <p className="text-xs text-blue-600">Total ce mois</p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Car className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Ajoutez les véhicules de votre entreprise</p>
                </div>
              </div>

              <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Shield className="w-4 h-4" />
                  <span>Zéro courrier postal • 100% dématérialisé • Zéro oubli</span>
                </div>
              </div>
            </div>

            {/* Floating notification example for company */}
            <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Bell className="w-4 h-4" />
                3 nouveaux FPS détectés !
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Rejoignez plus de 500 entreprises qui ont supprimé le courrier postal
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  En moyenne 2 400€ d'économies par an grâce à la surveillance automatique des flottes
                </p>
              </div>

              {/* Company Registration Form Preview */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 text-left">Informations entreprise requises :</h4>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Raison sociale de l'entreprise</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Numéro SIRET (obligatoire pour la surveillance)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Adresse du siège social</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Contact administrateur (email + téléphone)</span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => onNavigate('register')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Building2 className="w-5 h-5" />
                  Créer un compte entreprise
                </button>
                
                <button 
                  onClick={() => onNavigate('login')}
                  className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 py-4 px-6 rounded-xl font-semibold transition-all duration-200"
                >
                  J'ai déjà un compte
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Service entreprise
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  SIRET obligatoire
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Flotte surveillée
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
