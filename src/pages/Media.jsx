import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import MasonryGallery from '../components/gallery/MasonryGallery';
import PhotoLibrary from '../components/gallery/PhotoLibrary';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import PageHeader from '../components/PageHeader';
import headerImage from '../assets/images/vizball-players-sitting-on-pitch.webp';

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Media() {
  const { lang } = useLang();
  const tr = t[lang];
  return (
    <div className="min-h-screen bg-primary">
      <PageHeader title={`${tr.media_title} ${tr.media_title2}`} subtitle={tr.media_subtitle} image={headerImage} />

      {/* Every photo in the images folder */}
      <section className="py-14 md:py-20">
        <div className="shell">
          <h2 className="section-title mb-10 text-white">{lang === 'en' ? 'Photo library' : 'Photothèque'}</h2>
          <PhotoLibrary />
        </div>
      </section>

      {/* Dynamic Gallery */}
      <section className="py-12">
        <div className="shell">
          <AnimatedSection>
            <MasonryGallery />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}