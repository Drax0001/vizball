import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera } from 'lucide-react';
import MasonryGallery from '../components/gallery/MasonryGallery';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import staticHistory1 from '../assets/images/magnific__4-hommes-de-race-noire-de-la-trentaine-sur-un-terr__52507.webp';
import staticHistory2 from '../assets/images/magnific__intgrer-la-date-de-2007-en-3d-de-couleur-grise-ave__38506.webp';
import staticHistory3 from '../assets/images/magnific__la-vue-est-un-peu-eloigneles-3-garcons-ont-des-tai__61809.webp';
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

      {/* Static Historical Photos */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="section-title mb-10 text-white">{lang === 'en' ? 'History' : 'Historique'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[staticHistory1, staticHistory2, staticHistory3].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative rounded-xl overflow-hidden group cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Historical photo ${i + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-300 flex items-center justify-center">
                    <Camera size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Dynamic Gallery */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <MasonryGallery />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}