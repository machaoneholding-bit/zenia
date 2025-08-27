import React from 'react';
import { CreditCard, Calendar, TrendingUp } from 'lucide-react';

export default function KlarnaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50" aria-labelledby="klarna-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                Partenaire officiel Klarna
              </div>
              <h2 id="klarna-title" className="text-4xl font-bold text-gray-900">
                Payer maintenant ou plus tard avec <span className="text-purple-600">Klarna</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Grâce à notre partenariat avec Klarna, leader européen du paiement flexible, 
                vous pouvez régler vos FPS selon vos disponibilités financières.
              </p>
            </header>

            <div className="space-y-4" role="list">
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm" role="listitem">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Paiement fractionné</h3>
                  <p className="text-gray-600">Divisez votre paiement en 3 fois sans frais supplémentaires</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm" role="listitem">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Paiement différé</h3>
                  <p className="text-gray-600">Recevez votre justificatif immédiatement, payez dans 30 jours</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded text-white flex items-center justify-center text-sm font-bold">
                  K
                </div>
                <span className="font-bold text-gray-900 text-lg">Klarna</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Sécurisé</span>
              </div>
              <p className="text-gray-600 text-sm">
                Klarna est réglementé par l'Autorité suédoise de surveillance financière. 
                Vos informations sont cryptées et sécurisées.
              </p>
            </div>
          </article>

          <aside className="relative" aria-labelledby="payment-example-title">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 id="payment-example-title" className="text-xl font-semibold text-gray-900 mb-6">
                Exemple de paiement fractionné
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Montant total</p>
                  <p className="text-2xl font-bold text-gray-900">120,00 €</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-900">Aujourd'hui</span>
                  <span className="font-bold text-blue-900">40,00 €</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Dans 30 jours</span>
                  <span className="font-medium text-gray-900">40,00 €</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Dans 60 jours</span>
                  <span className="font-medium text-gray-900">40,00 €</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-green-600 font-medium mb-2">0% d'intérêts • Aucuns frais cachés</p>
                <button 
                  onClick={() => {
                    const paymentSection = document.getElementById('payment-section');
                    if (paymentSection) {
                      paymentSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  aria-label="Accéder au formulaire de paiement FPS"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow duration-200"
                >
                  Payer mon FPS
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
