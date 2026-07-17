import React from 'react';
import { MessageCircle, Pin, Lock, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useLang } from '../../lib/LanguageContext';
import { getDateLocale } from '../../lib/dateLocale';
import t from '../../lib/translations';

const categoryColors = {
  'Tactiques': 'bg-secondary/20 text-secondary border-secondary/30',
  'Règles': 'bg-accent/20 text-accent border-accent/30',
  'Rencontres': 'bg-white/10 text-white/80 border-white/20',
  'Général': 'bg-accent/15 text-accent/80 border-accent/20',
  'Équipement': 'bg-white/10 text-white/60 border-white/15'
};

export default function TopicRow({ topic, onClick, index }) {
  const { lang } = useLang();
  const tr = t[lang];
  const dateLocale = getDateLocale(lang);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
      <button onClick={() => onClick(topic)}
      className="w-full text-left bg-white/5 border border-white/10 rounded-xl p-5 hover:border-accent/40 hover:bg-white/8 transition-all duration-300 group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[hsl(var(--brand-red))] text-[hsl(var(--background))] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full border border-secondary/30">
                {topic.category}
              </span>
              {topic.pinned && <Pin size={12} className="text-accent" />}
              {topic.closed && <Lock size={12} className="text-white/30" />}
              {topic.city &&
              <span className="flex items-center gap-1 text-white/30 text-xs font-body">
                  <MapPin size={11} /> {topic.city}
                </span>
              }
            </div>
            <h3 className="font-heading text-xl text-white group-hover:text-accent transition-colors leading-tight mb-1">
              {topic.title}
            </h3>
            <p className="font-body text-xs text-white/40">
              {tr.forum_by} <span className="text-white/60">{topic.author_name || tr.forum_anonymous}</span>
              {' · '}
              {format(new Date(topic.created_date), 'd MMM yyyy', { locale: dateLocale })}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center hidden sm:block">
              <div className="flex items-center gap-1.5 text-white/40">
                <MessageCircle size={14} className="text-accent/60" />
                <span className="font-body text-sm font-bold text-white/60">{topic.reply_count || 0}</span>
              </div>
              <p className="font-body text-xs text-white/20">{tr.forum_replies}</p>
            </div>
            <ChevronRight size={16} className="text-white/20 group-hover:text-accent transition-colors" />
          </div>
        </div>
      </button>
    </motion.div>);

}