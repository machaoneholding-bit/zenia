import React from 'react';
import { ArrowLeft, FileText, Users, CreditCard, AlertTriangle, Calendar } from 'lucide-react';
import Logo from '../Logo';

interface TermsOfServiceProps {
  onNavigate: (page: string) => void;
}

export default function TermsOfService({ onNavigate }: TermsOfServiceProps) {
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
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Conditions Générales d'Utilisation</h1>
                <p className="text-purple-100 mt-2">Conditions d'utilisation du service Zenia</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <FileText className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h2 className="font-semibold text-purple-900 mb-2">Conditions d'utilisation</h2>
                    <p className="text-purple-700">
                      En utilisant le service Zenia, vous acceptez les présentes conditions générales d'utilisation. 
                      Veuillez les lire attentivement avant d'utiliser notre plateforme.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Objet du service */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Objet du service</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Zenia est une plateforme de paiement des Forfaits Post-Stationnement (FPS) qui permet aux 
                  utilisateurs de régler leurs contraventions de stationnement avec des options de paiement 
                  flexibles (immédiat, fractionné, différé).
                </p>
                <p>
                  Le service comprend également la surveillance automatique des nouveaux FPS pour les véhicules 
                  enregistrés et l'émission de justificatifs de paiement officiels.
                </p>
              </div>
            </section>

            {/* Conditions d'accès */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Conditions d'accès
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Éligibilité</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Être âgé de 18 ans minimum</li>
                    <li>• Résider en France métropolitaine</li>
                    <li>• Disposer d'une adresse email valide</li>
                    <li>• Accepter les présentes CGU</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Création de compte</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Informations exactes et à jour</li>
                    <li>• Mot de passe sécurisé</li>
                    <li>• Responsabilité de la confidentialité des identifiants</li>
                    <li>• Notification immédiate en cas d'usage non autorisé</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Utilisation du service */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Utilisation du service</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Usages autorisés</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Paiement de vos propres FPS</li>
                    <li>• Enregistrement de vos véhicules personnels</li>
                    <li>• Consultation de votre historique</li>
                    <li>• Téléchargement de vos justificatifs</li>
                  </ul>
                </div>

                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Usages interdits
                  </h3>
                  <ul className="space-y-2 text-red-700">
                    <li>• Utilisation frauduleuse ou illégale</li>
                    <li>• Paiement de FPS appartenant à des tiers sans autorisation</li>
                    <li>• Tentative de contournement des systèmes de sécurité</li>
                    <li>• Utilisation de données erronées ou falsifiées</li>
                    <li>• Revente ou cession du service à des tiers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Paiements et tarification */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Paiements et tarification
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Tarifs</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Paiement immédiat : 0% de frais</li>
                    <li>• Paiement fractionné (3x) : +20% de frais de service</li>
                    <li>• Paiement différé (30 jours) : +15% de frais de service</li>
                    <li>• Création de compte et surveillance : gratuit</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Modalités de paiement</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Paiement sécurisé via Stripe</li>
                    <li>• Options Klarna pour le fractionné et différé</li>
                    <li>• Justificatif émis immédiatement</li>
                    <li>• Aucun remboursement après validation du paiement</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Responsabilités */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsabilités</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Responsabilités de Zenia</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Fourniture du service de paiement</li>
                    <li>• Sécurisation des transactions</li>
                    <li>• Émission des justificatifs officiels</li>
                    <li>• Support client et assistance</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Responsabilités de l'utilisateur</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Exactitude des informations fournies</li>
                    <li>• Respect des conditions d'utilisation</li>
                    <li>• Sécurisation de ses identifiants de connexion</li>
                    <li>• Notification de tout problème ou usage non autorisé</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Limitation de responsabilité */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitation de responsabilité</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Zenia ne saurait être tenu responsable des dommages directs ou indirects résultant de :
                </p>
                <ul>
                  <li>L'utilisation ou l'impossibilité d'utiliser le service</li>
                  <li>Les erreurs dans les informations saisies par l'utilisateur</li>
                  <li>Les dysfonctionnements des services tiers (Stripe, Klarna)</li>
                  <li>Les interruptions temporaires du service pour maintenance</li>
                </ul>
                <p>
                  Notre responsabilité est limitée au montant des frais de service perçus pour la transaction concernée.
                </p>
              </div>
            </section>

            {/* Résiliation */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Résiliation</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Vous pouvez résilier votre compte à tout moment depuis votre espace client. 
                  La résiliation entraîne la suppression de vos données personnelles conformément 
                  à notre politique de confidentialité.
                </p>
                <p>
                  Zenia se réserve le droit de suspendre ou résilier un compte en cas de non-respect 
                  des présentes conditions, avec un préavis de 30 jours sauf en cas de violation grave.
                </p>
              </div>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Droit applicable et juridiction</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Les présentes conditions générales sont régies par le droit français. 
                  En cas de litige, les tribunaux français seront seuls compétents.
                </p>
                <p>
                  Avant tout recours contentieux, nous vous invitons à nous contacter pour 
                  résoudre amiablement tout différend.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <p className="text-purple-900 mb-4">
                  Pour toute question concernant ces conditions d'utilisation :
                </p>
                <div className="space-y-2 text-purple-800">
                  <p><strong>Email :</strong> legal@zenia.fr</p>
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