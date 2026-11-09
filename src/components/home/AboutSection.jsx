import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "../../lib/LanguageContext";
import t from "../../lib/translations";
import aboutImage from "../../assets/images/vizball-2007-naissance.webp";

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
          className="relative pb-4 pl-4"
        >
          <img
            src={aboutImage}
            alt={lang === "en" ? "Two Vizball players standing on a giant 2007 above Yaoundé" : "Deux joueurs de Vizball debout sur un 2007 géant au-dessus de Yaoundé"}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-lg object-cover shadow-xl"
          />
          <div className="absolute bottom-0 left-0 rounded-lg bg-primary p-5 text-white shadow-lg">
            <span className="block font-heading text-3xl leading-none text-accent">2007</span>
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
