import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

const HERO_SLIDES = [
  {
    badge: tr => tr.hero_badge,
    title: () => 'VIZBALL',
    subtitle: tr => tr.hero_subtitle,
    ctaDiscover: tr => tr.hero_cta_discover,
    ctaRules: tr => tr.hero_cta_rules
  },
  {
    badge: tr => tr.hero_slide2_badge,
    title: tr => tr.hero_slide2_title,
    subtitle: tr => tr.hero_slide2_subtitle,
    ctaDiscover: tr => tr.hero_cta_discover,
    ctaRules: tr => tr.hero_cta_rules
  },
  {
    badge: tr => tr.hero_slide3_badge,
    title: tr => tr.hero_slide3_title,
    subtitle: tr => tr.hero_slide3_subtitle,
    ctaDiscover: tr => tr.hero_cta_discover,
    ctaRules: tr => tr.hero_cta_rules
  }
];

export default function HeroSection() {
  const { lang } = useLang();
  const tr = t[lang];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.03),transparent_50%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/10 font-heading text-9xl md:text-[12rem] font-bold tracking-wider">
                  IMAGE
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/30" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 50 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="max-w-2xl">

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
                <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent">
                  {slide.badge(tr)}
                </span>
              </motion.div>

              <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-none mb-6">
                {slide.title(tr)}
              </h1>

              <p className="font-body text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-lg">
                {slide.subtitle(tr)}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/le-sport"
                  className="group inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider px-8 py-4 rounded transition-all duration-300">
                  {slide.ctaDiscover(tr)}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/le-sport"
                  className="group inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-accent text-white hover:text-accent font-body font-bold text-sm uppercase tracking-wider px-8 py-4 rounded transition-all duration-300">
                  <Play size={16} />
                  {slide.ctaRules(tr)}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute inset-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-accent hover:bg-accent/10 text-white/60 hover:text-accent flex items-center justify-center transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-accent hover:bg-accent/10 text-white/60 hover:text-accent flex items-center justify-center transition-all duration-300"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide ? 'w-8 h-2 bg-accent' : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
        </motion.div>
      </motion.div>
    </section>);

}