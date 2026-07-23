import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserCircle2 } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import { api } from '../../api/client';

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

function MemberCard({ member, index, tr }) {
  return (
    <AnimatedSection delay={index * 0.1}>
      <div className="flex flex-col sm:flex-row gap-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300 group">
        {/* Photo */}
        <div className="sm:w-48 shrink-0 aspect-square sm:aspect-auto sm:h-auto bg-white/5 relative overflow-hidden">
          {member.photo ?
          <img
            src={member.photo}
            alt={member.name}
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
            <span className="font-subtitle text-xs uppercase tracking-widest text-accent">{member.role}</span>
          </div>
          <h3 className="font-heading text-2xl text-white mb-3 leading-tight">{member.name}</h3>
          <p className="font-body text-sm text-white/60 leading-relaxed">{member.bio}</p>
        </div>
      </div>
    </AnimatedSection>);

}

export default function TeamSection() {
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
    <section className="py-24 bg-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="mb-14">
          <span className="font-subtitle text-sm uppercase tracking-widest text-secondary">{tr.team_badge}</span>
          <h2 className="font-heading text-5xl sm:text-6xl mt-3 text-[hsl(var(--accent))]">{tr.team_title}</h2>

          <p className="font-body text-sm text-white/50 mt-4 max-w-xl leading-relaxed">
            {tr.team_subtitle}
          </p>
        </AnimatedSection>

        {/* Members */}
        <div className="space-y-6">
          {members.map((member, i) =>
          <MemberCard key={member.id} member={member} index={i} tr={tr} />
          )}
        </div>
      </div>
    </section>);

}
