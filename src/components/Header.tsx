import React, { useState } from 'react';
import { Menu, X, User, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import Logo from './Logo';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { getActiveProduct } = useSubscription();

  const activeProduct = getActiveProduct();

  const navigation = [
    { name: 'Accueil', href: 'home' },
    { name: 'Comment ça marche', href: 'how-it-works' },
    { name: 'Payer mon FPS', href: 'payment' },
    { name: 'FAQ', href: 'faq' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-16" role="navigation" aria-label="Navigation principale">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
              aria-label="Retour à l'accueil Zenia"
            >
              <Logo size="md" />
              <span className="text-2xl font-bold text-gray-900">Zenia</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="flex-1"></div>

          {/* User Info & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {activeProduct && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {activeProduct.name}
                  </div>
                )}
                <span className="text-gray-600 text-sm">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Mon espace
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
                  aria-label="Se connecter à votre compte"
                >
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </button>
                <button 
                  onClick={() => onNavigate('register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  aria-label="Créer un nouveau compte"
                >
                  <User className="w-4 h-4" />
                  S'inscrire
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4" role="menu">
            <div className="space-y-2">
              {user ? (
                <>
                  {activeProduct && (
                    <div className="px-4 py-2">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                        {activeProduct.name}
                      </div>
                    </div>
                  )}
                  <div className="px-4 py-2 text-gray-600 text-sm">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <button 
                    onClick={() => {
                      onNavigate('dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    role="menuitem"
                  >
                    Mon espace
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      onNavigate('login');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    role="menuitem"
                  >
                    Se connecter
                  </button>
                  <button 
                    onClick={() => {
                      onNavigate('register');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    role="menuitem"
                  >
                    S'inscrire
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
