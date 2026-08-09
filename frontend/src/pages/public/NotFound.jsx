import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-[80vh] bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-9xl font-extrabold text-blue-600 tracking-tight">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">{t('public.notFound.title')}</h2>
        <p className="mt-4 text-lg text-slate-500">
          {t('public.notFound.description')}
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('public.notFound.button')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
