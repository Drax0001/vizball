import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Clock, Eye } from 'lucide-react';
import { api } from '@/api/client';
import { useLang } from '@/lib/LanguageContext';
import t from '@/lib/translations';
import StarRating from '../StarRating';

// Resolves a YouTube or Vimeo URL (in any of their common forms) to an
// embeddable iframe URL. Self-hosted video files aren't supported — see
// the video-hosting decision this mirrors: tutorial videos live on
// YouTube/Vimeo rather than this app's own server/VPS.
function getEmbedInfo(src) {
  if (!src) return null;
  let url;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, '');

  if (host === 'youtube.com') {
    const id = url.pathname.startsWith('/embed/')
      ? url.pathname.split('/embed/')[1]
      : url.searchParams.get('v');
    return id ? { provider: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` } : null;
  }
  if (host === 'youtu.be') {
    const id = url.pathname.slice(1);
    return id ? { provider: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` } : null;
  }
  if (host === 'vimeo.com') {
    const id = url.pathname.split('/').filter(Boolean)[0];
    return id && /^\d+$/.test(id) ? { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}` } : null;
  }
  if (host === 'player.vimeo.com') {
    return { provider: 'vimeo', embedUrl: src };
  }
  return null;
}

export default function VideoPlayer({ video, onClose }) {
  const { lang } = useLang();
  const tr = t[lang];
  const [rating, setRating] = useState({ avg: video.rating_avg || 0, count: video.rating_count || 0 });
  const [hasRated, setHasRated] = useState(false);

  const embed = getEmbedInfo(video.src);

  // Records one play per browser session per tutorial — same dedup pattern
  // used for article reads and the site-wide visitor counter.
  useEffect(() => {
    const trackedKey = `vizball_viewed_tutorial_${video.id}`;
    if (sessionStorage.getItem(trackedKey)) return;
    api.tutorials.trackView(video.id)
      .then(() => sessionStorage.setItem(trackedKey, 'true'))
      .catch((err) => console.error('Failed to track tutorial view:', err));
  }, [video.id]);

  useEffect(() => {
    setHasRated(!!sessionStorage.getItem(`vizball_rated_tutorial_${video.id}`));
  }, [video.id]);

  const handleRate = async (value) => {
    try {
      const res = await api.tutorials.rate(video.id, value);
      setRating({ avg: res.rating_avg, count: res.rating_count });
      sessionStorage.setItem(`vizball_rated_tutorial_${video.id}`, 'true');
      setHasRated(true);
    } catch (err) {
      console.error('Failed to submit rating:', err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl bg-primary rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b border-white/10">
            <div>
              <span className="font-body text-xs font-bold uppercase tracking-wider text-accent">{video.category}</span>
              <h3 className="font-heading text-xl text-white mt-1">{video.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Video */}
          <div className="relative aspect-video bg-black">
            {embed ? (
              <iframe
                src={`${embed.embedUrl}${embed.provider === 'youtube' ? '?autoplay=1' : '#autoplay=1'}`}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            ) : (
              <div className="relative w-full h-full">
                {video.thumb ? (
                  <img src={video.thumb} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-900" />
                )}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center text-white px-6">
                    <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center mx-auto mb-4">
                      <Play size={26} className="text-white/50 ml-1" />
                    </div>
                    <p className="font-body text-sm text-white/60 uppercase tracking-wider">{tr.tutoriels_unavailable}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-white/50 font-body text-xs">
              <Clock size={14} />
              <span>{video.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 font-body text-xs">
              <Eye size={14} />
              <span>{(video.views || 0).toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')} {tr.tutoriels_views}</span>
            </div>
            <StarRating value={rating.avg} count={rating.count} interactive={!hasRated} onRate={handleRate} size={14} />
            <p className="font-body text-sm text-white/60 leading-relaxed ml-auto text-right max-w-md">{video.desc}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
