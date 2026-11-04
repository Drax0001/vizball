import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import heroThrone from '../../assets/images/vizball-throne.webp';
import heroBallToLeg from '../../assets/images/ball-to-the-leg.webp';
import heroCommunity from '../../assets/images/community-vizball.webp';

const SLIDE_MS = 7000;

const HERO_SLIDES = [
  {
    label: (tr) => tr.hero_badge,
    title: () => 'VIZBALL',
    subtitle: (tr) => tr.hero_subtitle,
    image: heroThrone,
    position: 'center 30%',
  },
  {
    label: (tr) => tr.hero_slide2_badge,
    title: (tr) => tr.hero_slide2_title,
    subtitle: (tr) => tr.hero_slide2_subtitle,
    image: heroBallToLeg,
    position: 'center 60%',
  },
  {
    label: (tr) => tr.hero_slide3_badge,
    title: (tr) => tr.hero_slide3_title,
    subtitle: (tr) => tr.hero_slide3_subtitle,
    image: heroCommunity,
    position: 'center 40%',
  },
];

export default function HeroSection() {
  const { lang } = useLang();
  const tr = t[lang];
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const running = !reduce && !paused && !hovered;

  const go = useCallback((i) => setCurrent((i + HERO_SLIDES.length) % HERO_SLIDES.length), []);

  useEffect(() => {
    if (!running) return undefined;
    const timer = setTimeout(() => go(current + 1), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [current, running, go]);

  const slide = HERO_SLIDES[current];

  return (
    <section
      className="relative isolate h-[100svh] min-h-[620px] max-h-[980px] overflow-hidden bg-primary"
      aria-roledescription="carousel"
      aria-label="Vizball"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(current - 1);
        if (e.key === 'ArrowRight') go(current + 1);
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        >
          <motion.img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: slide.position }}
            initial={{ scale: reduce ? 1 : 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: SLIDE_MS / 1000 + 1, ease: 'easeOut' }}
          />
        </motion.div>
      </AnimatePresence>
      {/* Legibility: a dark band from the left and from the bottom, over the photo only */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/90 via-primary/45 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary via-primary/20 to-transparent" />

      <div className="shell flex h-full flex-col justify-end pb-8 pt-[132px] md:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
            aria-live={running ? 'off' : 'polite'}
          >
            <h1 className="font-heading text-[clamp(3.5rem,10vw,8.5rem)] font-black uppercase leading-[0.88] tracking-tight text-white">
              {slide.title(tr)}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">{slide.subtitle(tr)}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/le-sport" className="btn btn-gold">
                {tr.hero_cta_discover}
                <ChevronRight size={18} />
              </Link>
              <Link to="/tutoriels" className="btn btn-outline-light">
                {tr.nav_tutorials}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide tabs with progress, arrows and pause */}
        <div className="mt-10 flex items-end gap-4 border-t border-white/20 pt-5 md:mt-14">
          <ol className="grid flex-1 grid-cols-3 gap-3 sm:gap-6">
            {HERO_SLIDES.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === current ? 'true' : undefined}
                  className="group block w-full text-left"
                >
                  <span className="relative block h-[3px] overflow-hidden rounded bg-white/25">
                    {i === current && (
                      <motion.span
                        key={`${current}-${running}`}
                        className="absolute inset-y-0 left-0 bg-accent"
                        initial={{ width: running ? '0%' : '100%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: running ? SLIDE_MS / 1000 : 0, ease: 'linear' }}
                      />
                    )}
                    {i < current && <span className="absolute inset-0 bg-white/60" />}
                  </span>
                  <span
                    className={`meta mt-3 hidden truncate transition-colors sm:block ${
                      i === current ? 'text-accent' : 'text-white/60 group-hover:text-white'
                    }`}
                  >
                    {s.label(tr)}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? tr.hero_play : tr.hero_pause}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-accent hover:text-accent"
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              type="button"
              onClick={() => go(current - 1)}
              aria-label={tr.hero_prev}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              aria-label={tr.hero_next}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
