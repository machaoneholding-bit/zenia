import React from 'react';
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8" role="list">
          {/* Company */}
          <div className="space-y-4" role="listitem">
            <h3 className="text-2xl font-bold text-blue-400">Zenia</h3>
            <p className="text-gray-300 leading-relaxed">
              La solution innovante pour payer vos FPS en toute sérénité, 
              avec la flexibilité du paiement fractionné et différé.
            </p>
            <div className="flex space-x-4" role="list" aria-label="Réseaux sociaux">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200" aria-label="Suivez-nous sur Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200" aria-label="Suivez-nous sur LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200" aria-label="Suivez-nous sur Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4" role="listitem">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="space-y-2" role="list">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Paiement FPS</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Paiement fractionné</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Paiement différé</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Suivi des paiements</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4" role="listitem">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-2" role="list">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Centre d'aide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Tutoriels</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4" role="listitem">
            <h4 className="text-lg font-semibold">Contact</h4>
            <address className="space-y-3 not-italic">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <a href="mailto:support@zenia.fr" className="text-gray-300 hover:text-white transition-colors duration-200" aria-label="Envoyer un email au support">
                  support@zenia.fr
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <a href="tel:+33180883388" className="text-gray-300 hover:text-white transition-colors duration-200" aria-label="Appeler le support">
                  01 80 88 33 88
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">
                  75001 Paris, France
                </span>
              </div>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8" role="contentinfo">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 - 2025 Zenia. Tous droits réservés.
            </p>
            <nav className="flex flex-wrap gap-6 text-sm" aria-label="Liens légaux">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <button 
                  onClick={() => onNavigate('legal-terms')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Mentions légales
                </button>
              </a>
              <button 
                onClick={() => onNavigate('privacy-policy')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Politique de confidentialité
              </button>
              <button 
                onClick={() => onNavigate('terms-of-service')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                CGU
              </button>
              <button 
                onClick={() => onNavigate('cookie-policy')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cookies
              </button>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
