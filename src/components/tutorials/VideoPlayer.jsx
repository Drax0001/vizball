import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, X, Clock, Eye } from 'lucide-react';
import { api } from '@/api/client';
import { useLang } from '@/lib/LanguageContext';
import t from '@/lib/translations';
import StarRating from '../StarRating';

export default function VideoPlayer({ video, onClose }) {
  const { lang } = useLang();
  const tr = t[lang];
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [rating, setRating] = useState({ avg: video.rating_avg || 0, count: video.rating_count || 0 });
  const [hasRated, setHasRated] = useState(false);
  const videoRef = useRef(null);
  const controlsTimer = useRef(null);

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

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isNaN(p) ? 0 : p);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    videoRef.current.currentTime = ratio * videoRef.current.duration;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
    }
  };

  // Use a YouTube embed if the src is a YouTube URL, else use <video>
  const isYoutube = video.src && video.src.includes('youtube.com');
  const youtubeId = isYoutube ? video.src.split('v=')[1]?.split('&')[0] : null;

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
          <div
            className="relative aspect-video bg-black"
            onMouseMove={handleMouseMove}
          >
            {isYoutube ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                title={video.title}
              />
            ) : (
              <>
                {/* Placeholder video with poster image */}
                <div className="relative w-full h-full">
                  <img
                    src={video.thumb}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 rounded-full border-2 border-accent flex items-center justify-center mx-auto mb-4 bg-accent/20">
                        <Play size={36} className="text-accent ml-1" />
                      </div>
                      <p className="font-body text-sm text-white/70">{tr.tutoriels_preview} {video.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Custom Controls overlay */}
                <AnimatePresence>
                  {showControls && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
                    >
                      {/* Progress bar */}
                      <div
                        className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-3 group"
                        onClick={handleSeek}
                      >
                        <div
                          className="h-full bg-accent rounded-full relative"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={togglePlay}
                            className="text-white hover:text-accent transition-colors"
                          >
                            {playing ? <Pause size={22} /> : <Play size={22} />}
                          </button>
                          <button
                            onClick={() => setMuted(!muted)}
                            className="text-white hover:text-accent transition-colors"
                          >
                            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                          </button>
                          <span className="font-body text-xs text-white/70">{video.duration}</span>
                        </div>
                        <button
                          onClick={handleFullscreen}
                          className="text-white hover:text-accent transition-colors"
                        >
                          <Maximize size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
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