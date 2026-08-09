import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Get the current language, default to 'en' if undefined or it's a complex locale like en-US
  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'en';
  // i18next-browser-languagedetector might detect 'en-US', so we check against our supported langs
  const supportedLangs = ['en', 'am', 'om'];
  const displayLang = supportedLangs.includes(currentLanguage.substring(0, 2)) ? currentLanguage.substring(0, 2) : 'en';

  return (
    <div className="flex items-center">
      <GlobeAltIcon className="h-5 w-5 text-slate-500 mr-2" aria-hidden="true" />
      <select
        className="bg-white text-sm font-medium text-slate-700 border border-slate-300 rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
        value={displayLang}
        onChange={(e) => changeLanguage(e.target.value)}
        aria-label="Select Language"
      >
        <option value="en">🇬🇧 English</option>
        <option value="am">🇪🇹 አማርኛ</option>
        <option value="om">🇪🇹 Afaan Oromoo</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
