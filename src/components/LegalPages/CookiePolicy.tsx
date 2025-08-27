import React from 'react';
import { ArrowLeft, Cookie, Settings, Eye, BarChart, Calendar } from 'lucide-react';
import Logo from '../Logo';

interface CookiePolicyProps {
  onNavigate: (page: string) => void;
}

export default function CookiePolicy({ onNavigate }: CookiePolicyProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
            >
              <Logo size="md" />
              <span className="text-2xl font-bold text-gray-900">Zenia</span>
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Page Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Politique des cookies</h1>
                <p className="text-orange-100 mt-2">Utilisation des cookies et technologies similaires</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Cookie className="w-6 h-6 text-orange-600 mt-1" />
                  <div>
                    <h2 className="font-semibold text-orange-900 mb-2">Qu'est-ce qu'un cookie ?</h2>
                    <p className="text-orange-700">
                      Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web. 
                      Il permet de mémoriser des informations sur votre navigation et d'améliorer votre expérience.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Types de cookies */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Types de cookies utilisés</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-green-600" />
                    Cookies strictement nécessaires
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Authentification et session utilisateur</li>
                    <li>• Sécurité et protection CSRF</li>
                    <li>• Préférences de langue</li>
                    <li>• Panier et processus de paiement</li>
                  </ul>
                  <div className="mt-3 text-sm text-green-600 font-medium">
                    ✓ Toujours actifs (nécessaires au fonctionnement)
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-blue-600" />
                    Cookies analytiques
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Ces cookies nous aident à comprendre comment vous utilisez le site pour l'améliorer.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Google Analytics (trafic et comportement)</li>
                    <li>• Statistiques de performance</li>
                    <li>• Analyse des erreurs</li>
                    <li>• Optimisation de l'expérience utilisateur</li>
                  </ul>
                  <div className="mt-3 text-sm text-blue-600 font-medium">
                    ⚙️ Configurables (avec votre consentement)
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    Cookies de personnalisation
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Ces cookies permettent de personnaliser votre expérience sur le site.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Préférences d'affichage</li>
                    <li>• Historique de navigation</li>
                    <li>• Recommandations personnalisées</li>
                    <li>• Sauvegarde des formulaires</li>
                  </ul>
                  <div className="mt-3 text-sm text-purple-600 font-medium">
                    ⚙️ Configurables (avec votre consentement)
                  </div>
                </div>
              </div>
            </section>

            {/* Durée de conservation */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Durée de conservation</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Cookies de session</h3>
                  <p className="text-gray-700">Supprimés automatiquement à la fermeture du navigateur</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Cookies persistants</h3>
                  <p className="text-gray-700">Conservés maximum 13 mois, puis supprimés automatiquement</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Cookies analytiques</h3>
                  <p className="text-gray-700">Conservés 26 mois maximum (Google Analytics)</p>
                </div>
              </div>
            </section>

            {/* Gestion des cookies */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestion de vos cookies</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Via votre navigateur</h3>
                  <p className="text-blue-700 mb-3">
                    Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies :
                  </p>
                  <ul className="space-y-2 text-blue-700">
                    <li>• <strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
                    <li>• <strong>Firefox :</strong> Paramètres → Vie privée et sécurité → Cookies</li>
                    <li>• <strong>Safari :</strong> Préférences → Confidentialité → Cookies</li>
                    <li>• <strong>Edge :</strong> Paramètres → Cookies et autorisations de site</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-3">Via notre plateforme</h3>
                  <p className="text-green-700 mb-4">
                    Vous pouvez modifier vos préférences de cookies à tout moment :
                  </p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                    Gérer mes préférences
                  </button>
                </div>
              </div>
            </section>

            {/* Cookies tiers */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookies de services tiers</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Google Analytics</h3>
                  <p className="text-gray-700 mb-2">
                    Analyse du trafic et du comportement des utilisateurs
                  </p>
                  <p className="text-sm text-gray-600">
                    Politique : <a href="https://policies.google.com/privacy" className="text-blue-600 hover:text-blue-800">policies.google.com/privacy</a>
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Stripe</h3>
                  <p className="text-gray-700 mb-2">
                    Traitement sécurisé des paiements
                  </p>
                  <p className="text-sm text-gray-600">
                    Politique : <a href="https://stripe.com/privacy" className="text-blue-600 hover:text-blue-800">stripe.com/privacy</a>
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Klarna</h3>
                  <p className="text-gray-700 mb-2">
                    Paiement fractionné et différé
                  </p>
                  <p className="text-sm text-gray-600">
                    Politique : <a href="https://www.klarna.com/fr/confidentialite/" className="text-blue-600 hover:text-blue-800">klarna.com/fr/confidentialite</a>
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <p className="text-orange-900 mb-4">
                  Pour toute question concernant notre politique des cookies :
                </p>
                <div className="space-y-2 text-orange-800">
                  <p><strong>Email :</strong> dpo@zenia.fr</p>
                  <p><strong>Téléphone :</strong> 01 80 88 33 88</p>
                  <p><strong>Adresse :</strong> 123 Avenue des Champs-Élysées, 75008 Paris</p>
                </div>
              </div>
            </section>

            {/* Date de mise à jour */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Dernière mise à jour : 25 janvier 2025</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
