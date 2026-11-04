import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import posterFr from '../../assets/images/vizball-on-arrive-fr.webp';
import posterEn from '../../assets/images/vizball-we-are-coming-en.webp';

// Campaign poster ("On arrive…" / "We are coming…"), shown in the visitor's language.
const POSTERS = {
  fr: { src: posterFr, alt: 'On arrive… Un joueur de Vizball en extension devant une tribune aux couleurs du Cameroun' },
  en: { src: posterEn, alt: 'We are coming… A Vizball player at full stretch in front of a stand in Cameroon colours' },
};

export default function AnnouncementPoster() {
  const { lang } = useLang();
  const poster = POSTERS[lang] || POSTERS.fr;

  return (
    <section className="bg-background py-14 md:py-20">
      <motion.div
        className="shell"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={poster.src}
          alt={poster.alt}
          loading="lazy"
          width="1920"
          height="1440"
          className="mx-auto w-full max-w-5xl rounded-lg shadow-2xl ring-1 ring-black/5"
        />
      </motion.div>
    </section>
  );
}
