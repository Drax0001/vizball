import React from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import FieldLines from './field/FieldLines';
import LanguageSwitcher from './LanguageSwitcher';
import Cta from './site/Cta';
import { EASE_OUT } from '@/lib/motion';
import vizballLogo from '../assets/images/vizball-logo-couleur.png';

export default function UnderConstruction({ onEnter }) {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <MotionConfig reducedMotion="user">
      <div className="pitch fixed inset-0 z-[9999] flex flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-[var(--gutter)] opacity-70">
          <FieldLines draw="mount" duration={2} className="h-full w-full text-chalk/50" />
        </div>

        <header className="shell relative flex h-20 items-center justify-between">
          <img src={vizballLogo} alt="Vizball" className="h-14 w-auto" />
          <LanguageSwitcher />
        </header>

        <main className="shell relative flex flex-1 flex-col items-start justify-end pb-[10vh]">
          <motion.h1
            className="display text-[clamp(3.5rem,12vw,11rem)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.4 }}
          >
            {tr.construction_title}
          </motion.h1>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.7 }}
          >
            <Cta onClick={onEnter} tone="gold" size="lg">{tr.construction_cta}</Cta>
          </motion.div>
          <p className="voice mt-10 text-lg text-accent">“Rise Above The Game”</p>
        </main>
      </div>
    </MotionConfig>
  );
}
