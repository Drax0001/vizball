import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

const TEAM_MEMBERS = [
  {
    name: 'MIAFFO NKENGNI Yannick Joël',
    role: { fr: 'Fondateur & Président du HCV', en: 'Founder & Chairman of the HCV' },
    description: { fr: 'Créateur du Vizball en 2007, il est le visionnaire derrière ce sport innovant né au Cameroun. Membre de droit de l\'Association et du Haut Conseil du Vizball, avec voix prépondérante sur les décisions stratégiques.', en: 'Creator of Vizball in 2007, he is the visionary behind this innovative sport born in Cameroon. An ex officio member of the Association and the High Council of Vizball, with the deciding vote on strategic decisions.' },
    imageUrl: '',
  },
  {
    name: { fr: 'Membre du Bureau', en: 'Board Member' },
    role: { fr: 'Secrétaire Général', en: 'Secretary General' },
    description: { fr: 'Responsable de la coordination administrative et des communications officielles de l\'Association Vizball. Garant du respect des statuts et du bon fonctionnement interne.', en: "Responsible for administrative coordination and official communications of the Vizball Association. Ensures compliance with the bylaws and smooth internal operation." },
    imageUrl: null,
  },
  {
    name: { fr: 'Membre du Bureau', en: 'Board Member' },
    role: { fr: 'Trésorier', en: 'Treasurer' },
    description: { fr: 'En charge de la gestion financière et budgétaire de l\'Association. Assure la transparence des comptes et le suivi des partenariats financiers.', en: "In charge of the Association's financial and budget management. Ensures accounting transparency and follow-up on financial partnerships." },
    imageUrl: null,
  },
  {
    name: { fr: 'Membre du Bureau', en: 'Board Member' },
    role: { fr: 'Responsable Technique', en: 'Technical Director' },
    description: { fr: 'Supervise l\'encadrement sportif, la formation des arbitres et l\'organisation des compétitions officielles sur le territoire national.', en: 'Oversees sporting supervision, referee training, and the organisation of official competitions nationwide.' },
    imageUrl: null,
  },
];

function MemberCard({ member, index, lang }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-col sm:flex-row gap-5 p-6 bg-white/5 border border-white/10 rounded-xl hover:border-accent/30 transition-colors"
    >
      {/* Photo */}
      <div className="shrink-0">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={typeof member.name === 'string' ? member.name : member.name[lang]}
            className="w-24 h-24 rounded-xl object-cover border border-white/10"
          />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
            <Users size={32} className="text-white/20" />
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-xs font-bold uppercase tracking-widest text-accent mb-1">{member.role[lang]}</p>
        <h4 className="font-heading text-xl text-white mb-2">{typeof member.name === 'string' ? member.name : member.name[lang]}</h4>
        <p className="font-body text-sm text-white/50 leading-relaxed">{member.description[lang]}</p>
      </div>
    </motion.div>
  );
}

export default function GouvernanceTeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section className="py-20 bg-primary border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <Users size={14} className="text-accent" />
            <span className="font-body text-xs font-bold uppercase tracking-wider text-accent">{tr.gov_team_badge}</span>
          </div>
          <h2 className="font-heading text-5xl sm:text-6xl text-white leading-none">
            {tr.gov_team_title} <span className="text-[hsl(var(--background))]">{tr.gov_team_title2}</span>
          </h2>
          <p className="font-body text-sm text-white/40 mt-4 max-w-xl leading-relaxed">
            {tr.gov_team_subtitle}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {TEAM_MEMBERS.map((member, i) => (
            <MemberCard key={i} member={member} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}