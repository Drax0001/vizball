import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera } from 'lucide-react';
import MasonryGallery from '../components/gallery/MasonryGallery';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import PageHero from '../components/site/PageHero';
import mediaImage from '../assets/images/vizball-players-sitting-on-pitch.webp';
import staticHistory1 from '../assets/images/magnific__4-hommes-de-race-noire-de-la-trentaine-sur-un-terr__52507.webp';
import staticHistory2 from '../assets/images/magnific__intgrer-la-date-de-2007-en-3d-de-couleur-grise-ave__38506.webp';
import staticHistory3 from '../assets/images/magnific__la-vue-est-un-peu-eloigneles-3-garcons-ont-des-tai__61809.webp';

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
    <div className="min-h-screen bg-primary text-chalk">
      <PageHero title={`${tr.media_title} ${tr.media_title2}`} accent={[1]} subtitle={tr.media_subtitle} image={mediaImage} imageAlt={tr.gallery_cap_3} crop="full" />

      {/* Static Historical Photos */}
      <section className="pb-12 pt-20 md:pt-28">
        <div className="shell">
          <AnimatedSection>
            <h2 className="display mb-10 text-[clamp(2.4rem,5.5vw,5rem)]">{lang === 'en' ? 'History' : 'Historique'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[staticHistory1, staticHistory2, staticHistory3].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-[14px]"
                >
                  <img
                    src={img}
                    alt={lang === 'en' ? `Vizball history, photo ${i + 1}` : `Histoire du Vizball, photo ${i + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-300 flex items-center justify-center">
                    <Camera size={32} className="text-chalk opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
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