import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../services/axios';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ArrowLeftIcon, ClockIcon, MapIcon } from '@heroicons/react/24/outline';

const SectorDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const { data: sector, isLoading, isError } = useQuery({
    queryKey: ['sectorDetails', id, i18n.language],
    queryFn: async () => {
      const response = await api.get(`/sectors/${id}`);
      return response.data.data;
    }
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center">{t('public.sectorDetails.loading')}</div>;
  if (isError || !sector) return <div className="h-screen flex items-center justify-center text-red-500">{t('public.sectorDetails.error')}</div>;

  return (
    <div className="bg-white pb-24">
      {/* Dynamic Header */}
      <div className="relative bg-slate-900 h-80">
        {sector.image_url && (
           <img src={sector.image_url} alt="" className="w-full h-full object-cover opacity-30" />
        )}
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
          <Link to="/sectors" className="text-blue-400 hover:text-blue-300 flex items-center mb-6 text-sm font-medium w-fit">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            {t('public.sectorDetails.back')}
          </Link>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">{sector.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('public.sectorDetails.overview')}</h2>
              <p className="text-slate-600 text-lg leading-relaxed">{sector.description}</p>
            </section>

            {(sector.mission || sector.vision) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sector.mission && (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{t('public.sectorDetails.mission')}</h3>
                    <p className="text-slate-600">{sector.mission}</p>
                  </div>
                )}
                {sector.vision && (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{t('public.sectorDetails.vision')}</h3>
                    <p className="text-slate-600">{sector.vision}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contact Sidebar */}
          <div className="mt-12 lg:mt-0 lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">{t('public.sectorDetails.contact.title')}</h3>
              
              <ul className="space-y-6">
                {sector.address && (
                  <li className="flex items-start">
                    <MapPinIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('public.sectorDetails.contact.address')}</p>
                      <p className="text-sm text-slate-500 mt-1">{sector.address}</p>
                    </div>
                  </li>
                )}
                {sector.phone && (
                  <li className="flex items-start">
                    <PhoneIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('public.sectorDetails.contact.phone')}</p>
                      <p className="text-sm text-slate-500 mt-1">{sector.phone}</p>
                    </div>
                  </li>
                )}
                {sector.email && (
                  <li className="flex items-start">
                    <EnvelopeIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('public.sectorDetails.contact.email')}</p>
                      <a href={`mailto:${sector.email}`} className="text-sm text-blue-600 hover:text-blue-500 mt-1">{sector.email}</a>
                    </div>
                  </li>
                )}
                {sector.office_hours && (
                  <li className="flex items-start">
                    <ClockIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t('public.sectorDetails.contact.hours')}</p>
                      <p className="text-sm text-slate-500 mt-1">{sector.office_hours}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mt-8">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">{t('public.sectorDetails.map.title')}</h3>
                <a 
                  href={`https://maps.google.com/?q=${sector.latitude || 7.9500},${sector.longitude || 39.1333}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-100 flex items-center font-medium bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                >
                  <MapIcon className="h-4 w-4 mr-2" /> {t('public.sectorDetails.map.openMap')}
                </a>
              </div>
              
              <div className="rounded-lg overflow-hidden border border-slate-200 h-64">
                <iframe 
                  src={sector.google_maps_url && (sector.google_maps_url.includes('/embed') || sector.google_maps_url.includes('output=embed')) 
                    ? sector.google_maps_url 
                    : `https://maps.google.com/maps?q=${sector.latitude || 7.9500},${sector.longitude || 39.1333}&t=&z=13&ie=UTF8&iwloc=&output=embed`} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                  title="Google Maps Location">
                </iframe>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SectorDetails;
