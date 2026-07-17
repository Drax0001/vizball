import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Eye, ChevronRight } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import { CATEGORY_LABELS, LEVEL_LABELS } from '../../lib/tutorialLabels';

const categoryColors = {
  'Gestes Techniques': 'bg-accent/20 text-accent border-accent/30',
  'Placements Tactiques': 'bg-secondary/20 text-secondary border-secondary/30',
  'Entraînements': 'bg-white/10 text-white/80 border-white/20',
  'Règles & Arbitrage': 'bg-accent/10 text-accent/80 border-accent/20',
};

export default function VideoCard({ video, onClick, index }) {
  const { lang } = useLang();
  const tr = t[lang];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-accent/40 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gray-900">
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-accent/20 backdrop-blur-sm border-2 border-accent flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/40 transition-all duration-300">
              <Play size={22} className="text-white ml-1" />
            </div>
          </div>
          {/* Not available text */}
          <div className="absolute inset-0 flex items-center justify-center pt-16">
            <p className="font-body text-xs text-white/40 uppercase tracking-wider">{tr.tutoriels_unavailable}</p>
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
            <span className="font-body text-xs text-white font-semibold">{video.duration}</span>
          </div>
          {/* Level badge */}
          {video.level && (
            <div className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-body font-bold border ${
              video.level === 'Débutant' ? 'bg-secondary/30 text-secondary border-secondary/40' :
              video.level === 'Intermédiaire' ? 'bg-accent/30 text-accent border-accent/40' :
              'bg-red-500/30 text-red-300 border-red-400/40'
            }`}>
              {LEVEL_LABELS[video.level]?.[lang] || video.level}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-3">
            <span className={`inline-block text-xs font-body font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${categoryColors[video.category] || 'bg-white/10 text-white/70 border-white/20'}`}>
              {CATEGORY_LABELS[video.category]?.[lang] || video.category}
            </span>
          </div>
          <h3 className="font-heading text-xl text-white mb-2 group-hover:text-accent transition-colors leading-tight">
            {video.title}
          </h3>
          <p className="font-body text-xs text-white/50 leading-relaxed mb-4 line-clamp-2">{video.desc}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-white/40">
                <Eye size={13} />
                <span className="font-body text-xs">{(video.views || 0).toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                <Clock size={13} />
                <span className="font-body text-xs">{video.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 font-body text-xs font-bold text-accent/70 group-hover:text-accent transition-colors">
              {tr.shop_see} <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}