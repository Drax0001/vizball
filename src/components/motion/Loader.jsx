import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FieldLines from '../field/FieldLines';
import { markIntroReady } from './intro';
import { EASE_IN_OUT, EASE_OUT, prefersReducedMotion } from '@/lib/motion';

const SESSION_KEY = 'vizball_intro_played';

// First-visit intro: a gold field floods the screen, the pitch draws itself
// in night green with the founding year counting up, then the sheet lifts
// away to reveal the page. Once per session; skipped under reduced motion.
export default function Loader({ onDone }) {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined' || prefersReducedMotion()) return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const [year, setYear] = useState(1990);

  useEffect(() => {
    if (!show) {
      markIntroReady();
      onDone?.();
      return undefined;
    }
    document.documentElement.style.overflow = 'hidden';
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1300);
      const eased = 1 - Math.pow(1 - t, 4);
      setYear(Math.round(1990 + (2007 - 1990) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* private mode: replay next time, harmless */
      }
      setShow(false);
      markIntroReady();
    }, 1900);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [show]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = '';
        onDone?.();
      }}
    >
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-brand-red text-chalk"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.9, ease: EASE_IN_OUT }}
          role="status"
          aria-label="Vizball"
        >
          <motion.div
            className="w-[min(78vw,720px)]"
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_IN_OUT }}
          >
            <FieldLines draw="mount" duration={1.1} strokeWidth={0.12} className="w-full text-chalk" />
          </motion.div>
          <motion.div
            className="mt-8 flex items-baseline gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 }}
          >
            <span className="display text-5xl sm:text-7xl tabular">{year}</span>
            <span className="label">Cameroun</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
