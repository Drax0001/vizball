import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FieldLines from '../field/FieldLines';
import { RevealText, ParallaxImage } from '../motion/Reveal';
import { EASE_OUT } from '@/lib/motion';

// Each page stands on the same full pitch; `crop` picks which scoring zone
// is lit so pages read as different positions on one field.
const ZONES = { circle: [], duel: ['z3'], full: ['z1'] };
// Fade the field out before it reaches the title so type never sits on lines.
const FADE = 'linear-gradient(to bottom, #000 65%, transparent 100%)';

// Inner-page header: night pitch, a cropped field drawing itself, the page
// title at display scale, an optional photo and actions.
export default function PageHero({
  title,
  accent = [],
  subtitle,
  image,
  imageAlt = '',
  crop = 'circle',
  children,
  className = '',
}) {
  const reduce = useReducedMotion();
  return (
    <section className={`pitch relative isolate overflow-hidden ${className}`}>
      {/* The field sits in a band above the title, and beside the photo when
          there is one, so no type or image ever covers its lines. */}
      <div
        className={`pointer-events-none absolute inset-x-[var(--gutter)] top-24 -z-10 h-[26svh] opacity-40 md:top-28 ${image ? 'lg:right-[calc(var(--gutter)+26rem)]' : ''}`}
        style={{ maskImage: FADE, WebkitMaskImage: FADE }}
        aria-hidden="true"
      >
        <FieldLines
          draw="mount"
          delay={0.3}
          duration={2}
          zoneTint
          highlight={ZONES[crop] || []}
          preserveAspectRatio="xMinYMin meet"
          className="h-full w-full text-chalk"
          strokeWidth={0.06}
        />
      </div>

      <div className="shell flex min-h-[64svh] flex-col justify-end pb-14 pt-32 md:min-h-[70svh] md:pb-20 md:pt-40">
        <div className={`grid items-end gap-10 ${image ? 'lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16' : ''}`}>
          <div>
            <RevealText
              as="h1"
              trigger="mount"
              delay={0.25}
              text={title}
              accent={accent}
              className="display text-[clamp(3rem,9.5vw,9rem)]"
            />
            {subtitle && (
              <motion.p
                className="mt-6 max-w-2xl text-lg leading-snug text-chalk/75 md:mt-8 md:text-xl"
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE_OUT, delay: 0.6 }}
              >
                {subtitle}
              </motion.p>
            )}
            {children && (
              <motion.div
                className="mt-8 flex flex-wrap items-center gap-3"
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE_OUT, delay: 0.75 }}
              >
                {children}
              </motion.div>
            )}
          </div>
          {image && (
            <ParallaxImage
              src={image}
              alt={imageAlt}
              loading="eager"
              className="hidden aspect-[4/5] w-full rounded-[14px] lg:block"
            />
          )}
        </div>
      </div>
    </section>
  );
}

// Section heading used across inner pages: display type with a rising
// reveal, optional lead paragraph. No eyebrow labels.
export function SectionHead({ title, accent = [], lead, tone = 'light', className = '', as = 'h2' }) {
  const leadTone = tone === 'dark' ? 'text-chalk/70' : 'text-night/70';
  return (
    <div className={`mb-12 md:mb-16 ${className}`}>
      <RevealText as={as} text={title} accent={accent} className="display text-[clamp(2.4rem,5.5vw,5rem)]" />
      {lead && <p className={`mt-5 max-w-2xl text-lg leading-relaxed ${leadTone}`}>{lead}</p>}
    </div>
  );
}
