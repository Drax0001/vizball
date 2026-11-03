import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import { RevealText } from '../motion/Reveal';
import { useMediaQuery } from '@/hooks/use-media-query';
import { EASE_OUT } from '@/lib/motion';
import imgCourt from '../../assets/images/court-vizball.webp';
import imgCommunity from '../../assets/images/community-vizball.webp';
import imgThrone from '../../assets/images/vizball-throne.webp';
import imgBall from '../../assets/images/ball-to-the-leg.webp';
import imgSitting from '../../assets/images/vizball-players-sitting-on-pitch.webp';

// Destinations as a ruled list. On a fine pointer, a photo follows the
// cursor over the hovered row.
export default function Explore() {
  const { lang } = useLang();
  const tr = t[lang];
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [hover, setHover] = useState(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.5 });
  const y = useSpring(my, { stiffness: 180, damping: 22, mass: 0.5 });

  const rows = [
    { title: tr.features_rules_title, desc: tr.explore_rules_d, to: '/le-sport', img: imgCourt },
    { title: tr.nav_tutorials, desc: tr.explore_tuto_d, to: '/tutoriels', img: imgBall },
    { title: tr.features_association_title, desc: tr.explore_gov_d, to: '/gouvernance', img: imgCommunity },
    { title: tr.nav_news, desc: tr.explore_news_d, to: '/actualites', img: imgSitting },
    { title: tr.nav_shop, desc: tr.explore_shop_d, to: '/boutique', img: imgThrone },
    { title: tr.nav_game, desc: tr.explore_game_d, href: 'https://game.vizball.org', img: imgCourt },
  ];

  const onMove = (e) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  return (
    <section className="relative bg-background py-28 text-night md:py-40" aria-labelledby="explore-title" onPointerMove={fine ? onMove : undefined}>
      <div className="shell">
        <RevealText id="explore-title" text={tr.explore_title} className="display text-[clamp(2.6rem,6vw,6rem)]" />

        <ul className="mt-14 border-b border-night/15 md:mt-20" onPointerLeave={() => setHover(null)}>
          {rows.map((r, i) => {
            const external = Boolean(r.href);
            const Arrow = external ? ArrowUpRight : ArrowRight;
            const inner = (
              <>
                <span className="display text-[clamp(2rem,5vw,4.5rem)] transition-transform duration-700 ease-out-expo group-hover:translate-x-4 md:group-hover:translate-x-6">
                  {r.title}
                </span>
                <span className="hidden max-w-xs text-night/65 md:block">{r.desc}</span>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full ring-1 ring-inset ring-night/20 transition-all duration-500 ease-out-expo group-hover:bg-brand-red group-hover:text-chalk group-hover:ring-brand-red md:h-14 md:w-14">
                  <Arrow size={20} className="transition-transform duration-500 ease-out-expo group-hover:-rotate-45" />
                </span>
              </>
            );
            const cls =
              'group relative grid grid-cols-[1fr_auto] items-center gap-6 border-t border-night/15 py-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] md:gap-10 md:py-8';
            return (
              <motion.li
                key={r.title}
                onPointerEnter={() => setHover(i)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.04 }}
              >
                {external ? (
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                ) : (
                  <Link to={r.to} className={cls}>{inner}</Link>
                )}
                <p className="-mt-3 pb-5 text-sm text-night/65 md:hidden">{r.desc}</p>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {fine && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-30 h-64 w-52 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[14px]"
          style={{ x, y }}
          aria-hidden="true"
        >
          <AnimatePresence>
            {hover !== null && (
              <motion.img
                key={hover}
                src={rows[hover].img}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.2 }}
                animate={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }}
                exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.35 } }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
