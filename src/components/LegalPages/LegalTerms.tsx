import React from 'react';
import { ArrowLeft, Scale, FileText, Shield, Calendar } from 'lucide-react';
import Logo from '../Logo';

interface LegalTermsProps {
  onNavigate: (page: string) => void;
}

export default function LegalTerms({ onNavigate }: LegalTermsProps) {
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Mentions légales</h1>
                <p className="text-blue-100 mt-2">Informations légales et réglementaires</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Éditeur du site */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Éditeur du site
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-3">
                  <p><strong>Dénomination sociale :</strong> Zenia SAS</p>
                  <p><strong>Forme juridique :</strong> Société par Actions Simplifiée</p>
                  <p><strong>Capital social :</strong> 100 000 €</p>
                  <p><strong>Siège social :</strong> 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
                  <p><strong>RCS :</strong> Paris B 123 456 789</p>
                  <p><strong>SIRET :</strong> 123 456 789 00012</p>
                  <p><strong>TVA intracommunautaire :</strong> FR12 123456789</p>
                  <p><strong>Téléphone :</strong> 01 80 88 33 88</p>
                  <p><strong>Email :</strong> contact@zenia.fr</p>
                </div>
              </div>
            </section>

            {/* Directeur de publication */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Directeur de publication</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p><strong>Nom :</strong> Jean Dupont</p>
                <p><strong>Qualité :</strong> Président de Zenia SAS</p>
                <p><strong>Email :</strong> direction@zenia.fr</p>
              </div>
            </section>

            {/* Hébergement */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Hébergement</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-3">
                  <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                  <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                  <p><strong>Site web :</strong> <a href="https://vercel.com" className="text-blue-600 hover:text-blue-800">vercel.com</a></p>
                </div>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Propriété intellectuelle</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                  et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour 
                  les documents téléchargeables et les représentations iconographiques et photographiques.
                </p>
                <p>
                  La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est 
                  formellement interdite sauf autorisation expresse du directeur de la publication.
                </p>
              </div>
            </section>

            {/* Responsabilité */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsabilité</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Les informations contenues sur ce site sont aussi précises que possible et le site est 
                  périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions 
                  ou des lacunes.
                </p>
                <p>
                  Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de 
                  bien vouloir le signaler par email à l'adresse contact@zenia.fr, en décrivant le problème 
                  de la manière la plus précise possible.
                </p>
              </div>
            </section>

            {/* Données personnelles */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Protection des données personnelles</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi 
                  "Informatique et Libertés", vous disposez d'un droit d'accès, de rectification, de 
                  suppression et d'opposition au traitement de vos données personnelles.
                </p>
                <p>
                  Pour exercer ces droits ou pour toute question sur le traitement de vos données, 
                  vous pouvez nous contacter à l'adresse : dpo@zenia.fr
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookies</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. 
                  En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies conformément 
                  à notre politique de cookies.
                </p>
                <p>
                  Vous pouvez à tout moment modifier vos préférences de cookies dans les paramètres de 
                  votre navigateur.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-900 mb-4">
                  Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
                </p>
                <div className="space-y-2 text-blue-800">
                  <p><strong>Email :</strong> contact@zenia.fr</p>
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