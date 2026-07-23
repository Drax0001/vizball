import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Scale, Globe, BookOpen, Award, Users, Shield } from 'lucide-react';
import ClubsMap from '../components/association/ClubsMap';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className={className}>
      
      {children}
    </motion.div>);

}

const missions = [
{ icon: Globe, title: { fr: 'Promouvoir le Vizball', en: 'Promote Vizball' }, desc: { fr: 'Assurer la promotion nationale et internationale du Vizball dans toutes ses composantes.', en: 'Ensure the national and international promotion of Vizball in all its aspects.' } },
{ icon: BookOpen, title: { fr: 'Organiser & Administrer', en: 'Organise & Administer' }, desc: { fr: "Encadrer l'organisation des compétitions, formations et événements Vizball.", en: 'Oversee the organisation of Vizball competitions, training and events.' } },
{ icon: Award, title: { fr: 'Protéger la Propriété Intellectuelle', en: 'Protect Intellectual Property' }, desc: { fr: "Garantir la protection de l'intégrité du sport et des droits de propriété intellectuelle du Fondateur.", en: "Guarantee the protection of the sport's integrity and the Founder's intellectual property rights." } },
{ icon: Scale, title: { fr: 'Bonne Gouvernance', en: 'Good Governance' }, desc: { fr: "Assurer la transparence, la bonne gouvernance et le cadre normatif via le Haut Conseil du Vizball (HCV).", en: 'Ensure transparency, good governance and the regulatory framework via the High Council of Vizball (HCV).' } },
{ icon: Users, title: { fr: 'Développer la Communauté', en: 'Develop the Community' }, desc: { fr: "Favoriser le développement communautaire, la jeunesse et la participation sportive.", en: 'Foster community development, youth engagement and sporting participation.' } },
{ icon: Shield, title: { fr: 'Sécuriser les Partenaires', en: 'Protect Partners' }, desc: { fr: "Garantir un cadre juridique sécurisant pour tous les partenaires et acteurs du Vizball.", en: 'Guarantee a secure legal framework for all Vizball partners and stakeholders.' } }];


const organes = [
{ name: { fr: "L'Assemblée Générale", en: 'The General Assembly' }, desc: { fr: "Organe suprême de délibération de l'Association, composée de l'ensemble des membres.", en: "The Association's supreme deliberative body, made up of all its members." } },
{ name: { fr: 'Le Haut Conseil du Vizball (HCV)', en: 'The High Council of Vizball (HCV)' }, desc: { fr: 'Organe normatif et stratégique garant de la vision et de l\'intégrité du Vizball.', en: "The normative and strategic body safeguarding Vizball's vision and integrity." } },
{ name: { fr: 'Le Bureau Exécutif', en: 'The Executive Board' }, desc: { fr: "Organe de gestion et d'administration courante de l'Association.", en: "The Association's day-to-day management and administration body." } },
{ name: { fr: 'Le Conseil de Discipline', en: 'The Disciplinary Council' }, desc: { fr: "Organe en charge de veiller au respect des statuts et du règlement intérieur.", en: 'The body responsible for ensuring compliance with the bylaws and internal regulations.' } },
{ name: { fr: 'La Commission des Finances', en: 'The Finance Committee' }, desc: { fr: "Organe de contrôle financier et de transparence budgétaire.", en: 'The financial oversight and budgetary transparency body.' } }];


export default function Association() {
  const { lang } = useLang();
  const tr = t[lang];
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <div className="w-full h-full bg-gray-900" />

        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="font-subtitle text-sm uppercase tracking-widest text-accent">{tr.assoc_badge}</span>
              <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl text-white mt-2">
                {tr.assoc_title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Préambule */}
      <section className="py-24 bg-background">
        <div className="text-[hsl(var(--accent))] mx-auto px-4 max-w-4xl sm:px-6 lg:px-8">
          <AnimatedSection>
            <span className="font-subtitle text-sm uppercase tracking-widest text-secondary">{tr.assoc_preamble_badge}</span>
            <h2 className="text-[hsl(var(--accent))] mt-3 mb-8 text-4xl font-heading sm:text-5xl">{tr.assoc_history_title} {tr.assoc_history_title2}</h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                {tr.assoc_history_p1}
              </p>
              <p>{tr.assoc_history_p2}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Missions */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-[hsl(var(--accent))] mt-3 text-5xl font-heading sm:text-6xl">{tr.assoc_objectives_title}</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((m, i) =>
            <AnimatedSection key={i}>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-full hover:border-accent/30 transition-colors">
                  <m.icon size={28} className="text-accent mb-4" />
                  <h3 className="font-heading text-xl text-white mb-2">{m.title[lang]}</h3>
                  <p className="font-body text-sm text-white/60 leading-relaxed">{m.desc[lang]}</p>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

      {/* Organes */}
      <section className="py-24 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <span className="font-subtitle text-sm uppercase tracking-widest text-secondary">{tr.assoc_structure_badge}</span>
            <h2 className="text-[hsl(var(--sidebar-ring))] mt-3 mb-8 text-4xl font-heading sm:text-5xl">{tr.assoc_governance_title} {tr.assoc_governance_title2}</h2>
          </AnimatedSection>

          <div className="space-y-4">
            {organes.map((org, i) =>
            <AnimatedSection key={i}>
                <div className="flex items-start gap-4 p-6 bg-card rounded-lg border border-border">
                  <span className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-heading text-lg">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-body font-bold text-foreground">{org.name[lang]}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">{org.desc[lang]}</p>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

      {/* Clubs & Terrains */}
      <ClubsMap />

      {/* Fondateur */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
























          
        </div>
      </section>
    </div>);

}