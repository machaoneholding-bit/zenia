import React from 'react';

interface AnalyticsProps {
  googleAnalyticsId?: string;
  googleSearchConsoleId?: string;
}

export default function Analytics({ googleAnalyticsId, googleSearchConsoleId }: AnalyticsProps) {
  React.useEffect(() => {
    // Google Analytics
    if (googleAnalyticsId) {
      // Create script for gtag
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      document.head.appendChild(gtagScript);

      // Initialize gtag
      const gtagConfigScript = document.createElement('script');
      gtagConfigScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${googleAnalyticsId}', {
          page_title: document.title,
          page_location: window.location.href
        });
      `;
      document.head.appendChild(gtagConfigScript);
    }

    // Google Search Console verification
    if (googleSearchConsoleId) {
      const verificationMeta = document.createElement('meta');
      verificationMeta.name = 'google-site-verification';
      verificationMeta.content = googleSearchConsoleId;
      document.head.appendChild(verificationMeta);
    }
  }, [googleAnalyticsId, googleSearchConsoleId]);

  return null;
}

// Hook for tracking page views
export const usePageTracking = () => {
  const trackPageView = (pageName: string, pageTitle: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: pageTitle,
        page_location: window.location.href,
        custom_map: { custom_parameter: pageName }
      });
    }
  };

  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }
  };

  return { trackPageView, trackEvent };
};