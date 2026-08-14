import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../services/axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BuildingLibraryIcon, UserGroupIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '../../utils/imageUrl';

const Home = () => {
  const { t, i18n } = useTranslation();
  const { data: cityInfo } = useQuery({
    queryKey: ['cityInfo', i18n.language],
    queryFn: async () => {
      const response = await api.get('/city-information');
      return response.data.data; // Returns info object directly
    }
  });

  const { data: sectorsData } = useQuery({
    queryKey: ['publicSectors', i18n.language],
    queryFn: async () => {
      const response = await api.get('/sectors/all');
      return response.data.data;
    }
  });

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <div className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getImageUrl(cityInfo?.banner_url) || "/images/asella_banner.png"}
            alt="City Skyline"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {cityInfo?.city_name || t('public.home.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-slate-300 max-w-3xl"
          >
            {cityInfo?.mission || t('public.home.hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex gap-4"
          >
            <Link to="/sectors" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-white hover:bg-slate-50 transition-colors">
              {t('public.home.hero.exploreSectors')}
            </Link>
            <Link to="/contact" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              {t('public.home.hero.contactUs')}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div className="flex flex-col items-center">
              <BuildingLibraryIcon className="h-12 w-12 text-blue-200 mb-3" />
              <p className="text-4xl font-extrabold text-white">{Array.isArray(sectorsData) ? sectorsData.length : 0}</p>
              <p className="mt-2 text-lg font-medium text-blue-100">{t('public.home.stats.activeSectors')}</p>
            </div>
            <div className="flex flex-col items-center">
              <UserGroupIcon className="h-12 w-12 text-blue-200 mb-3" />
              <p className="text-4xl font-extrabold text-white">1M+</p>
              <p className="mt-2 text-lg font-medium text-blue-100">{t('public.home.stats.citizensServed')}</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPinIcon className="h-12 w-12 text-blue-200 mb-3" />
              <p className="text-4xl font-extrabold text-white">24/7</p>
              <p className="mt-2 text-lg font-medium text-blue-100">{t('public.home.stats.publicSupport')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mayor Welcome */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              {t('public.home.mayor.title')}
            </h2>
            {cityInfo?.mayor_name && (
              <p className="mt-1 text-sm font-medium text-blue-600">{cityInfo.mayor_name}</p>
            )}
            <p className="mt-3 max-w-3xl text-lg text-slate-500">
              {cityInfo?.mayor_message || t('public.home.mayor.defaultMessage')}
            </p>
            <div className="mt-8">
              <Link to="/about" className="text-base font-medium text-blue-600 hover:text-blue-500 flex items-center">
                {t('public.home.mayor.readMore')} <span aria-hidden="true" className="ml-2">&rarr;</span>
              </Link>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 relative rounded-lg shadow-xl overflow-hidden group">
            <img
              src={getImageUrl(cityInfo?.mayor_image_url) || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1548&auto=format&fit=crop'}
              alt="City Mayor"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
