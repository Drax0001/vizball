import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserCircle2 } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}>
      {children}
    </motion.div>);

}

const teamMembers = [
{
  name: 'MIAFFO NKENGNI Yannick Joël',
  role: { fr: 'Fondateur & Président du HCV', en: 'Founder & Chairman of the HCV' },
  photo: '',
  desc: { fr: 'Créateur du Vizball en 2007, Yannick Joël est le visionnaire fondateur du sport. Il préside le Haut Conseil du Vizball et détient les droits de propriété intellectuelle perpétuels sur le sport.', en: 'Creator of Vizball in 2007, Yannick Joël is the founding visionary of the sport. He chairs the High Council of Vizball and holds perpetual intellectual property rights over the sport.' }
},
{
  name: { fr: 'Membre du Bureau Exécutif', en: 'Executive Board Member' },
  role: { fr: 'Secrétaire Général', en: 'Secretary General' },
  photo: '',
  desc: { fr: 'Responsable de l\'administration courante de l\'Association, de la coordination entre les organes et de la communication officielle.', en: "Responsible for the Association's day-to-day administration, coordination between bodies, and official communications." }
},
{
  name: { fr: 'Membre du Bureau Exécutif', en: 'Executive Board Member' },
  role: { fr: 'Trésorier Général', en: 'General Treasurer' },
  photo: '',
  desc: { fr: 'Garant de la transparence financière de l\'Association, chargé de la gestion budgétaire et des relations avec la Commission des Finances.', en: "Guarantor of the Association's financial transparency, responsible for budget management and relations with the Finance Committee." }
},
{
  name: { fr: 'Membre du Bureau Exécutif', en: 'Executive Board Member' },
  role: { fr: 'Responsable Technique', en: 'Technical Director' },
  photo: '',
  desc: { fr: 'En charge du développement sportif, de la formation des arbitres et des entraîneurs, et de l\'organisation des compétitions officielles.', en: 'In charge of sporting development, referee and coach training, and the organisation of official competitions.' }
}];


function MemberCard({ member, index, lang, tr }) {
  return (
    <AnimatedSection delay={index * 0.1}>
      <div className="flex flex-col sm:flex-row gap-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300 group">
        {/* Photo */}
        <div className="sm:w-48 shrink-0 aspect-square sm:aspect-auto sm:h-auto bg-white/5 relative overflow-hidden">
          {member.photo ?
          <img
            src={member.photo}
            alt={typeof member.name === 'string' ? member.name : member.name[lang]}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" /> :


          <div className="w-full h-full min-h-[180px] flex flex-col items-center justify-center gap-2 bg-accent/5">
              <UserCircle2 size={48} className="text-white/20" />
              <span className="font-body text-xs text-white/20 uppercase tracking-wider">{tr.team_photo_soon}</span>
            </div>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-transparent" />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center p-6 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
            <span className="font-body text-xs font-bold uppercase tracking-widest text-accent">{member.role[lang]}</span>
          </div>
          <h3 className="font-heading text-2xl text-white mb-3 leading-tight">{typeof member.name === 'string' ? member.name : member.name[lang]}</h3>
          <p className="font-body text-sm text-white/60 leading-relaxed">{member.desc[lang]}</p>
        </div>
      </div>
    </AnimatedSection>);

}

export default function TeamSection() {
  const { lang } = useLang();
  const tr = t[lang];
  return (
    <section className="py-24 bg-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="mb-14">
          <span className="font-body text-sm font-bold uppercase tracking-widest text-secondary">{tr.team_badge}</span>
          <h2 className="font-heading text-5xl sm:text-6xl mt-3 text-[hsl(var(--accent))]">{tr.team_title}</h2>

          <p className="font-body text-sm text-white/50 mt-4 max-w-xl leading-relaxed">
            {tr.team_subtitle}
          </p>
        </AnimatedSection>

        {/* Members */}
        <div className="space-y-6">
          {teamMembers.map((member, i) =>
          <MemberCard key={i} member={member} index={i} lang={lang} tr={tr} />
          )}
        </div>
      </div>
    </section>);

}