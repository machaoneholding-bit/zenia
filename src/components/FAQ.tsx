import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Qu'est-ce qu'un FPS ?",
      answer: "Un FPS (Forfait Post-Stationnement) est une redevance due lorsque vous n'avez pas payé votre stationnement ou que vous avez dépassé la durée autorisée. Il remplace l'ancienne amende de stationnement depuis 2018."
    },
    {
      question: "Puis-je vraiment payer plus tard ?",
      answer: "Oui, grâce à notre partenariat avec Klarna, vous pouvez choisir de payer immédiatement ou différer votre paiement jusqu'à 30 jours. Vous recevez immédiatement votre justificatif de paiement."
    },
    {
      question: "Est-ce légal ?",
      answer: "Absolument. Zenia est un service agréé qui respecte toutes les réglementations en vigueur. Nous travaillons en conformité avec les autorités compétentes et fournissons des justificatifs officiels reconnus."
    },
    {
      question: "Quelles garanties offre Zenia ?",
      answer: "Nous garantissons la sécurité de vos transactions, la conformité légale de nos services, et la délivrance de justificatifs officiels. En cas de problème, notre service client vous accompagne dans toutes vos démarches."
    },
    {
      question: "Y a-t-il des frais supplémentaires ?",
      answer: "Nos tarifs sont transparents et affichés clairement. Le paiement en plusieurs fois avec Klarna peut inclure des frais selon les conditions, toujours indiqués avant validation."
    },
    {
      question: "Comment recevoir mon justificatif ?",
      answer: "Votre justificatif de paiement est envoyé immédiatement par email après validation du paiement. Il est reconnu par toutes les administrations compétentes."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white" aria-labelledby="faq-title">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 id="faq-title" className="text-4xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-gray-600">
            Toutes les réponses à vos questions sur Zenia
          </p>
        </header>

        <div className="space-y-4" role="list">
          {faqs.map((faq, index) => (
            <article key={index} className="bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors duration-200" role="listitem" itemScope itemType="https://schema.org/Question">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <h3 className="font-semibold text-gray-900 text-lg pr-8" itemProp="name">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5" id={`faq-answer-${index}`} aria-labelledby={`faq-question-${index}`} itemScope itemType="https://schema.org/Answer">
                  <p className="text-gray-600 leading-relaxed" itemProp="text">
                    {faq.answer}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        <footer className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Vous ne trouvez pas votre réponse ?</p>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            aria-label="Contacter le support client Zenia"
          >
            Contactez notre support
          </button>
        </footer>
      </div>
    </section>
  );
}