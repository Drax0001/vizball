import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { prefersReducedMotion } from '@/lib/motion';

const LenisContext = createContext(null);

// Inertial page scroll. Native scroll position is still the source of truth,
// so framer-motion's useScroll and position: sticky keep working.
export function SmoothScroll({ enabled = true, children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return undefined;
    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: true,
      anchors: { offset: -96 },
      prevent: (node) =>
        Boolean(
          node.closest?.(
            '[role="dialog"], [data-radix-scroll-area-viewport], [data-radix-select-viewport], .leaflet-container, .ql-editor'
          )
        ),
    });
    setLenis(instance);
    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, [enabled]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export const useLenis = () => useContext(LenisContext);

export function scrollToTop(lenis) {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}
