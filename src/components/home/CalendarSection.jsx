import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronRight, Trophy, Swords, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useLang } from '../../lib/LanguageContext';
import { getDateLocale } from '../../lib/dateLocale';
import t from '../../lib/translations';
import { api } from '../../api/client';

const TYPE_CONFIG = {
  'Rencontre': { icon: Swords, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: { fr: 'Rencontre', en: 'Match' } },
  'Tournoi': { icon: Trophy, color: 'bg-accent/10 text-accent border-accent/20', label: { fr: 'Tournoi', en: 'Tournament' } },
  'Entraînement': { icon: Dumbbell, color: 'bg-secondary/10 text-secondary border-secondary/20', label: { fr: 'Entraînement', en: 'Training' } },
  'Autre': { icon: Calendar, color: 'bg-white/10 text-white/60 border-white/10', label: { fr: 'Autre', en: 'Other' } }
};

function EventCard({ event, index, lang, dateLocale, tr }) {
  const config = TYPE_CONFIG[event.type] || TYPE_CONFIG['Autre'];
  const Icon = config.icon;
  const dateObj = event.date ? parseISO(event.date) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex gap-5 p-5 bg-white/5 border border-white/10 rounded-xl hover:border-accent/30 hover:bg-white/8 transition-all duration-300 group">
      
      {/* Date bloc */}
      {dateObj &&
      <div className="shrink-0 w-14 h-14 bg-accent/10 border border-accent/20 rounded-xl flex flex-col items-center justify-center">
          <span className="font-heading text-2xl text-accent leading-none">
            {format(dateObj, 'dd')}
          </span>
          <span className="font-body text-xs text-accent/70 uppercase tracking-wider">
            {format(dateObj, 'MMM', { locale: dateLocale })}
          </span>
        </div>
      }

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`inline-flex items-center gap-1 text-xs font-bold font-body uppercase tracking-wider px-2 py-0.5 rounded-full border text-[hsl(var(--accent))] ${config.color}`}>
            <Icon size={10} />
            {config.label[lang] || event.type}
          </span>
          {event.status === 'annulé' &&
          <span className="text-xs font-body text-destructive border border-destructive/30 rounded-full px-2 py-0.5">{tr.calendar_cancelled}</span>
          }
        </div>
        <h3 className="font-heading text-lg text-white group-hover:text-accent transition-colors leading-tight">
          {event.title}
        </h3>
        {event.teams &&
        <p className="font-body text-sm text-white/50 mt-0.5">{event.teams}</p>
        }
        <div className="flex flex-wrap gap-3 mt-2">
          {(event.location || event.city) &&
          <span className="flex items-center gap-1 font-body text-xs text-white/40">
              <MapPin size={11} />
              {[event.location, event.city].filter(Boolean).join(', ')}
            </span>
          }
          {event.time &&
          <span className="flex items-center gap-1 font-body text-xs text-white/40">
              <Clock size={11} />
              {event.time}
            </span>
          }
        </div>
      </div>
    </motion.div>);

}

export default function CalendarSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { lang } = useLang();
  const tr = t[lang];
  const dateLocale = getDateLocale(lang);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await api.events.list();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <section ref={ref} className="py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          
          <div>
            <span className="font-subtitle text-sm uppercase tracking-widest text-secondary">{tr.calendar_badge}</span>
            <h2 className="font-heading text-5xl sm:text-6xl text-accent mt-2">{tr.calendar_title}<br /><span className="text-[hsl(var(--accent))]">{tr.calendar_title2}</span></h2>
            <p className="font-body text-white/50 mt-3 text-sm max-w-md">
              {tr.calendar_subtitle}
            </p>
          </div>
          <Link
            to="/forum"
            className="group inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-wider text-accent hover:text-white transition-colors shrink-0">

            {tr.calendar_see_forum}
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {loading ?
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) =>
          <div key={i} className="h-28 bg-white/5 rounded-xl animate-pulse" />
          )}
          </div> :
        events.length === 0 ?
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-center py-16 border border-white/10 rounded-xl">

            <Calendar size={48} className="text-white/20 mx-auto mb-4" />
            <p className="font-heading text-2xl text-white/30">{tr.calendar_no_events}</p>
            <p className="font-body text-sm text-white/20 mt-2">{tr.calendar_no_events_desc}</p>
          </motion.div> :

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event, i) =>
          <EventCard key={event.id} event={event} index={i} lang={lang} dateLocale={dateLocale} tr={tr} />
          )}
          </div>
        }
      </div>
    </section>);

}