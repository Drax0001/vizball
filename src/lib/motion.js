// Shared motion vocabulary: one set of curves and durations for the whole site.
export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT = [0.76, 0, 0.24, 1];

export const DUR = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
  draw: 1.6,
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
