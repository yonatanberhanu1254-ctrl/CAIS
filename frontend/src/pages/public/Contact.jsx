import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../services/axios';
import PageHeader from '../../components/public/PageHeader';
import ContactForm from '../../components/public/ContactForm';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const { data: cityInfo } = useQuery({
    queryKey: ['cityInfo', i18n.language],
    queryFn: async () => {
      const response = await api.get('/city-information');
      return response.data.data;
    }
  });

  return (
    <div className="bg-white">
      <PageHeader 
        title={t('public.contact.header.title')} 
        description={t('public.contact.header.description')}
      />

      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          
          {/* Contact Details & Info */}
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8">{t('public.contact.info.title')}</h2>
            <p className="text-lg text-slate-500 mb-10">
              {t('public.contact.info.description')}
            </p>
            
            <dl className="space-y-8 text-base text-slate-500">
              {cityInfo?.address && (
                <div className="flex">
                  <MapPinIcon className="flex-shrink-0 h-6 w-6 text-blue-600" aria-hidden="true" />
                  <div className="ml-4">
                    <dt className="sr-only">{t('public.contact.info.address')}</dt>
                    <dd>{cityInfo.address}</dd>
                  </div>
                </div>
              )}
              {cityInfo?.phone && (
                <div className="flex">
                  <PhoneIcon className="flex-shrink-0 h-6 w-6 text-blue-600" aria-hidden="true" />
                  <div className="ml-4">
                    <dt className="sr-only">{t('public.contact.info.phone')}</dt>
                    <dd>{cityInfo.phone}</dd>
                  </div>
                </div>
              )}
              {cityInfo?.email && (
                <div className="flex">
                  <EnvelopeIcon className="flex-shrink-0 h-6 w-6 text-blue-600" aria-hidden="true" />
                  <div className="ml-4">
                    <dt className="sr-only">{t('public.contact.info.email')}</dt>
                    <dd><a href={`mailto:${cityInfo.email}`} className="text-blue-600 hover:text-blue-500">{cityInfo.email}</a></dd>
                  </div>
                </div>
              )}
            </dl>

            {/* Simulated Map Bounds via API Coords if available */}
            {(cityInfo?.latitude && cityInfo?.longitude) && (
              <div className="mt-12 bg-slate-100 rounded-xl h-64 overflow-hidden border border-slate-200 flex items-center justify-center">
                 <div className="text-center p-4">
                    <MapPinIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-600">{t('public.contact.map.locked')}</p>
                    <p className="text-xs text-slate-400">{cityInfo.latitude}, {cityInfo.longitude}</p>
                 </div>
              </div>
            )}
          </div>

          {/* Form Boundary */}
          <div className="mt-16 lg:mt-0 bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{t('public.contact.form.title')}</h3>
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
