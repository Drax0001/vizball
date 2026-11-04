import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';

// Inner-page banner: photo under a green wash, breadcrumb, title, subtitle,
// optional actions. Sits under the fixed navbar (80px bar + 28px strip).
export default function PageHeader({ title, subtitle, image, crumb, children }) {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section className="relative isolate overflow-hidden bg-primary pt-[108px]">
      {image && (
        <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-primary/85 to-primary/40" />

      <motion.div
        className="shell py-14 md:py-20"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav aria-label={lang === 'en' ? 'Breadcrumb' : "Fil d'Ariane"}>
          <ol className="meta flex flex-wrap items-center gap-1.5 text-white/70">
            <li>
              <Link to="/" className="hover:text-white">{tr.nav_home}</Link>
            </li>
            <li aria-hidden="true"><ChevronRight size={14} /></li>
            <li aria-current="page" className="text-accent">{crumb || title}</li>
          </ol>
        </nav>
        <h1 className="mt-4 max-w-4xl font-heading text-[clamp(2.75rem,7vw,5.5rem)] font-black uppercase leading-[0.9] tracking-tight text-white">
          {title}
        </h1>
        {subtitle && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{subtitle}</p>}
        {children && <div className="mt-8 flex flex-wrap items-center gap-4">{children}</div>}
      </motion.div>
      <div className="h-1 bg-gradient-to-r from-[hsl(var(--brand-red))] via-accent to-secondary" aria-hidden="true" />
    </section>
  );
}
