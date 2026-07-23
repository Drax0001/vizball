import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Users, Target, Trophy } from "lucide-react";
import { useLang } from "../../lib/LanguageContext";
import t from "../../lib/translations";

function renderBold(text) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-foreground">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLang();
  const tr = t[lang];

  const stats = [
    { icon: Users, value: "10", label: tr.about_stat_players },
    { icon: Target, value: "4", label: tr.about_stat_zones },
    { icon: Trophy, value: "3", label: tr.about_stat_half },
  ];

  return (
    <section ref={ref} className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-lg overflow-hidden">
              <div className="w-full h-[500px] bg-gray-900" />

              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-accent text-primary p-6 rounded-lg shadow-xl">
              <span className="font-heading text-5xl">2007</span>
              <p className="font-body text-xs font-bold uppercase tracking-wider mt-1">
                {tr.about_since}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-subtitle text-sm uppercase tracking-widest text-secondary">
              {tr.about_badge}
            </span>
            <h2 className="text-[hsl(var(--chart-3))] mt-3 mb-6 text-5xl font-heading sm:text-6xl">
              {tr.about_title_1}{" "}
              <span className="text-[hsl(var(--accent))]">
                {tr.about_title_2}
              </span>
            </h2>

            {/* Fiche de présentation */}
            <div className="bg-muted rounded-xl p-5 mb-8 border border-border space-y-2">
              {[
                tr.about_fact_1,
                tr.about_fact_2,
                tr.about_fact_3,
                tr.about_fact_4,
                tr.about_fact_5,
                tr.about_fact_6,
                tr.about_fact_7,
              ].map((fact, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-0.5">—</span>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {renderBold(fact)}
                  </p>
                </div>
              ))}
              {/* <p className="font-body text-xs font-bold uppercase tracking-wider text-accent pt-2 border-t border-border mt-2">
                {tr.about_author}
              </p> */}
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-center"
                  >
                    <Icon size={22} className="text-accent mx-auto mb-2" />
                    <span className="font-heading text-3xl text-foreground block">
                      {stat.value}
                    </span>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      {stat.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <Link
              to="/le-sport"
              className="group inline-flex items-center gap-2 font-body font-bold text-sm uppercase tracking-wider text-accent hover:text-secondary transition-colors"
            >
              {tr.about_learn_more}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
