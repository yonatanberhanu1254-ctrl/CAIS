import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BuildingOfficeIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const SectorCard = ({ sector }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="h-48 overflow-hidden bg-slate-100">
        {sector.image_url ? (
          <img 
            src={sector.image_url} 
            alt={t('public.sectorCard.imgAlt', { name: sector.name })} 
            className="w-full h-full object-cover"
            loading="lazy" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <BuildingOfficeIcon className="h-16 w-16 text-slate-300" aria-hidden="true" />
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{sector.name}</h3>
          <p className="text-slate-500 text-sm line-clamp-3 mb-4">
            {sector.short_description || sector.description}
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
          {sector.phone && (
            <div className="flex items-center text-sm text-slate-600">
              <PhoneIcon className="h-4 w-4 mr-2 text-slate-400" />
              {sector.phone}
            </div>
          )}
          {sector.email && (
            <div className="flex items-center text-sm text-slate-600">
              <EnvelopeIcon className="h-4 w-4 mr-2 text-slate-400" />
              {sector.email}
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <Link 
            to={`/sectors/${sector.id}`} 
            className="w-full block text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium text-sm"
          >
            {t('public.sectorCard.viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SectorCard;
