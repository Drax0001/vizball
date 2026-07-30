import React from 'react';
import { HardHat, DoorOpen } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';

export default function UnderConstruction({ onEnter }) {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary">
      <div className="text-center px-6">
        <HardHat size={56} className="text-accent mx-auto mb-6" />
        <h1 className="font-heading text-3xl sm:text-4xl text-white mb-6">{tr.construction_title}</h1>
        <button
          type="button"
          onClick={onEnter}
          className="font-body text-lg font-bold uppercase tracking-wider text-accent hover:text-white transition-colors underline underline-offset-4"
        >
          {tr.construction_cta}
        </button>
        <DoorOpen size={40} className="text-white/40 mx-auto mt-8" />
      </div>
    </div>
  );
}
