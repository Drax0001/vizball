import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import { useMediaQuery } from '@/hooks/use-media-query';
import galleryThrone from '../../assets/images/vizball-throne.webp';
import galleryCourt from '../../assets/images/court-vizball.webp';
import galleryCommunity from '../../assets/images/community-vizball.webp';
import galleryBallToLeg from '../../assets/images/ball-to-the-leg.webp';
import gallerySitting from '../../assets/images/vizball-players-sitting-on-pitch.webp';

const FRAMES = [
  { src: galleryThrone, cap: 'gallery_cap_1', size: 'h-[62vh] aspect-[4/5]', offset: 'self-end' },
  { src: galleryCourt, cap: 'gallery_cap_2', size: 'h-[48vh] aspect-[4/3]', offset: 'self-start' },
  { src: gallerySitting, cap: 'gallery_cap_3', size: 'h-[56vh] aspect-[3/4]', offset: 'self-center' },
  { src: galleryBallToLeg, cap: 'gallery_cap_4', size: 'h-[44vh] aspect-[3/4]', offset: 'self-end' },
  { src: galleryCommunity, cap: 'gallery_cap_5', size: 'h-[58vh] aspect-[4/3]', offset: 'self-start' },
];

function Frame({ frame, tr, progress, index }) {
  const reduce = useReducedMotion();
  const drift = useTransform(progress, [0, 1], [`${-6 - index * 2}%`, `${6 + index * 2}%`]);
  return (
    <figure className={`group relative shrink-0 ${frame.offset}`}>
      <div className={`relative overflow-hidden rounded-[14px] ${frame.size}`}>
        <motion.img
          src={frame.src}
          alt={tr[frame.cap]}
          loading="lazy"
          decoding="async"
          style={reduce ? undefined : { x: drift, scale: 1.18 }}
          className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 group-hover:saturate-[1.15]"
        />
      </div>
      <figcaption className="mt-3 flex items-baseline gap-3 text-chalk/70">
        <span className="h-1.5 w-1.5 shrink-0 translate-y-[-0.15em] rounded-full bg-accent" aria-hidden="true" />
        <span className="font-heading font-bold">{tr[frame.cap]}</span>
      </figcaption>
    </figure>
  );
}

export default function GallerySection() {
  const { lang } = useLang();
  const tr = t[lang];
  const wide = useMediaQuery('(min-width: 768px)');
  const section = useRef(null);
  const track = useRef(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    if (!wide || !track.current) return undefined;
    const measure = () => setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [wide]);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  const allLink = (
    <Link
      to="/media"
      className="group flex aspect-square h-[40vh] max-h-80 shrink-0 flex-col justify-between self-center rounded-full bg-brand-red p-10 text-chalk transition-colors duration-500 hover:bg-accent hover:text-night md:h-[44vh] md:max-h-none"
    >
      <ArrowRight className="h-10 w-10 self-end transition-transform duration-500 ease-out-expo group-hover:-rotate-45" strokeWidth={2.2} />
      <span className="display text-[clamp(1.6rem,2.6vw,2.6rem)]">{tr.gallery_view_all}</span>
    </Link>
  );

  if (!wide) {
    return (
      <section className="pitch py-24" aria-labelledby="gallery-title">
        <div className="shell">
          <h2 id="gallery-title" className="display text-[clamp(2.6rem,12vw,4rem)]">{tr.gallery_h}</h2>
        </div>
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none]" data-lenis-prevent>
          {FRAMES.map((f, i) => (
            <figure key={f.cap} className="w-[78vw] shrink-0 snap-start">
              <img src={f.src} alt={tr[f.cap]} loading="lazy" className="aspect-[4/5] w-full rounded-[14px] object-cover" />
              <figcaption className="mt-3 flex items-baseline gap-3 text-chalk/70">
                <span className="h-1.5 w-1.5 shrink-0 translate-y-[-0.15em] rounded-full bg-accent" aria-hidden="true" />
                <span className="font-heading font-bold">{tr[f.cap]}</span>
              </figcaption>
            </figure>
          ))}
          <div className="flex shrink-0 snap-start items-center pr-[var(--gutter)]">{allLink}</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className="pitch relative" style={{ height: `calc(100vh + ${distance}px)` }} aria-labelledby="gallery-title">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex h-[78vh] items-stretch gap-[4vw] pl-[var(--gutter)] pr-[8vw]">
          <div className="flex w-[34vw] shrink-0 flex-col justify-between py-4">
            <h2 id="gallery-title" className="display text-[clamp(3rem,8vw,8rem)]">
              {tr.gallery_h.split(' ').map((w, i, all) => (
                <span key={i} className={`block ${i === all.length - 1 ? 'text-accent' : ''}`}>{w}</span>
              ))}
            </h2>
            <p className="max-w-xs text-chalk/60">{tr.cta_desc}</p>
          </div>
          {FRAMES.map((f, i) => (
            <Frame key={f.cap} frame={f} tr={tr} progress={scrollYProgress} index={i} />
          ))}
          {allLink}
        </motion.div>
      </div>
    </section>
  );
}
