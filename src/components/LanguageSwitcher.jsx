import React from 'react';
import { useLang } from '../lib/LanguageContext';

const OPTIONS = [
  { code: 'fr', label: 'FR', title: 'Français' },
  { code: 'en', label: 'EN', title: 'English' },
];

export default function LanguageSwitcher({ className = '', tone = 'chalk' }) {
  const { lang, setLang } = useLang();
  const ring = tone === 'chalk' ? 'ring-chalk/25' : 'ring-night/20';
  const active = tone === 'chalk' ? 'bg-chalk text-night' : 'bg-night text-chalk';
  const idle = tone === 'chalk' ? 'text-chalk/70 hover:text-chalk' : 'text-night/60 hover:text-night';

  return (
    <div className={`inline-flex items-center rounded-full p-1 ring-1 ring-inset ${ring} ${className}`} role="group" aria-label="Langue / Language">
      {OPTIONS.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => setLang(o.code)}
          title={o.title}
          aria-pressed={lang === o.code}
          className={`h-8 min-w-[2.5rem] rounded-full px-2.5 font-heading text-xs font-bold tracking-[0.12em] transition-colors duration-300 ${lang === o.code ? active : idle}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
