import React from 'react';
import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import SEOHead from './components/SEO/SEOHead';
import Breadcrumb from './components/SEO/Breadcrumb';
import { 
  organizationSchema, 
  serviceSchema, 
  faqSchema, 
  breadcrumbSchema, 
  websiteSchema, 
  localBusinessSchema, 
  howItWorksSchema, 
  productSchema,
  articleSchema,
  webPageSchema 
} from './components/SEO/StructuredData';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import KlarnaSection from './components/KlarnaSection';
import PaymentFormAlt from './components/PaymentFormAlt';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import VehicleRegistration from './components/VehicleRegistration';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard/Dashboard';
import ProductCard from './components/ProductCard';
import SuccessPage from './components/SuccessPage';
import CancelPage from './components/CancelPage';
import LegalTerms from './components/LegalPages/LegalTerms';
import PrivacyPolicy from './components/LegalPages/PrivacyPolicy';
import TermsOfService from './components/LegalPages/TermsOfService';
import CookiePolicy from './components/LegalPages/CookiePolicy';
import { products } from './stripe-config';
import { supabase } from './lib/supabase';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Handle URL parameters for success/cancel pages
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if (pageParam) {
      setCurrentPage(pageParam);
    }
  }, []);

  // Redirect to dashboard if user is logged in and trying to access login
  React.useEffect(() => {
    if (user && currentPage === 'login') {
      setCurrentPage('dashboard');
    }
  }, [user, currentPage]);

  const getBreadcrumbItems = () => {
    const baseItems = [{ name: 'Accueil', url: 'home' }];
    
    switch (currentPage) {
      case 'login':
        return [...baseItems, { name: 'Connexion', url: 'login', current: true }];
      case 'register':
        return [...baseItems, { name: 'Inscription', url: 'register', current: true }];
      case 'dashboard':
        return [...baseItems, { name: 'Mon espace', url: 'dashboard', current: true }];
      case 'success':
        return [...baseItems, { name: 'Paiement réussi', url: 'success', current: true }];
      case 'cancel':
        return [...baseItems, { name: 'Paiement annulé', url: 'cancel', current: true }];
      case 'legal-terms':
        return [...baseItems, { name: 'Mentions légales', url: 'legal-terms', current: true }];
      case 'privacy-policy':
        return [...baseItems, { name: 'Politique de confidentialité', url: 'privacy-policy', current: true }];
      case 'terms-of-service':
        return [...baseItems, { name: 'CGU', url: 'terms-of-service', current: true }];
      case 'cookie-policy':
        return [...baseItems, { name: 'Cookies', url: 'cookie-policy', current: true }];
      default:
        return [{ name: 'Accueil', url: 'home', current: true }];
    }
  };

  const getPageSEO = () => {
    switch (currentPage) {
      case 'legal-terms':
        return {
          title: "Mentions légales - Zenia | Informations légales et réglementaires",
          description: "Mentions légales de Zenia : informations sur l'éditeur, l'hébergeur, la propriété intellectuelle et les responsabilités.",
          structuredData: {
            ...organizationSchema,
            ...webPageSchema(
              "Mentions légales - Zenia | Informations légales et réglementaires",
              "Mentions légales de Zenia : informations sur l'éditeur, l'hébergeur, la propriété intellectuelle et les responsabilités.",
              "https://zenia.fr/legal-terms"
            )
          },
          canonical: "https://zenia.fr/legal-terms"
        };
      case 'privacy-policy':
        return {
          title: "Politique de confidentialité - Zenia | Protection des données personnelles",
          description: "Politique de confidentialité Zenia : collecte, traitement et protection de vos données personnelles conformément au RGPD.",
          structuredData: {
            ...organizationSchema,
            ...webPageSchema(
              "Politique de confidentialité - Zenia | Protection des données personnelles",
              "Politique de confidentialité Zenia : collecte, traitement et protection de vos données personnelles conformément au RGPD.",
              "https://zenia.fr/privacy-policy"
            )
          },
          canonical: "https://zenia.fr/privacy-policy"
        };
      case 'terms-of-service':
        return {
          title: "Conditions Générales d'Utilisation - Zenia | CGU du service",
          description: "Conditions générales d'utilisation du service Zenia : droits, obligations et responsabilités des utilisateurs.",
          structuredData: {
            ...organizationSchema,
            ...webPageSchema(
              "Conditions Générales d'Utilisation - Zenia | CGU du service",
              "Conditions générales d'utilisation du service Zenia : droits, obligations et responsabilités des utilisateurs.",
              "https://zenia.fr/terms-of-service"
            )
          },
          canonical: "https://zenia.fr/terms-of-service"
        };
      case 'cookie-policy':
        return {
          title: "Politique des cookies - Zenia | Gestion des cookies et traceurs",
          description: "Politique des cookies Zenia : types de cookies utilisés, finalités et gestion de vos préférences.",
          structuredData: {
            ...organizationSchema,
            ...webPageSchema(
              "Politique des cookies - Zenia | Gestion des cookies et traceurs",
              "Politique des cookies Zenia : types de cookies utilisés, finalités et gestion de vos préférences.",
              "https://zenia.fr/cookie-policy"
            )
          },
          canonical: "https://zenia.fr/cookie-policy"
        };
      case 'login':
        return {
          title: "Connexion - Zenia | Accédez à votre espace client",
          description: "Connectez-vous à votre espace client Zenia pour gérer vos FPS, consulter votre historique de paiements et vos véhicules.",
          structuredData: {
            ...organizationSchema,
            ...webPageSchema(
              "Connexion - Zenia | Accédez à votre espace client",
              "Connectez-vous à votre espace client Zenia pour gérer vos FPS, consulter votre historique de paiements et vos véhicules.",
              "https://zenia.fr/login"
            )
          },
          canonical: "https://zenia.fr/login"
        };
      case 'register':
        return {
          title: "Inscription - Zenia | Créez votre compte gratuit",
          description: "Créez votre compte Zenia gratuit pour payer vos FPS en toute simplicité avec des options de paiement flexibles.",
          structuredData: {
            ...organizationSchema,
            ...webPageSchema(
              "Inscription - Zenia | Créez votre compte gratuit",
              "Créez votre compte Zenia gratuit pour payer vos FPS en toute simplicité avec des options de paiement flexibles.",
              "https://zenia.fr/register"
            )
          },
          canonical: "https://zenia.fr/register"
        };
      case 'dashboard':
        return {
          title: "Mon espace - Zenia | Gestion de vos FPS et véhicules",
          description: "Gérez vos FPS, consultez votre historique de paiements, administrez vos véhicules et moyens de paiement.",
          structuredData: organizationSchema,
          canonical: "https://zenia.fr/dashboard"
        };
      case 'success':
        return {
          title: "Paiement réussi - Zenia | Confirmation de votre transaction",
          description: "Votre paiement FPS a été traité avec succès. Téléchargez votre justificatif et consultez les détails de votre transaction.",
          structuredData: {
            ...organizationSchema,
            ...webPageSchema(
              "Paiement réussi - Zenia | Confirmation de votre transaction",
              "Votre paiement FPS a été traité avec succès. Téléchargez votre justificatif et consultez les détails de votre transaction.",
              "https://zenia.fr/success"
            )
          },
          canonical: "https://zenia.fr/success"
        };
      case 'cancel':
        return {
          title: "Paiement annulé - Zenia | Transaction interrompue",
          description: "Votre paiement a été annulé. Aucun montant n'a été débité. Vous pouvez reprendre le processus à tout moment.",
          structuredData: {
            ...organizationSchema,
            ...webPageSchema(
              "Paiement annulé - Zenia | Transaction interrompue",
              "Votre paiement a été annulé. Aucun montant n'a été débité. Vous pouvez reprendre le processus à tout moment.",
              "https://zenia.fr/cancel"
            )
          },
          canonical: "https://zenia.fr/cancel"
        };
      case 'how-it-works':
        return {
          title: "Comment ça marche - Zenia | Guide de paiement FPS",
          description: "Découvrez comment payer vos FPS en 3 étapes simples avec Zenia. Guide complet du paiement fractionné et différé.",
          structuredData: {
            ...organizationSchema,
            ...howItWorksSchema,
            ...articleSchema(
              "Comment ça marche - Zenia | Guide de paiement FPS",
              "Découvrez comment payer vos FPS en 3 étapes simples avec Zenia. Guide complet du paiement fractionné et différé.",
              "https://zenia.fr/how-it-works"
            )
          },
          canonical: "https://zenia.fr/how-it-works"
        };
      case 'payment':
        return {
          title: "Payer mon FPS - Zenia | Paiement sécurisé et flexible",
          description: "Payez votre FPS immédiatement, en 3 fois ou différé à 30 jours. Paiement sécurisé avec Klarna. Justificatif immédiat.",
          structuredData: {
            ...organizationSchema,
            ...productSchema,
            ...webPageSchema(
              "Payer mon FPS - Zenia | Paiement sécurisé et flexible",
              "Payez votre FPS immédiatement, en 3 fois ou différé à 30 jours. Paiement sécurisé avec Klarna. Justificatif immédiat.",
              "https://zenia.fr/payment"
            )
          },
          canonical: "https://zenia.fr/payment"
        };
      case 'faq':
        return {
          title: "FAQ - Zenia | Questions fréquentes sur le paiement FPS",
          description: "Toutes les réponses à vos questions sur le paiement des FPS avec Zenia. Légalité, sécurité, frais et justificatifs.",
          structuredData: {
            ...organizationSchema,
            ...faqSchema,
            ...webPageSchema(
              "FAQ - Zenia | Questions fréquentes sur le paiement FPS",
              "Toutes les réponses à vos questions sur le paiement des FPS avec Zenia. Légalité, sécurité, frais et justificatifs.",
              "https://zenia.fr/faq"
            )
          },
          canonical: "https://zenia.fr/faq"
        };
      default:
        return {
          title: "Zenia - Payer vos FPS en toute sérénité | Paiement fractionné et différé",
          description: "Payez vos FPS (Forfaits Post-Stationnement) en 1, 3 fois ou différé à 30 jours avec Klarna. Solution légale, sécurisée et transparente. Justificatif immédiat.",
          structuredData: { 
            ...organizationSchema, 
            ...serviceSchema, 
            ...faqSchema, 
            ...websiteSchema, 
            ...localBusinessSchema, 
            ...productSchema 
          },
          canonical: "https://zenia.fr"
        };
    }
  };

  const pageSEO = getPageSEO();
  const breadcrumbItems = getBreadcrumbItems();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero />
            <PaymentFormAlt />
            <HowItWorks />
            <VehicleRegistration onNavigate={handleNavigate} />
            <Benefits />
            <KlarnaSection />
            <FAQ />
          </>
        );
      case 'how-it-works':
        return (
          <>
            <HowItWorks />
          </>
        );
      case 'payment':
        return (
          <>
            <PaymentFormAlt />
          </>
        );
      case 'faq':
        return (
          <>
            <FAQ />
          </>
        );
      case 'login':
        return <LoginForm onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterForm onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'success':
        return <SuccessPage onNavigate={handleNavigate} />;
      case 'cancel':
        return <CancelPage onNavigate={handleNavigate} />;
      case 'legal-terms':
        return <LegalTerms onNavigate={handleNavigate} />;
      case 'privacy-policy':
        return <PrivacyPolicy onNavigate={handleNavigate} />;
      case 'terms-of-service':
        return <TermsOfService onNavigate={handleNavigate} />;
      case 'cookie-policy':
        return <CookiePolicy onNavigate={handleNavigate} />;
      default:
        return (
          <>
            <Hero />
            <PaymentFormAlt />
            <HowItWorks />
            <Benefits />
            <KlarnaSection />
            <FAQ />
          </>
        );
    }
  };

  if (currentPage === 'login' || currentPage === 'register' || currentPage === 'dashboard' || currentPage === 'success' || currentPage === 'cancel') {
    return (
      <>
        <SEOHead {...pageSEO} />
        <div className="min-h-screen bg-white">
          {currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'dashboard' && currentPage !== 'success' && (
            <Breadcrumb items={breadcrumbItems} onNavigate={handleNavigate} />
          )}
          <main role="main">
            {renderPage()}
          </main>
        </div>
      </>
    );
  }

  if (currentPage === 'login' || currentPage === 'register' || currentPage === 'dashboard' || currentPage === 'success' || currentPage === 'cancel') {
    return (
      <>
        <SEOHead {...pageSEO} />
        <div className="min-h-screen bg-white">
          {currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'dashboard' && currentPage !== 'success' && (
            <Breadcrumb items={breadcrumbItems} onNavigate={handleNavigate} />
          )}
          <main role="main">
            {renderPage()}
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead {...pageSEO} />
      <div className="min-h-screen bg-white">
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        <main role="main">
          {renderPage()}
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    </>
  );
}

export default App;