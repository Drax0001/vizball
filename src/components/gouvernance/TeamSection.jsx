import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import { api } from '../../api/client';

function MemberCard({ member, index }) {
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
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-24 h-24 rounded-xl object-cover border border-white/10"
          />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
            <Users size={32} className="text-chalk/20" />
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <p className="font-subtitle text-xs uppercase tracking-widest text-accent mb-1">{member.role}</p>
        <h4 className="font-heading text-xl text-chalk mb-2">{member.name}</h4>
        <p className="font-body text-sm text-chalk/50 leading-relaxed">{member.bio}</p>
      </div>
    </motion.div>
  );
}

export default function GouvernanceTeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { lang } = useLang();
  const tr = t[lang];
  const [members, setMembers] = useState([]);

  useEffect(() => {
    api.teamMembers.list()
      .then(setMembers)
      .catch((err) => console.error('Failed to load team members:', err));
  }, []);

  if (members.length === 0) return null;

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
          <h2 className="display mb-10 text-[clamp(2.4rem,5.5vw,5rem)]">
            {tr.gov_team_title} <span className="text-[hsl(var(--background))]">{tr.gov_team_title2}</span>
          </h2>
          <p className="font-body text-sm text-chalk/40 mt-4 max-w-xl leading-relaxed">
            {tr.gov_team_subtitle}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {members.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
