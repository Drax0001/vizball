import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import { RevealText } from '../motion/Reveal';
import { EASE_OUT } from '@/lib/motion';

// The founding facts set as a referee's match sheet: ruled rows, the value
// large, the key and its note small.
export default function MatchSheet() {
  const { lang } = useLang();
  const tr = t[lang];
  const rows = [
    { k: tr.sheet_1_k, v: '2007', n: tr.sheet_1_n },
    { k: tr.sheet_2_k, v: "4 × 15'", n: tr.sheet_2_n },
    { k: tr.sheet_3_k, v: '48 × 24', n: tr.sheet_3_n },
    { k: tr.sheet_4_k, v: '12', n: tr.sheet_4_n },
    { k: tr.sheet_5_k, v: '4 v 5', n: tr.sheet_5_n },
    { k: tr.sheet_6_k, v: tr.sheet_6_v, n: tr.sheet_6_n },
  ];

  return (
    <section className="bg-background py-28 text-night md:py-40" aria-labelledby="sheet-title">
      <div className="shell">
        <RevealText id="sheet-title" text={tr.sheet_title} className="display text-[clamp(2.6rem,6vw,6rem)]" />

        <dl className="mt-14 border-b border-night/15 md:mt-20">
          {rows.map((r, i) => (
            <motion.div
              key={r.k}
              className="group relative grid grid-cols-1 items-baseline gap-y-2 border-t border-night/15 py-6 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_minmax(0,20rem)] md:gap-x-10 md:py-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: (i % 3) * 0.06 }}
            >
              <span
                className="absolute inset-x-0 top-[-1px] h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                aria-hidden="true"
              />
              <dt className="label text-night/55">{r.k}</dt>
              <dd className="display tabular text-[clamp(3rem,8.5vw,7.5rem)] text-pitch transition-colors duration-500 group-hover:text-accent">
                {r.v}
              </dd>
              <dd className="max-w-sm text-sm leading-snug text-night/70 md:text-base">{r.n}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
