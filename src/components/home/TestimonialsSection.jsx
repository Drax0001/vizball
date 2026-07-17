import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section ref={ref} className="py-24 bg-primary overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14">
          
          <span className="font-body text-xs font-bold uppercase tracking-widest text-secondary">{tr.testimonials_badge}</span>
          <h2 className="font-heading text-5xl sm:text-6xl text-white mt-3">
            {tr.testimonials_title} <span className="text-[hsl(var(--background))]">{tr.testimonials_title2}</span>
          </h2>
        </motion.div>

        {/* Not Available Message */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative">
          
          <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 min-h-[280px] flex flex-col items-center justify-center overflow-hidden">
            <p className="font-body text-lg text-white/60 text-center">
              {tr.testimonials_unavailable}
            </p>
          </div>
        </motion.div>
      </div>
    </section>);

}