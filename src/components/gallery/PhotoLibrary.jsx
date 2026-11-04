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
  'dodging-in-vizball': { fr: "L'esquive au Vizball", en: 'Dodging in Vizball' },
  'court-vizball': { fr: 'Le butoir, en salle', en: 'The backstop, indoors' },
  'ball-to-the-leg': { fr: 'Balle de catch', en: 'Catch ball' },
  'vizball-players-sitting-on-pitch': { fr: 'Joueuses sur le terrain', en: 'Players on the pitch' },
  'vizball-equipes-avant-coup-envoi': { fr: "Les équipes alignées avant le coup d'envoi", en: 'Teams lined up before kick-off' },
  'vizball-jeune-generation': { fr: 'La jeune génération du Vizball', en: "Vizball's young generation" },
  'vizball-2007-naissance': { fr: "2007, l'année de naissance du Vizball", en: '2007, the year Vizball was born' },
  'community-vizball': { fr: "Séance d'initiation", en: 'Introduction session' },
};

// A file named "<name>-fr.webp" / "<name>-en.webp" is one image in two
// languages: only the visitor's language is shown.
const LANG_SUFFIX = /-(fr|en)$/;

// Readable name from a file name, for photos added without a caption.
const humanize = (key) => {
  const words = key.replace(LANG_SUFFIX, '').replace(/[-_]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const ALL = Object.entries(FILES)
  .map(([path, src]) => {
    const key = path.split('/').pop().replace(/.webp$/, '');
    const base = key.replace(LANG_SUFFIX, '');
    return { key, base, lang: key.match(LANG_SUFFIX)?.[1] || null, src, caption: CAPTIONS[base] || null };
  })
  .sort((a, b) => {
    const order = Object.keys(CAPTIONS);
    const ia = order.indexOf(a.base);
    const ib = order.indexOf(b.base);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.key.localeCompare(b.key);
  });

export const photoCaption = (p, lang) => (p.caption ? p.caption[lang] : humanize(p.key));

export default function PhotoLibrary() {
  const { lang } = useLang();
  const [open, setOpen] = useState(null);
  const PHOTOS = ALL.filter((p) => !p.lang || p.lang === lang);
  const label = (p) => photoCaption(p, lang);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((i) => (i + d + PHOTOS.length) % PHOTOS.length), [PHOTOS.length]);

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
              aria-label={label(p)}
            >
              <img src={p.src} alt={label(p)} loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="meta flex w-full items-center justify-between gap-2 text-left text-white">
                  <span className="truncate">{label(p)}</span>
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
            aria-label={label(PHOTOS[open])}
            className="fixed inset-0 z-[60] flex flex-col bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
              <p className="meta text-white/80">
                {open + 1} / {PHOTOS.length} · {label(PHOTOS[open])}
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
                  alt={label(PHOTOS[open])}
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
