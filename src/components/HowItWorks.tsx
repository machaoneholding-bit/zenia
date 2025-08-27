import React from 'react';
import { FileText, CreditCard, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "Entrez vos informations",
      description: "Saisissez votre numéro de FPS. Notre système vérifie automatiquement les données."
    },
    {
      icon: CreditCard,
      title: "Choisissez votre paiement",
      description: "Paiement immédiat, fractionné en 3 fois, ou différé à 30 jours avec Klarna."
    },
    {
      icon: CheckCircle,
      title: "Recevez votre justificatif",
      description: "Confirmation immédiate et justificatif officiel de paiement envoyé par email."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white" aria-labelledby="how-it-works-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 id="how-it-works-title" className="text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Régler vos FPS n'a jamais été aussi simple. En 3 étapes, c'est fait !
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-12" role="list">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={index} className="text-center group relative" role="listitem">
                <div className="relative mb-8 flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200 mb-4" aria-hidden="true">
                    <Icon className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg" aria-label={`Étape ${index + 1}`}>
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent transform translate-x-4" aria-hidden="true"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>

        <aside className="mt-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100" aria-labelledby="payment-options-title">
          <h3 id="payment-options-title" className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Options de paiement disponibles
          </h3>
          <div className="grid sm:grid-cols-3 gap-6" role="list">
            <article className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100" role="listitem">
              <div className="w-14 h-14 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center" aria-hidden="true">
                <span className="text-green-600 font-bold text-lg">1×</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Paiement immédiat</h4>
              <p className="text-sm text-gray-600 mb-2">En une fois</p>
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                0% de frais
              </div>
            </article>
            <article className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100" role="listitem">
              <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center" aria-hidden="true">
                <span className="text-blue-600 font-bold text-lg">3×</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Paiement fractionné</h4>
              <p className="text-sm text-gray-600 mb-2">En 3 fois</p>
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                +20% de frais
              </div>
            </article>
            <article className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100" role="listitem">
              <div className="w-14 h-14 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center" aria-hidden="true">
                <span className="text-orange-600 font-bold text-lg">30j</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Paiement différé</h4>
              <p className="text-sm text-gray-600 mb-2">Dans 30 jours</p>
              <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                +15% de frais
              </div>
            </article>
          </div>
        </aside>
      </div>
    </section>
  );
}
