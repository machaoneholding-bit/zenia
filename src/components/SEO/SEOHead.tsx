import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  structuredData?: object;
  canonical?: string;
  articleData?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
}

export default function SEOHead({
  title = "Zenia - Payer vos FPS en toute sérénité | Paiement fractionné et différé",
  description = "Payez vos FPS (Forfaits Post-Stationnement) en 1, 3 fois ou différé à 30 jours avec Klarna. Solution légale, sécurisée et transparente. Justificatif immédiat.",
  keywords = "FPS, forfait post-stationnement, paiement fractionné, Klarna, stationnement, amende, paiement différé, justificatif, légal",
  ogImage = "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop",
  ogUrl = "https://zenia.fr",
  structuredData,
  canonical,
  articleData
}: SEOHeadProps) {
  React.useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // Update Open Graph tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateMeta('og:title', title);
    updateOrCreateMeta('og:description', description);
    updateOrCreateMeta('og:image', ogImage);
    updateOrCreateMeta('og:url', ogUrl);
    updateOrCreateMeta('og:type', articleData ? 'article' : 'website');
    updateOrCreateMeta('og:site_name', 'Zenia');
    updateOrCreateMeta('og:locale', 'fr_FR');

    // Article-specific Open Graph tags
    if (articleData) {
      if (articleData.author) {
        updateOrCreateMeta('article:author', articleData.author);
      }
      if (articleData.publishedTime) {
        updateOrCreateMeta('article:published_time', articleData.publishedTime);
      }
      if (articleData.modifiedTime) {
        updateOrCreateMeta('article:modified_time', articleData.modifiedTime);
      }
      if (articleData.section) {
        updateOrCreateMeta('article:section', articleData.section);
      }
      if (articleData.tags) {
        articleData.tags.forEach(tag => {
          const tagMeta = document.createElement('meta');
          tagMeta.setAttribute('property', 'article:tag');
          tagMeta.setAttribute('content', tag);
          document.head.appendChild(tagMeta);
        });
      }
    }

    // Twitter Cards
    updateOrCreateMeta('twitter:card', 'summary_large_image');
    updateOrCreateMeta('twitter:title', title);
    updateOrCreateMeta('twitter:description', description);
    updateOrCreateMeta('twitter:image', ogImage);
    updateOrCreateMeta('twitter:site', '@zenia_fr');
    updateOrCreateMeta('twitter:creator', '@zenia_fr');

    // Additional SEO meta tags
    const updateOrCreateNameMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateNameMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateOrCreateNameMeta('googlebot', 'index, follow');
    updateOrCreateNameMeta('bingbot', 'index, follow');
    updateOrCreateNameMeta('format-detection', 'telephone=no');
    updateOrCreateNameMeta('theme-color', '#2563eb');

    // Canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

    // Structured Data
    if (structuredData) {
      // Remove existing structured data scripts
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => {
        if (script.getAttribute('data-page-schema')) {
          script.remove();
        }
      });

      // Add new structured data
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-page-schema', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Preconnect for performance
    const addPreconnect = (href: string) => {
      if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        document.head.appendChild(link);
      }
    };

    addPreconnect('https://fonts.googleapis.com');
    addPreconnect('https://images.pexels.com');
    addPreconnect('https://js.stripe.com');

  }, [title, description, keywords, ogImage, ogUrl, structuredData, canonical, articleData]);

  return null;
}