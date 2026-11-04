import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import galleryThrone from '../../assets/images/vizball-throne.webp';
import galleryCourt from '../../assets/images/court-vizball.webp';
import galleryCommunity from '../../assets/images/community-vizball.webp';
import galleryBallToLeg from '../../assets/images/ball-to-the-leg.webp';
import gallerySitting from '../../assets/images/vizball-players-sitting-on-pitch.webp';

const IMAGES = [
  { src: galleryThrone, alt: { fr: 'Les joueurs de Vizball', en: 'Vizball players' }, span: 'md:col-span-2 md:row-span-2' },
  { src: galleryCourt, alt: { fr: 'Le butoir, en salle', en: 'The backstop, indoors' }, span: '' },
  { src: galleryBallToLeg, alt: { fr: 'Balle de catch', en: 'Catch ball' }, span: 'md:row-span-2' },
  { src: gallerySitting, alt: { fr: 'Joueuses sur le terrain', en: 'Players on the pitch' }, span: '' },
  { src: galleryCommunity, alt: { fr: "Séance d'initiation", en: 'Introduction session' }, span: 'md:col-span-2' },
];

export default function GallerySection() {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section className="bg-primary py-20 md:py-28" aria-labelledby="gallery-title">
      <div className="shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 id="gallery-title" className="section-title text-white">
            {tr.gallery_title_1} <span className="text-accent">{tr.gallery_title_2}</span>
          </h2>
          <Link to="/media" className="group inline-flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-accent hover:text-white">
            {tr.gallery_view_all || 'Voir toutes les photos'}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
          {IMAGES.map((img, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`photo-card group relative overflow-hidden rounded-lg ${img.span}`}
            >
              <img src={img.src} alt={img.alt[lang]} loading="lazy" className="h-full w-full object-cover" />
              <figcaption className="meta absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {img.alt[lang]}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
