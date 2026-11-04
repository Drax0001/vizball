import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import imgCourt from '../../assets/images/court-vizball.webp';
import imgCommunity from '../../assets/images/community-vizball.webp';
import imgThrone from '../../assets/images/vizball-throne.webp';
import imgBall from '../../assets/images/ball-to-the-leg.webp';

// "Découvrir le Vizball": four photo cards with the caption under the image,
// as federation sites list their competitions.
export default function FeatureCards() {
  const { lang } = useLang();
  const tr = t[lang];

  const cards = [
    { title: tr.features_rules_title, desc: tr.features_rules_desc, link: '/le-sport', img: imgCourt },
    { title: tr.nav_tutorials, desc: tr.discover_tuto_desc, link: '/tutoriels', img: imgBall },
    { title: tr.features_association_title, desc: tr.features_association_desc, link: '/gouvernance', img: imgCommunity },
    { title: tr.nav_shop, desc: tr.discover_shop_desc, link: '/boutique', img: imgThrone },
  ];

  return (
    <section className="bg-muted py-20 md:py-28" aria-labelledby="discover-title">
      <div className="shell">
        <h2 id="discover-title" className="section-title mb-12 text-primary">{tr.discover_title}</h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.li
              key={c.link}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link to={c.link} className="photo-card group flex h-full flex-col overflow-hidden rounded-lg bg-card shadow-sm ring-1 ring-border transition-shadow hover:shadow-lg">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={c.img} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-xl font-black uppercase leading-tight text-primary">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-[hsl(var(--brand-red))]">
                    {lang === 'en' ? 'Explore' : 'Découvrir'}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
