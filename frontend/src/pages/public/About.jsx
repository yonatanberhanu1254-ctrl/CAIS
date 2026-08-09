import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../services/axios';
import PageHeader from '../../components/public/PageHeader';

const About = () => {
  const { t, i18n } = useTranslation();
  const { data: cityInfo, isLoading } = useQuery({
    queryKey: ['cityInfo', i18n.language],
    queryFn: async () => {
      const response = await api.get('/city-information');
      return response.data.data;
    }
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center text-slate-500">{t('public.about.loading')}</div>;

  return (
    <div className="bg-white">
      <PageHeader 
        title={t('public.about.header.title')} 
        description={t('public.about.header.description')}
        backgroundImage={cityInfo?.banner_url || "/images/asella_banner.png"}
      />

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('public.about.identity.title')}</h2>
              <p className="mt-4 text-lg text-slate-500">
                {t('public.about.identity.subtitle')}
              </p>
              
              {cityInfo?.logo_url && (
                <div className="mt-8">
                  <img src={cityInfo.logo_url} alt="Official City Logo" className="h-32 w-auto object-contain" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 lg:mt-0 lg:col-span-2 space-y-12">
            
            {/* History Section */}
            <section aria-labelledby="history-heading">
              <h3 id="history-heading" className="text-2xl font-bold text-slate-900 mb-4">{t('public.about.history.title')}</h3>
              <div className="prose prose-blue text-slate-500 max-w-none">
                <p>{cityInfo?.history || t('public.about.history.empty')}</p>
              </div>
            </section>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-slate-50 rounded-xl p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">🎯</span>
                  {t('public.about.mission.title')}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {cityInfo?.mission || t('public.about.mission.empty')}
                </p>
              </section>

              <section className="bg-slate-50 rounded-xl p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">🔭</span>
                  {t('public.about.vision.title')}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {cityInfo?.vision || t('public.about.vision.empty')}
                </p>
              </section>
            </div>

            {/* Mayor Message Expansion */}
            <section aria-labelledby="mayor-heading" className="border-t border-slate-200 pt-12">
              <div className="flex items-center gap-6 mb-6">
                <img 
                  src={cityInfo?.mayor_image_url || "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=200&auto=format&fit=crop"} 
                  alt="City Mayor" 
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
                <div>
                  <h3 id="mayor-heading" className="text-2xl font-bold text-slate-900">{t('public.about.mayor.title')}</h3>
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">{t('public.about.mayor.subtitle')}</p>
                </div>
              </div>
              <blockquote className="border-l-4 border-blue-500 pl-6 italic text-slate-600 text-lg">
                "{cityInfo?.mayor_message || t('public.about.mayor.empty')}"
              </blockquote>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
