import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import posterFr from '../../assets/images/dodging-in-vizball-fr.webp';
import posterEn from '../../assets/images/dodging-in-vizball-en.webp';

// "Dodging in Vizball" poster ("On arrive…" / "We are coming…"), in the visitor's language.
const POSTERS = {
  fr: { src: posterFr, alt: "L'esquive au Vizball : « On arrive… », un joueur en extension esquive la balle devant une tribune aux couleurs du Cameroun" },
  en: { src: posterEn, alt: 'Dodging in Vizball: "We are coming…", a player at full stretch dodges the ball in front of a stand in Cameroon colours' },
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
