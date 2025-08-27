import React from 'react';
import { Shield, Clock, Users, Headphones } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: Shield,
      title: "Paiement sécurisé et rapide",
      description: "Transactions cryptées et conformes aux standards bancaires européens. Vos données sont protégées."
    },
    {
      icon: Clock,
      title: "Souplesse de paiement maximale",
      description: "Choisissez entre paiement immédiat, fractionné ou différé selon vos besoins financiers."
    },
    {
      icon: Users,
      title: "Plateforme légale et transparente",
      description: "Service agréé et transparent. Aucuns frais cachés, tarification claire et justificatifs officiels."
    },
    {
      icon: Headphones,
      title: "Accompagnement administratif",
      description: "Notre équipe vous accompagne dans toutes vos démarches et répond à vos questions."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="benefits-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-20">
          <h2 id="benefits-title" className="text-4xl font-bold text-gray-900 mb-6">
            Pourquoi choisir Zenia ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            La solution de paiement innovante qui s'adapte à votre situation
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const colors = [
              { bg: 'bg-blue-50', border: 'border-blue-100', icon: 'bg-blue-100', iconColor: 'text-blue-600', hover: 'hover:bg-blue-100' },
              { bg: 'bg-indigo-50', border: 'border-indigo-100', icon: 'bg-indigo-100', iconColor: 'text-indigo-600', hover: 'hover:bg-indigo-100' },
              { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'bg-emerald-100', iconColor: 'text-emerald-600', hover: 'hover:bg-emerald-100' },
              { bg: 'bg-violet-50', border: 'border-violet-100', icon: 'bg-violet-100', iconColor: 'text-violet-600', hover: 'hover:bg-violet-100' }
            ];
            const colorScheme = colors[index % colors.length];
            
            return (
              <article key={index} className={`${colorScheme.bg} rounded-2xl p-8 ${colorScheme.hover} transition-all duration-300 group border ${colorScheme.border} hover:shadow-lg hover:scale-105`} role="listitem">
                <div className={`w-16 h-16 mx-auto mb-6 ${colorScheme.icon} rounded-2xl flex items-center justify-center group-hover:shadow-md transition-all duration-200`} aria-hidden="true">
                  <Icon className={`w-8 h-8 ${colorScheme.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>

        <footer className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-full text-sm font-medium border border-gray-200 shadow-sm">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            Plus de 10 000 utilisateurs nous font confiance
          </div>
        </footer>
      </div>
    </section>
  );
}
