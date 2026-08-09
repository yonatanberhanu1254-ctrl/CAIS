import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AppRoutes from './routes/AppRoutes';

/**
 * Root Application Component
 * Delegates all rendering to the AppRoutes matrix to enable 
 * lazy loading and clean layout boundaries.
 */
function App() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const updateSEO = (lng) => {
      document.documentElement.lang = lng;
      document.title = t('public.home.hero.title');
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', t('public.home.hero.subtitle'));
      }
    };

    // Initial SEO update
    updateSEO(i18n.language || 'en');
    
    i18n.on('languageChanged', updateSEO);
    return () => {
      i18n.off('languageChanged', updateSEO);
    };
  }, [i18n, t]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AppRoutes />
    </div>
  );
}

export default App;
