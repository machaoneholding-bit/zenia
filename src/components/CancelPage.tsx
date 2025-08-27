import React from 'react';
import { XCircle, ArrowLeft, Home } from 'lucide-react';

interface CancelPageProps {
  onNavigate: (page: string) => void;
}

export default function CancelPage({ onNavigate }: CancelPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Paiement annulé
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Que s'est-il passé ?</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Vous avez annulé le processus de paiement</li>
            <li>• Aucune transaction n'a été effectuée</li>
            <li>• Vos informations de paiement n'ont pas été enregistrées</li>
          </ul>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => onNavigate('home')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux produits
          </button>
          
          <button 
            onClick={() => onNavigate('home')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Besoin d'aide ?</h3>
          <p className="text-sm text-blue-700 mb-3">
            Si vous avez rencontré un problème lors du paiement, n'hésitez pas à nous contacter.
          </p>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Contacter le support →
          </button>
        </div>
      </div>
    </div>
  );
}
