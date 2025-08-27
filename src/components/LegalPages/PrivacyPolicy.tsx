import React from 'react';
import { ArrowLeft, Shield, Eye, Database, Lock, UserCheck, Calendar } from 'lucide-react';
import Logo from '../Logo';

interface PrivacyPolicyProps {
  onNavigate: (page: string) => void;
}

export default function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
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
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Politique de confidentialité</h1>
                <p className="text-green-100 mt-2">Protection et traitement de vos données personnelles</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h2 className="font-semibold text-green-900 mb-2">Votre vie privée est notre priorité</h2>
                    <p className="text-green-700">
                      Chez Zenia, nous nous engageons à protéger et respecter votre vie privée. Cette politique 
                      explique comment nous collectons, utilisons et protégeons vos données personnelles.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Responsable du traitement */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Responsable du traitement
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-3">
                  <p><strong>Société :</strong> Zenia SAS</p>
                  <p><strong>Adresse :</strong> 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
                  <p><strong>Email :</strong> dpo@zenia.fr</p>
                  <p><strong>Téléphone :</strong> 01 80 88 33 88</p>
                </div>
              </div>
            </section>

            {/* Données collectées */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Données collectées
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Données d'identification</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Nom et prénom</li>
                    <li>• Adresse email</li>
                    <li>• Numéro de téléphone (optionnel)</li>
                    <li>• Mot de passe (crypté)</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Données de véhicules</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Plaque d'immatriculation</li>
                    <li>• Marque et modèle du véhicule</li>
                    <li>• Année de mise en circulation</li>
                    <li>• Numéro de châssis (pour la vérification)</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Données de paiement</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Informations de facturation</li>
                    <li>• Historique des transactions</li>
                    <li>• Données de paiement (traitées par Stripe)</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Données techniques</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Adresse IP</li>
                    <li>• Type de navigateur</li>
                    <li>• Pages visitées et temps de visite</li>
                    <li>• Cookies et technologies similaires</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Finalités du traitement */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Finalités du traitement
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Gestion du service</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Création et gestion de votre compte</li>
                    <li>• Traitement des paiements FPS</li>
                    <li>• Émission des justificatifs de paiement</li>
                    <li>• Support client et assistance</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Surveillance automatique</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Détection automatique des nouveaux FPS</li>
                    <li>• Envoi de notifications</li>
                    <li>• Suivi des véhicules enregistrés</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Amélioration du service</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Analyse d'usage et statistiques</li>
                    <li>• Amélioration de l'expérience utilisateur</li>
                    <li>• Développement de nouvelles fonctionnalités</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Base légale */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Base légale du traitement</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Le traitement de vos données personnelles repose sur les bases légales suivantes :
                </p>
                <ul>
                  <li><strong>Exécution du contrat :</strong> Pour la fourniture du service de paiement FPS</li>
                  <li><strong>Consentement :</strong> Pour les notifications et la surveillance automatique</li>
                  <li><strong>Intérêt légitime :</strong> Pour l'amélioration du service et la sécurité</li>
                  <li><strong>Obligation légale :</strong> Pour la conservation des données de facturation</li>
                </ul>
              </div>
            </section>

            {/* Durée de conservation */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Durée de conservation</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Données de compte</h3>
                  <p className="text-gray-700">Conservées pendant toute la durée de votre compte + 3 ans après suppression</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Données de paiement</h3>
                  <p className="text-gray-700">Conservées 10 ans conformément aux obligations comptables</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Données de navigation</h3>
                  <p className="text-gray-700">Conservées 13 mois maximum (cookies et logs)</p>
                </div>
              </div>
            </section>

            {/* Vos droits */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vos droits</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-900 mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium text-blue-900">• Droit d'accès</p>
                    <p className="font-medium text-blue-900">• Droit de rectification</p>
                    <p className="font-medium text-blue-900">• Droit à l'effacement</p>
                    <p className="font-medium text-blue-900">• Droit à la limitation</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-blue-900">• Droit à la portabilité</p>
                    <p className="font-medium text-blue-900">• Droit d'opposition</p>
                    <p className="font-medium text-blue-900">• Droit de retrait du consentement</p>
                    <p className="font-medium text-blue-900">• Droit de réclamation (CNIL)</p>
                  </div>
                </div>
                <p className="text-blue-700 mt-4">
                  Pour exercer ces droits, contactez-nous à : <strong>dpo@zenia.fr</strong>
                </p>
              </div>
            </section>

            {/* Sécurité */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Sécurité des données
              </h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour 
                  protéger vos données personnelles contre la destruction, la perte, l'altération, 
                  la divulgation ou l'accès non autorisés.
                </p>
                <ul>
                  <li>Cryptage SSL/TLS pour toutes les communications</li>
                  <li>Authentification forte et contrôle d'accès</li>
                  <li>Sauvegarde régulière et sécurisée des données</li>
                  <li>Surveillance continue de la sécurité</li>
                  <li>Formation du personnel à la protection des données</li>
                </ul>
              </div>
            </section>

            {/* Transferts de données */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Transferts de données</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Vos données peuvent être transférées vers des pays tiers dans le cadre de l'utilisation 
                  de services partenaires (Stripe pour les paiements, Klarna pour le paiement fractionné).
                </p>
                <p>
                  Ces transferts sont encadrés par des garanties appropriées (clauses contractuelles types, 
                  décisions d'adéquation) pour assurer un niveau de protection équivalent au RGPD.
                </p>
              </div>
            </section>

            {/* Contact DPO */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact - Délégué à la Protection des Données</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-900 mb-4">
                  Pour toute question relative à la protection de vos données personnelles :
                </p>
                <div className="space-y-2 text-green-800">
                  <p><strong>Email :</strong> dpo@zenia.fr</p>
                  <p><strong>Courrier :</strong> DPO Zenia, 123 Avenue des Champs-Élysées, 75008 Paris</p>
                  <p><strong>Délai de réponse :</strong> 30 jours maximum</p>
                </div>
              </div>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Modifications de la politique</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Cette politique de confidentialité peut être modifiée à tout moment. Nous vous 
                  informerons de toute modification importante par email ou via une notification 
                  sur notre site web.
                </p>
                <p>
                  Nous vous encourageons à consulter régulièrement cette page pour rester informé 
                  de nos pratiques en matière de protection des données.
                </p>
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