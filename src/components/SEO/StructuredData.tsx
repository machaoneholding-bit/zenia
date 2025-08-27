import React from 'react';

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Zenia",
  "description": "Solution de paiement innovante pour les FPS (Forfaits Post-Stationnement) avec options de paiement fractionné et différé",
  "url": "https://zenia.fr",
  "logo": "https://zenia.fr/logo.png",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+33-1-80-88-33-88",
    "contactType": "customer service",
    "email": "support@zenia.fr",
    "availableLanguage": "French",
    "areaServed": "FR"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "FR",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "streetAddress": "Paris, France"
  },
  "sameAs": [
    "https://twitter.com/zenia_fr",
    "https://linkedin.com/company/zenia",
    "https://facebook.com/zenia.fr"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1247",
    "bestRating": "5",
    "worstRating": "1"
  }
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Paiement FPS Zenia",
  "description": "Service de paiement des Forfaits Post-Stationnement avec options de paiement fractionné en 3 fois ou différé à 30 jours",
  "provider": {
    "@type": "Organization",
    "name": "Zenia",
    "url": "https://zenia.fr"
  },
  "serviceType": "Paiement de FPS",
  "category": "Services financiers",
  "areaServed": {
    "@type": "Country",
    "name": "France"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://zenia.fr",
    "serviceName": "Plateforme en ligne Zenia"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Options de paiement FPS",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Paiement immédiat",
          "description": "Paiement en une fois sans frais supplémentaires"
        },
        "price": "0",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Paiement fractionné",
          "description": "Paiement en 3 fois avec Klarna"
        },
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": "20",
          "priceCurrency": "EUR",
          "valueAddedTaxIncluded": true,
          "description": "Frais de service 20%"
        },
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Paiement différé",
          "description": "Paiement dans 30 jours avec Klarna"
        },
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": "15",
          "priceCurrency": "EUR",
          "valueAddedTaxIncluded": true,
          "description": "Frais de service 15%"
        },
        "availability": "https://schema.org/InStock"
      }
    ]
  }
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Qu'est-ce qu'un FPS ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Un FPS (Forfait Post-Stationnement) est une redevance due lorsque vous n'avez pas payé votre stationnement ou que vous avez dépassé la durée autorisée. Il remplace l'ancienne amende de stationnement depuis 2018."
      }
    },
    {
      "@type": "Question",
      "name": "Puis-je vraiment payer plus tard ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui, grâce à notre partenariat avec Klarna, vous pouvez choisir de payer immédiatement ou différer votre paiement jusqu'à 30 jours. Vous recevez immédiatement votre justificatif de paiement."
      }
    },
    {
      "@type": "Question",
      "name": "Est-ce légal ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolument. Zenia est un service agréé qui respecte toutes les réglementations en vigueur. Nous travaillons en conformité avec les autorités compétentes et fournissons des justificatifs officiels reconnus."
      }
    },
    {
      "@type": "Question",
      "name": "Quelles garanties offre Zenia ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nous garantissons la sécurité de vos transactions, la conformité légale de nos services, et la délivrance de justificatifs officiels. En cas de problème, notre service client vous accompagne dans toutes vos démarches."
      }
    },
    {
      "@type": "Question",
      "name": "Y a-t-il des frais supplémentaires ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nos tarifs sont transparents et affichés clairement. Le paiement en plusieurs fois avec Klarna peut inclure des frais selon les conditions, toujours indiqués avant validation."
      }
    },
    {
      "@type": "Question",
      "name": "Comment recevoir mon justificatif ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Votre justificatif de paiement est envoyé immédiatement par email après validation du paiement. Il est reconnu par toutes les administrations compétentes."
      }
    }
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Zenia",
  "description": "Plateforme de paiement des FPS avec options flexibles",
  "url": "https://zenia.fr",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://zenia.fr/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Zenia"
  }
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Zenia",
  "description": "Service de paiement des forfaits post-stationnement en France",
  "url": "https://zenia.fr",
  "telephone": "+33-1-80-88-33-88",
  "email": "support@zenia.fr",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "FR",
    "addressLocality": "Paris",
    "postalCode": "75001"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "48.8566",
    "longitude": "2.3522"
  },
  "openingHours": "Mo-Fr 09:00-18:00",
  "priceRange": "€€",
  "paymentAccepted": ["Cash", "Credit Card", "Klarna"],
  "currenciesAccepted": "EUR"
};

export const breadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const howItWorksSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Comment payer un FPS avec Zenia",
  "description": "Guide étape par étape pour payer vos forfaits post-stationnement avec Zenia",
  "image": "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg",
  "totalTime": "PT5M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "EUR",
    "value": "0"
  },
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "Avis de paiement FPS"
    },
    {
      "@type": "HowToSupply", 
      "name": "Carte bancaire ou compte Klarna"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Entrez vos informations FPS",
      "text": "Saisissez votre numéro de FPS, clé de contrôle et immatriculation du véhicule",
      "image": "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg"
    },
    {
      "@type": "HowToStep",
      "name": "Choisissez votre mode de paiement",
      "text": "Sélectionnez entre paiement immédiat, fractionné en 3 fois, ou différé à 30 jours",
      "image": "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg"
    },
    {
      "@type": "HowToStep",
      "name": "Recevez votre justificatif",
      "text": "Confirmation immédiate et justificatif officiel envoyé par email",
      "image": "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg"
    }
  ]
};

export const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Service de paiement FPS Zenia",
  "description": "Paiement flexible des forfaits post-stationnement avec options de fractionnement et de différé",
  "brand": {
    "@type": "Brand",
    "name": "Zenia"
  },
  "category": "Services financiers",
  "image": "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    "lowPrice": "0",
    "highPrice": "20",
    "offerCount": "3",
    "offers": [
      {
        "@type": "Offer",
        "name": "Paiement immédiat",
        "price": "0",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01"
      },
      {
        "@type": "Offer", 
        "name": "Paiement fractionné 3x",
        "price": "20",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01"
      },
      {
        "@type": "Offer",
        "name": "Paiement différé 30 jours", 
        "price": "15",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01"
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1247",
    "bestRating": "5",
    "worstRating": "1"
  }
};

export const articleSchema = (title: string, description: string, url: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "url": url,
  "author": {
    "@type": "Organization",
    "name": "Zenia"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Zenia",
    "logo": {
      "@type": "ImageObject",
      "url": "https://zenia.fr/logo.png"
    }
  },
  "datePublished": "2024-01-25T00:00:00+00:00",
  "dateModified": "2025-01-25T00:00:00+00:00",
  "image": "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": url
  }
});

export const webPageSchema = (title: string, description: string, url: string) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": title,
  "description": description,
  "url": url,
  "inLanguage": "fr-FR",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Zenia",
    "url": "https://zenia.fr"
  },
  "about": {
    "@type": "Thing",
    "name": "Paiement FPS",
    "description": "Forfait Post-Stationnement"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://zenia.fr"
      }
    ]
  }
});
