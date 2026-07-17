import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Clock, Eye, Star } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

export default function FeaturedVideo({ video, onClick }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className="group cursor-pointer"
      onClick={onClick}>
      
      <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-accent/40 transition-all duration-500">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gray-900">
          {/* Big play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-accent/20 backdrop-blur-sm border-2 border-accent flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                <Play size={36} className="text-white ml-2" fill="white" />
              </div>
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-ping" />
            </div>
          </div>
          {/* Not available text */}
          <div className="absolute inset-0 flex items-center justify-center pt-32">
            <p className="font-body text-sm text-white/40 uppercase tracking-wider">{tr.tutoriels_unavailable}</p>
          </div>

          {/* Featured badge */}
          <div className="bg-[hsl(var(--brand-red))] text-[hsl(var(--popover))] px-4 py-2 rounded-full absolute top-4 left-4 flex items-center gap-2">
            <Star size={14} fill="currentColor" />
            <span className="font-body text-xs font-bold uppercase tracking-wider">{tr.tutoriels_featured}</span>
          </div>

          {/* Duration */}
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded px-3 py-1.5">
            <span className="font-body text-sm text-white font-semibold">{video.duration}</span>
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="font-body text-xs font-bold uppercase tracking-wider text-accent">{video.category}</span>
          <h2 className="font-heading text-3xl sm:text-4xl text-white mt-1 mb-2 group-hover:text-accent transition-colors">
            {video.title}
          </h2>
          <p className="font-body text-sm text-white/60 max-w-xl line-clamp-2">{video.desc}</p>
          <div className="flex items-center gap-5 mt-4">
            <div className="flex items-center gap-2 text-white/50">
              <Eye size={14} />
              <span className="font-body text-xs">{(video.views || 0).toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')} {tr.tutoriels_views}</span>
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <Clock size={14} />
              <span className="font-body text-xs">{video.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>);

}