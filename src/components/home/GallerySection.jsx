import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

const images = [
{ src: '', alt: 'Vizball athlete', span: 'row-span-2' },
{ src: '', alt: 'Action on the field', span: '' },
{ src: '', alt: 'Young players', span: '' },
{ src: '', alt: 'Female athlete', span: 'row-span-2' },
{ src: '', alt: 'Stadium', span: '' },
{ src: '', alt: 'Aerial view', span: '' }];


export default function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { lang } = useLang();
  const tr = t[lang];

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
            
              <div className="w-full h-full bg-gray-900 group-hover:scale-110 transition-transform duration-700" />
            
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}