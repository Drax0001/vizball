import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Shield, Users, ChevronRight } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

export default function FeatureCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { lang } = useLang();
  const tr = t[lang];

  const features = [
  {
    icon: BookOpen,
    title: tr.features_rules_title,
    desc: tr.features_rules_desc,
    cta: tr.features_rules_cta,
    link: '/le-sport',
    img: ''
  },
  {
    icon: Shield,
    title: tr.features_association_title,
    desc: tr.features_association_desc,
    cta: tr.features_association_cta,
    link: '/association',
    img: ''
  },
  {
    icon: Users,
    title: tr.features_register_title,
    desc: tr.features_register_desc,
    cta: tr.features_register_cta,
    link: '/contact',
    img: ''
  }];


  return (
    <section ref={ref} className="py-24 bg-primary relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16">
          
          <h2 className="text-accent mt-3 text-5xl font-heading sm:text-6xl">
            {tr.features_title_1} {tr.features_title_2}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15 }}>
              <Link to={feature.link} className="group block">
                <div className="relative rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-accent/40 transition-all duration-500">
                  <div className="h-52 overflow-hidden">
                    <div className="w-full h-full bg-gray-900 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
                  </div>
                  <div className="relative p-6">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 -mt-12 relative z-10 border border-accent/30">
                      <feature.icon size={22} className="text-accent" />
                    </div>
                    <h3 className="font-heading text-2xl text-white mb-2">{feature.title}</h3>
                    <p className="font-body text-sm text-white/60 leading-relaxed mb-4">{feature.desc}</p>
                    <span className="inline-flex items-center gap-1 font-body text-xs font-bold uppercase tracking-wider text-accent group-hover:gap-2 transition-all">
                      {feature.cta} <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}