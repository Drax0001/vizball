import React from 'react';
import { useLang } from '../lib/LanguageContext';

export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang } = useLang();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => setLang('fr')}
        title="Français"
        className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all font-body text-xs font-bold uppercase tracking-wider ${
        lang === 'fr' ?
        'bg-white/15 text-white' :
        'text-white/40 hover:text-white/80 hover:bg-white/5'}`
        }>
        
        
        <span>FR</span>
      </button>
      <div className="w-px h-4 bg-white/20" />
      <button
        onClick={() => setLang('en')}
        title="English"
        className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all font-body text-xs font-bold uppercase tracking-wider ${
        lang === 'en' ?
        'bg-white/15 text-white' :
        'text-white/40 hover:text-white/80 hover:bg-white/5'}`
        }>
        
        
        <span>ENG</span>
      </button>
    </div>);

}