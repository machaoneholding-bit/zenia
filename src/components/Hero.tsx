import React from 'react';
import { Smartphone, CheckCircle, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 pt-20 pb-16" aria-labelledby="hero-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <article className="space-y-8">
            <header className="space-y-4">
              <h1 id="hero-title" className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-blue-600">Zenia</span>
              </h1>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 leading-relaxed">
                Payez vos forfait-post-stationnement en toute sérénité.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Réglez vos FPS en 1 ou 3 fois, ou payez plus tard, jusqu'à 30 jours.
                Simple, rapide et sécurisé.
              </p>
            </header>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.scrollTo({ top: document.getElementById('payment-section')?.offsetTop || 0, behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                aria-label="Accéder au formulaire de paiement FPS"
              >
                Payer mon FPS
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => window.scrollTo({ top: document.getElementById('how-it-works')?.offsetTop || 0, behavior: 'smooth' })}
                className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all duration-200"
                aria-label="Découvrir comment fonctionne Zenia"
              >
                Découvrir Zenia
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>100% Sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Paiement Klarna</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Justificatif immédiat</span>
              </div>
            </div>
          </article>

          {/* Illustration */}
          <aside className="relative" aria-label="Exemple d'interface de paiement">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-gray-800">Zenia Pay</span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Numéro FPS</p>
                    <p className="font-mono text-gray-900">FPS-2024-001234</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Montant</p>
                    <p className="text-xl font-bold text-gray-900">35,00 €</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600 font-medium">1 fois</p>
                    <p className="text-sm font-semibold text-blue-900">35€</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-purple-600 font-medium">3 fois</p>
                    <p className="text-sm font-semibold text-purple-900">14€</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const paymentSection = document.getElementById('payment-section');
                    if (paymentSection) {
                      paymentSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }} 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md"
                  aria-label="Commencer le paiement de votre FPS"
                >
                  Payer maintenant
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
