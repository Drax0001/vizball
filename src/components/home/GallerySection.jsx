import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import galleryThrone from '../../assets/images/vizball-throne.webp';
import galleryCourt from '../../assets/images/court-vizball.webp';
import galleryCommunity from '../../assets/images/community-vizball.webp';
import galleryBallToLeg from '../../assets/images/ball-to-the-leg.webp';
import gallerySitting from '../../assets/images/vizball-players-sitting-on-pitch.webp';
import galleryHistory1 from '../../assets/images/magnific__4-hommes-de-race-noire-de-la-trentaine-sur-un-terr__52507.webp';
import galleryHistory2 from '../../assets/images/magnific__intgrer-la-date-de-2007-en-3d-de-couleur-grise-ave__38506.webp';
import galleryHistory3 from '../../assets/images/magnific__la-vue-est-un-peu-eloigneles-3-garcons-ont-des-tai__61809.webp';

// Shared gallery images (same for every language)
const GALLERY_IMAGES = {
  fr: [galleryThrone, galleryCourt, galleryCommunity, galleryBallToLeg, gallerySitting, galleryHistory1, galleryHistory2, galleryHistory3],
  en: [galleryThrone, galleryCourt, galleryCommunity, galleryBallToLeg, gallerySitting, galleryHistory1, galleryHistory2, galleryHistory3]
};

const getGalleryImages = (lang) => [
{ src: GALLERY_IMAGES[lang][0], alt: 'Vizball players', span: 'row-span-2' },
{ src: GALLERY_IMAGES[lang][1], alt: 'Vizball arena', span: '' },
{ src: GALLERY_IMAGES[lang][2], alt: 'Vizball community', span: '' },
{ src: GALLERY_IMAGES[lang][3], alt: 'Ball at the leg', span: 'row-span-2' },
{ src: GALLERY_IMAGES[lang][4], alt: 'Players on the pitch', span: '' },
{ src: GALLERY_IMAGES[lang][1], alt: 'Vizball court', span: '' },
{ src: GALLERY_IMAGES[lang][5], alt: 'Historical photo 1', span: '' },
{ src: GALLERY_IMAGES[lang][6], alt: 'Historical photo 2', span: '' },
{ src: GALLERY_IMAGES[lang][7], alt: 'Historical photo 3', span: '' }];


export default function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { lang } = useLang();
  const tr = t[lang];
  const images = getGalleryImages(lang);

  return (
    <section ref={ref} className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16">
          
          <span className="font-subtitle text-sm uppercase tracking-widest text-secondary">{tr.gallery_badge}</span>
          <h2 className="text-[hsl(var(--accent))] mt-3 text-5xl font-heading sm:text-6xl">
            {tr.gallery_title_1} <span className="text-[hsl(var(--chart-3))]">{tr.gallery_title_2}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {images.map((img, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.1 }}
            className={`${img.span} rounded-lg overflow-hidden group cursor-pointer`}>

              <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

            </motion.div>
          )}
        </div>
      </div>
    </section>);

}