import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

const PHOTOS = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    category: 'Matchs',
    caption: { fr: 'Duel en zone de tir', en: 'Duel in the shooting zone' },
    span: 'row-span-2',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    category: 'Joueurs',
    caption: { fr: 'Concentration avant le match', en: 'Focus before the match' },
    span: '',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    category: 'Équipements',
    caption: { fr: 'Terrain officiel Vizball', en: 'Official Vizball field' },
    span: '',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
    category: 'Matchs',
    caption: { fr: 'Action en zone de duel', en: 'Action in the duel zone' },
    span: 'row-span-2',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80',
    category: 'Joueurs',
    caption: { fr: 'Esprit d\'équipe', en: 'Team spirit' },
    span: '',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80',
    category: 'Événements',
    caption: { fr: 'Cérémonie d\'ouverture', en: 'Opening ceremony' },
    span: '',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1544298621-35a989e4e54a?w=800&q=80',
    category: 'Matchs',
    caption: { fr: 'Tir sur la cible', en: 'Shot at the Target' },
    span: '',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&q=80',
    category: 'Joueurs',
    caption: { fr: 'Entraînement collectif', en: 'Team training' },
    span: 'row-span-2',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
    category: 'Équipements',
    caption: { fr: 'Balles de tir officielles', en: 'Official shooting balls' },
    span: '',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
    category: 'Événements',
    caption: { fr: 'Tournoi national 2024', en: '2024 national tournament' },
    span: '',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    category: 'Matchs',
    caption: { fr: 'Phase de défense', en: 'Defensive phase' },
    span: '',
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&q=80',
    category: 'Joueurs',
    caption: { fr: 'Célébration de but', en: 'Goal celebration' },
    span: 'row-span-2',
  },
];

const CATEGORIES = ['Tous', 'Matchs', 'Joueurs', 'Équipements', 'Événements'];
const CATEGORY_KEYS = {
  'Tous': 'media_cat_all',
  'Matchs': 'media_cat_matches',
  'Joueurs': 'media_cat_players',
  'Équipements': 'media_cat_equipment',
  'Événements': 'media_cat_events',
};

export default function MasonryGallery() {
  const { lang } = useLang();
  const tr = t[lang];
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [lightbox, setLightbox] = useState(null); // index in filtered

  const filtered = activeCategory === 'Tous'
    ? PHOTOS
    : PHOTOS.filter((p) => p.category === activeCategory);

  const openLightbox = useCallback((index) => setLightbox(index), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() =>
    setLightbox((i) => (i - 1 + filtered.length) % filtered.length), [filtered.length]);
  const next = useCallback(() =>
    setLightbox((i) => (i + 1) % filtered.length), [filtered.length]);

  // keyboard navigation
  React.useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, prev, next, closeLightbox]);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-body text-xs font-bold uppercase tracking-wider border transition-all ${
              activeCategory === cat
                ? 'bg-accent text-primary border-accent'
                : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            {tr[CATEGORY_KEYS[cat]]}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((photo, index) => (
          <motion.div
            key={photo.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl"
            onClick={() => openLightbox(index)}
          >
            <img
              src={photo.src}
              alt={photo.caption[lang]}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-300 flex flex-col items-center justify-center gap-2">
              <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-accent bg-accent/20 px-2 py-0.5 rounded-full font-body mb-1">
                  {tr[CATEGORY_KEYS[photo.category]]}
                </span>
                <p className="font-body text-sm text-white font-medium">{photo.caption[lang]}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <X size={24} />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl max-h-[80vh] mx-16 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightbox]?.src}
                alt={filtered[lightbox]?.caption[lang]}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-4 text-center">
                <span className="font-body text-xs font-bold uppercase tracking-wider text-accent">
                  {tr[CATEGORY_KEYS[filtered[lightbox]?.category]]}
                </span>
                <p className="font-body text-sm text-white/80 mt-1">{filtered[lightbox]?.caption[lang]}</p>
                <p className="font-body text-xs text-white/30 mt-2">{lightbox + 1} / {filtered.length}</p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}