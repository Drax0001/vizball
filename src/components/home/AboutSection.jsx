import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "../../lib/LanguageContext";
import t from "../../lib/translations";
import aboutImage from "../../assets/images/court-vizball.webp";
import sideImage from "../../assets/images/vizball-players-sitting-on-pitch.webp";

export default function AboutSection() {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section className="overflow-hidden bg-card py-20 md:py-28" aria-labelledby="about-title">
      <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative pb-10 pr-10 sm:pb-14 sm:pr-14"
        >
          <img
            src={aboutImage}
            alt={lang === "en" ? "A Vizball player at the backstop, indoors" : "Un joueur de Vizball au butoir, en salle"}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-lg object-cover shadow-xl"
          />
          <img
            src={sideImage}
            alt=""
            loading="lazy"
            className="absolute bottom-0 right-0 w-[42%] rounded-lg border-[6px] border-card object-cover shadow-xl aspect-[3/4]"
          />
          <div className="absolute left-5 top-5 rounded-md bg-accent px-5 py-3 text-primary shadow-lg">
            <span className="block font-heading text-4xl font-black leading-none">2007</span>
            <span className="meta mt-1 block">{tr.about_since}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h2 id="about-title" className="section-title text-primary">
            {tr.about_title_1} <span className="text-[hsl(var(--brand-red))]">{tr.about_title_2}</span>
          </h2>
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>{tr.about_desc1}</p>
            <p>{tr.about_desc2}</p>
          </div>
          <Link to="/le-sport" className="btn btn-green mt-8">
            {tr.about_learn_more}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
