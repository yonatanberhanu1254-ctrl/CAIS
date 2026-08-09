import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const PublicLayout = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-blue-600">{t('public.layout.portal')}</Link>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">{t('public.nav.home')}</Link>
                <Link to="/about" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">{t('public.nav.about')}</Link>
                <Link to="/sectors" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">{t('public.nav.sectors')}</Link>
                <Link to="/contact" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">{t('public.nav.contact')}</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              <LanguageSwitcher />
              <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">{t('public.nav.adminLogin')} &rarr;</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-slate-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-slate-400">
            &copy; {new Date().getFullYear()} {t('public.footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
