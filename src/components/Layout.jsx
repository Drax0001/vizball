import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import Loader from './motion/Loader';
import Tricolour from './site/Tricolour';
import { SmoothScroll, useLenis, scrollToTop } from './motion/SmoothScroll';
import { EASE_IN_OUT } from '@/lib/motion';

// Route change: a night-green sheet rises over the old page, the scroll
// resets underneath it, then the sheet lifts off the new page.
const sheetIn = {
  initial: { scaleY: 1 },
  enter: { scaleY: 0, transition: { duration: 0.8, ease: EASE_IN_OUT, delay: 0.05 } },
  exit: { scaleY: 0 },
};
const sheetOut = {
  initial: { scaleY: 0 },
  enter: { scaleY: 0 },
  exit: { scaleY: 1, transition: { duration: 0.6, ease: EASE_IN_OUT } },
};
const pageMotion = {
  initial: { y: 80 },
  enter: { y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 } },
  exit: { y: -60, transition: { duration: 0.6, ease: EASE_IN_OUT } },
};

function Frame() {
  const location = useLocation();
  const outlet = useOutlet();
  const lenis = useLenis();

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => scrollToTop(lenis)}>
      <motion.main id="main" key={location.pathname} initial="initial" animate="enter" exit="exit">
        <motion.div variants={pageMotion}>{outlet}</motion.div>
        <motion.div
          aria-hidden="true"
          variants={sheetIn}
          style={{ originY: 0 }}
          className="pointer-events-none fixed inset-0 z-[150] flex flex-col justify-end bg-night"
        >
          <Tricolour className="h-1.5" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          variants={sheetOut}
          style={{ originY: 1 }}
          className="pointer-events-none fixed inset-0 z-[150] bg-night"
        >
          <Tricolour className="h-1.5" />
        </motion.div>
      </motion.main>
    </AnimatePresence>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll enabled={!isAdmin}>
        <Loader />
        <div className="min-h-screen bg-background font-body">
          <Navbar />
          <Frame />
          <Footer />
        </div>
      </SmoothScroll>
    </MotionConfig>
  );
}
