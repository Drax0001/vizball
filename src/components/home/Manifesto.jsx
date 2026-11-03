import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import Cta from '../site/Cta';
import { ParallaxImage } from '../motion/Reveal';
import playersImage from '../../assets/images/vizball-players-sitting-on-pitch.webp';

// "**word**" marks a keyword that lights up in gold.
function tokenize(text) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ({ w: w.replace(/\*\*/g, ''), hot: w.includes('**') }));
}

function Word({ word, hot, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={`inline-block ${hot ? 'text-accent' : ''}`}>
      {word}
    </motion.span>
  );
}

export default function Manifesto() {
  const { lang } = useLang();
  const tr = t[lang];
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] });
  const words = tokenize(tr.manifesto);

  return (
    <section className="pitch relative overflow-hidden py-28 md:py-44" aria-label={tr.about_badge}>
      <div className="shell grid gap-16 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-end lg:gap-20">
        <p ref={ref} className="display text-[clamp(2.1rem,5.4vw,5.6rem)] leading-[0.95]">
          {words.map((t, i) => (
            <React.Fragment key={i}>
              <Word word={t.w} hot={t.hot} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />{' '}
            </React.Fragment>
          ))}
        </p>

        <div className="flex flex-col gap-8">
          <ParallaxImage
            src={playersImage}
            alt={lang === 'en' ? 'Three Vizball players sitting on the pitch with the balls' : 'Trois joueuses de Vizball assises sur le terrain avec les ballons'}
            className="aspect-[4/5] w-full rounded-[14px]"
          />
          <p className="text-chalk/70 leading-relaxed">{tr.about_desc2}</p>
          <div>
            <Cta to="/le-sport" tone="gold">{tr.about_learn_more}</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
