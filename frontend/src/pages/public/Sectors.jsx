import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../services/axios';
import PageHeader from '../../components/public/PageHeader';
import SectorCard from '../../components/public/SectorCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Sectors = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: sectors, isLoading, isError } = useQuery({
    queryKey: ['publicSectors', i18n.language],
    queryFn: async () => {
      const response = await api.get('/sectors/all');
      return response.data.data;
    }
  });

  // Client-side filtering logic
  const filteredSectors = React.useMemo(() => {
    if (!sectors) return [];
    if (!searchTerm) return sectors;
    return sectors.filter(sector => 
      sector.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      sector.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sectors, searchTerm]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <PageHeader 
        title={t('public.sectors.header.title')} 
        description={t('public.sectors.header.description')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <label htmlFor="search" className="sr-only">{t('public.sectors.search.ariaLabel')}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
              placeholder={t('public.sectors.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* State Management */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-white h-96 rounded-xl border border-slate-200"></div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-20 bg-white rounded-xl border border-red-100">
            <p className="text-red-500 font-medium">{t('public.sectors.error')}</p>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && !isError && filteredSectors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSectors.map((sector) => (
              <SectorCard key={sector.id} sector={sector} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredSectors.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 font-medium text-lg">{t('public.sectors.empty.message', { term: searchTerm })}</p>
            <button onClick={() => setSearchTerm('')} className="mt-4 text-blue-600 hover:text-blue-500 font-medium">
              {t('public.sectors.empty.clear')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sectors;
