import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import ctaImage from '../../assets/images/community-vizball.webp';

export default function CTASection() {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section className="relative isolate overflow-hidden bg-[hsl(var(--brand-red))] py-20 md:py-24" aria-labelledby="cta-title">
      <img src={ctaImage} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-15 mix-blend-multiply" />
      <motion.div
        className="shell flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-2xl">
          <h2 id="cta-title" className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-black uppercase leading-[0.92] text-white">
            {tr.cta_title_1} <span className="text-accent">{tr.cta_title_2}</span>
          </h2>
          <p className="mt-4 text-lg text-white/90">{tr.cta_desc}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link to="/contact" className="btn btn-gold">
            {tr.cta_contact}
            <ArrowRight size={18} />
          </Link>
          <Link to="/gouvernance" className="btn btn-outline-light">
            {tr.cta_association}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
