import React from 'react';
import FieldLines from '../field/FieldLines';
import { RevealText } from '../motion/Reveal';

// Sign-in and sign-up frame: the pitch on one side, the form on chalk.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-[100svh] lg:grid-cols-[1.1fr_1fr]">
      <div className="pitch relative isolate flex min-h-[40svh] flex-col justify-end overflow-hidden px-[var(--gutter)] pb-10 pt-32 lg:min-h-0 lg:pb-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 flex items-start justify-center p-[var(--gutter)] pt-28 opacity-35"
          style={{ maskImage: 'linear-gradient(to bottom, #000 35%, transparent 70%)', WebkitMaskImage: 'linear-gradient(to bottom, #000 35%, transparent 70%)' }}
          aria-hidden="true"
        >
          <FieldLines orient="v" draw="mount" delay={0.3} className="h-full w-auto text-chalk" />
        </div>
        <RevealText as="h1" trigger="mount" delay={0.25} text={title} className="display text-[clamp(2.8rem,6.5vw,6rem)]" />
        {subtitle && <p className="mt-4 max-w-md text-lg text-chalk/75">{subtitle}</p>}
      </div>
      <div className="flex items-center justify-center bg-background px-[var(--gutter)] py-14 lg:py-24">
        <div className="w-full max-w-md">
          {children}
          {footer && <div className="mt-8 border-t border-night/15 pt-6 text-night/70">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="label mb-2 block text-night/65">{label}</span>
      {children}
      {hint && <span className="mt-2 block text-sm text-night/55">{hint}</span>}
    </label>
  );
}
