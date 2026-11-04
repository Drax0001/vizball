import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';

// Every photo in src/assets/images (WebP files) is picked up automatically,
// so a photo added to that folder appears here without a code change.
// Logos, the seal and the favicon are PNG/ICO and are left out.
const FILES = import.meta.glob('../../assets/images/*.webp', { eager: true, import: 'default' });

const CAPTIONS = {
  'vizball-throne': { fr: 'Les Lions du Vizball', en: 'The Lions of Vizball' },
  'court-vizball': { fr: 'Le butoir, en salle', en: 'The backstop, indoors' },
  'ball-to-the-leg': { fr: 'Balle de catch', en: 'Catch ball' },
  'vizball-players-sitting-on-pitch': { fr: 'Joueuses sur le terrain', en: 'Players on the pitch' },
  'community-vizball': { fr: "Séance d'initiation", en: 'Introduction session' },
  'vizball-on-arrive-fr': { fr: 'On arrive… (affiche, français)', en: 'On arrive… (poster, French)' },
  'vizball-we-are-coming-en': { fr: 'We are coming… (affiche, anglais)', en: 'We are coming… (poster, English)' },
};

const PHOTOS = Object.entries(FILES)
  .map(([path, src]) => {
    const key = path.split('/').pop().replace(/\.webp$/, '');
    return { key, src, caption: CAPTIONS[key] || null };
  })
  // Captioned photos first, in the order above; historical images after.
  .sort((a, b) => {
    const order = Object.keys(CAPTIONS);
    const ia = order.indexOf(a.key);
    const ib = order.indexOf(b.key);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.key.localeCompare(b.key);
  });

export default function PhotoLibrary() {
  const { lang } = useLang();
  const [open, setOpen] = useState(null);
  const label = (p, i) => (p.caption ? p.caption[lang] : `${lang === 'en' ? 'Vizball photo' : 'Photo Vizball'} ${i + 1}`);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((i) => (i + d + PHOTOS.length) % PHOTOS.length), []);

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [open, close, step]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {PHOTOS.map((p, i) => (
          <motion.li
            key={p.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.05 }}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="photo-card group relative block aspect-[4/3] w-full overflow-hidden rounded-lg"
              aria-label={label(p, i)}
            >
              <img src={p.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="meta flex w-full items-center justify-between gap-2 text-left text-white">
                  <span className="truncate">{label(p, i)}</span>
                  <Expand size={15} className="shrink-0" />
                </span>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label(PHOTOS[open], open)}
            className="fixed inset-0 z-[60] flex flex-col bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
              <p className="meta text-white/80">
                {open + 1} / {PHOTOS.length} · {label(PHOTOS[open], open)}
              </p>
              <button type="button" onClick={close} aria-label={lang === 'en' ? 'Close' : 'Fermer'} className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10">
                <X size={22} />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-16">
              <AnimatePresence mode="wait">
                <motion.img
                  key={open}
                  src={PHOTOS[open].src}
                  alt={label(PHOTOS[open], open)}
                  className="max-h-full max-w-full rounded object-contain"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                aria-label={lang === 'en' ? 'Previous photo' : 'Photo précédente'}
                className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-accent hover:text-primary sm:left-4"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(1); }}
                aria-label={lang === 'en' ? 'Next photo' : 'Photo suivante'}
                className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-accent hover:text-primary sm:right-4"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
