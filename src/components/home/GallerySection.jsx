import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import galleryImage1Eng from '../../assets/images/vizball--4-eng.jpg';
import galleryImage2Eng from '../../assets/images/vizball--5-eng.jpg';
import galleryImage3Eng from '../../assets/images/vizball--6-eng.jpg';
import galleryImage4Fr from '../../assets/images/vizball--7-fr.jpg';

// Language-specific images
const GALLERY_IMAGES = {
  fr: [galleryImage1Eng, galleryImage1Eng, galleryImage1Eng, galleryImage4Fr],
  en: [galleryImage1Eng, galleryImage2Eng, galleryImage3Eng, galleryImage4Fr]
};

const getGalleryImages = (lang) => [
{ src: GALLERY_IMAGES[lang][0], alt: 'Vizball athlete', span: 'row-span-2' },
{ src: GALLERY_IMAGES[lang][1], alt: 'Action on the field', span: '' },
{ src: GALLERY_IMAGES[lang][2], alt: 'Young players', span: '' },
{ src: GALLERY_IMAGES[lang][3], alt: 'Female athlete', span: 'row-span-2' },
{ src: GALLERY_IMAGES[lang][0], alt: 'Stadium', span: '' },
{ src: GALLERY_IMAGES[lang][1], alt: 'Aerial view', span: '' }];


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