import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

// The sport's real founding numbers, as a federation-style figures strip.
export default function FactsBar() {
  const { lang } = useLang();
  const tr = t[lang];
  const facts = [
    { v: '2007', l: tr.facts_1_l },
    { v: "4 × 15'", l: tr.facts_2_l },
    { v: '48 × 24', l: tr.facts_3_l },
    { v: '12', l: tr.facts_4_l },
    { v: '4 v 5', l: tr.facts_5_l },
  ];

  return (
    <section aria-label={tr.facts_label} className="bg-accent text-primary">
      <ul className="shell grid grid-cols-2 gap-y-6 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-primary/20 lg:py-10">
        {facts.map((f, i) => (
          <motion.li
            key={f.v}
            className="px-2 text-center lg:px-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <span className="block font-heading text-4xl font-black tabular-nums leading-none sm:text-5xl">{f.v}</span>
            <span className="meta mt-2 block text-primary/75">{f.l}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
