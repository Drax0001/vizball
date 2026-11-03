import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import FieldLines from '../field/FieldLines';
import { RevealText } from '../motion/Reveal';
import Cta from '../site/Cta';

// The close: a gold field, the duel end of the pitch rising behind the
// question, two actions.
// Keep the field to the right, clear of the headline and copy.
const FADE = 'linear-gradient(to right, transparent 25%, #000 65%)';

export default function CTASection() {
  const { lang } = useLang();
  const tr = t[lang];
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const fieldX = useTransform(scrollYProgress, [0, 1], ['-18%', '0%']);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-accent py-28 text-night md:py-44" aria-labelledby="cta-title">
      <motion.div
        className="pointer-events-none absolute inset-y-0 right-[-30%] -z-10 flex w-[130%] items-center opacity-25 md:right-[-8%] md:w-[90%]"
        style={{ ...(reduce ? {} : { x: fieldX }), maskImage: FADE, WebkitMaskImage: FADE }}
        aria-hidden="true"
      >
        <FieldLines className="w-full text-night" strokeWidth={0.1} />
      </motion.div>

      <div className="shell">
        <RevealText
          id="cta-title"
          text={`${tr.cta_title_1} ${tr.cta_title_2}`}
          className="display max-w-[12ch] text-[clamp(3.5rem,11vw,11rem)]"
        />
        <div className="mt-10 flex flex-col gap-10 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg leading-snug text-night/80 md:text-xl">{tr.cta_desc}</p>
          <div className="flex flex-wrap gap-3">
            <Cta to="/gouvernance" tone="ghostDark">{tr.cta_association}</Cta>
            <Cta to="/contact" tone="night" size="lg">{tr.cta_contact}</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
