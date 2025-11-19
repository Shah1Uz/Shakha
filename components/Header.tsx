
import React, { useState, useRef, useEffect } from 'react';
import { LogoIcon } from './Icon';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../utils/translations';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'uz', name: "O'zbek", flag: "🇺🇿" },
    { code: 'ru', name: "Русский", flag: "🇷🇺" },
    { code: 'en', name: "English", flag: "🇺🇸" },
  ];

  const currentLang = languages.find(l => l.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-base-200/50 backdrop-blur-md sticky top-0 z-20 border-b border-base-300/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
           <div className="flex items-center">
             <div className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white p-1.5 rounded-lg shadow-lg">
                <LogoIcon className="h-6 w-6" />
             </div>
            <h1 className="ml-3 text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
              {t.app_name}
            </h1>
           </div>

           {/* Language Selector */}
           <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 bg-base-300/50 hover:bg-base-300 px-3 py-1.5 rounded-full transition-all duration-200 border border-transparent hover:border-base-content/10"
              >
                <span className="text-xl leading-none">{currentLang?.flag}</span>
                <span className="text-sm font-medium hidden sm:block">{currentLang?.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-base-content-secondary transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-base-200 rounded-xl shadow-xl border border-base-300 py-1 overflow-hidden animate-fade-in-up">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-2 text-sm hover:bg-base-300 transition-colors ${language === lang.code ? 'text-brand-primary font-bold bg-brand-primary/10' : 'text-base-content'}`}
                    >
                      <span className="text-xl mr-3">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
