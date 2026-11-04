import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useLang } from '../../lib/LanguageContext';
import { getDateLocale } from '../../lib/dateLocale';
import t from '../../lib/translations';

const categoryColors = {
  'Événement': 'bg-accent/20 text-accent border-accent/30',
  'Tournoi': 'bg-secondary/20 text-secondary border-secondary/30',
  'Portrait': 'bg-white/10 text-white/80 border-white/20',
  'Actualité': 'bg-accent/15 text-accent/80 border-accent/20',
  'Communiqué': 'bg-white/10 text-white/60 border-white/15'
};

export default function ArticleCard({ article, index, featured = false }) {
  const { lang } = useLang();
  const tr = t[lang];
  const dateLocale = getDateLocale(lang);
  const dateLabel = article.published_at ?
  format(new Date(article.published_at), 'd MMMM yyyy', { locale: dateLocale }) :
  format(new Date(article.created_date), 'd MMMM yyyy', { locale: dateLocale });

  const fallbackImg = '';

  if (featured) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Link to={`/actualites/${article.id}`} className="group block">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-accent/40 transition-all duration-500">
            <div className="relative aspect-video overflow-hidden">
              <img src={article.cover_image || fallbackImg} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Star size={12} className="text-accent" fill="currentColor" />
                <span className="bg-[hsl(var(--brand-red))] text-[hsl(var(--background))] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-sm border border-accent/30">{tr.news_featured}</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="bg-[hsl(var(--brand-red))] text-[hsl(var(--background))] mb-3 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full inline-block border border-secondary/30">
                {article.category}
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl text-white group-hover:text-accent transition-colors leading-tight mb-2">{article.title}</h2>
              {article.excerpt && <p className="font-body text-sm text-white/60 line-clamp-2 mb-4">{article.excerpt}</p>}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/40 font-body text-xs">
                  <Calendar size={13} />
                  <span>{dateLabel}</span>
                  {article.author_name && <span>· {article.author_name}</span>}
                </div>
                <span className="flex items-center gap-1 font-body text-xs font-bold text-accent group-hover:gap-2 transition-all">
                  {tr.news_read} <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>);

  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
      <Link to={`/actualites/${article.id}`} className="group block h-full">
        <div className="h-full bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10 flex flex-col">
          <div className="relative aspect-video overflow-hidden">
            <img src={article.cover_image || fallbackImg} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <span className="bg-[hsl(var(--brand-red))] text-[hsl(var(--popover))] mb-3 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full inline-block border w-fit border-white/20">
              {article.category}
            </span>
            <h3 className="font-heading text-xl text-white group-hover:text-accent transition-colors leading-tight mb-2 flex-1">{article.title}</h3>
            {article.excerpt && <p className="font-body text-xs text-white/50 line-clamp-2 mb-4">{article.excerpt}</p>}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-white/30 font-body text-xs">
                <Calendar size={12} />
                <span>{dateLabel}</span>
              </div>
              <span className="flex items-center gap-1 font-body text-xs font-bold text-accent/70 group-hover:text-accent transition-colors">
                {tr.news_read} <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>);

}