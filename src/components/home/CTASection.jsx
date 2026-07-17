import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gray-900" />
        
        <div className="absolute inset-0 bg-primary/85" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}>
          
          <h2 className="text-[hsl(var(--accent))] mb-6 text-5xl font-heading sm:text-7xl">
            {tr.cta_title_1} <span className="text-accent">{tr.cta_title_2}</span>
          </h2>
          <p className="font-body text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
            {tr.cta_desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider px-10 py-4 rounded transition-all">
              
              {tr.cta_contact}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/association"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-accent text-white hover:text-accent font-body font-bold text-sm uppercase tracking-wider px-10 py-4 rounded transition-all">
              
              {tr.cta_association}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>);

}