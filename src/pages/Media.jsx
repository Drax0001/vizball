import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Camera } from 'lucide-react';
import MasonryGallery from '../components/gallery/MasonryGallery';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';

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
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(43,75%,49%) 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
              <Camera size={14} className="text-accent" />
              <span className="font-body text-xs font-bold uppercase tracking-wider text-accent">{tr.media_badge}</span>
            </div>
            <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl text-white leading-none mb-4">
              {tr.media_title}<br /><span className="text-[hsl(var(--background))]">{tr.media_title2}</span>
            </h1>
            <p className="font-body text-lg text-white/60 max-w-xl leading-relaxed">
              {tr.media_subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
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