import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Filter, Play, BookOpen, Crosshair, Users, Dumbbell, Scale } from 'lucide-react';
import VideoCard from '../components/tutorials/VideoCard';
import FeaturedVideo from '../components/tutorials/FeaturedVideo';
import VideoPlayer from '../components/tutorials/VideoPlayer';
import { api } from '../api/client';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import { CATEGORY_LABELS, LEVEL_LABELS } from '../lib/tutorialLabels';

const CATEGORIES = [
{ label: 'Tous', icon: Play },
{ label: 'Gestes Techniques', icon: Crosshair },
{ label: 'Placements Tactiques', icon: Users },
{ label: 'Entraînements', icon: Dumbbell },
{ label: 'Règles & Arbitrage', icon: Scale }];

const LEVELS = ['Tous les niveaux', 'Débutant', 'Intermédiaire', 'Avancé'];

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}>
      
      {children}
    </motion.div>);

}

export default function Tutoriels() {
  const { lang } = useLang();
  const tr = t[lang];
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeLevel, setActiveLevel] = useState('Tous les niveaux');
  const [search, setSearch] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const loadTutorials = async () => {
      setLoading(true);
      try {
        const data = await api.tutorials.list();
        setVideos(data);
      } catch (err) {
        console.error('Failed to load tutorials:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTutorials();
  }, []);

  const featuredVideo = videos.find((v) => v.featured);

  const filtered = videos.filter((v) => {
    const matchCat = activeCategory === 'Tous' || v.category === activeCategory;
    const matchLevel = activeLevel === 'Tous les niveaux' || v.level === activeLevel;
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) || v.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchLevel && matchSearch;
  });

  const gridVideos = filtered.filter((v) => !v.featured || activeCategory !== 'Tous' || search || activeLevel !== 'Tous les niveaux');

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="font-subtitle text-sm uppercase tracking-widest text-accent">{tr.tutoriels_badge}</span>
              <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl text-white mt-2">
                {tr.tutoriels_title}<span className="text-[hsl(var(--background))]">{tr.tutoriels_title2}</span>
              </h1>
              <p className="font-body text-lg text-white/70 max-w-xl mt-4">
                {tr.tutoriels_subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-b border-white/10 bg-primary/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center divide-x divide-white/10 py-4 overflow-x-auto">
            {[
            { value: `${videos.length}`, label: tr.tutoriels_stat_tutorials },
            { value: '4', label: tr.tutoriels_stat_categories },
            { value: '3', label: tr.tutoriels_stat_levels },
            { value: '3h+', label: tr.tutoriels_stat_content }].
            map((s, i) =>
            <div key={i} className="flex-1 min-w-[120px] px-6 text-center">
                <span className="font-heading text-3xl text-accent">{s.value}</span>
                <p className="font-body text-xs text-white/50 uppercase tracking-wider">{s.label}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured video */}
        {featuredVideo && activeCategory === 'Tous' && !search && activeLevel === 'Tous les niveaux' &&
        <AnimatedSection className="mb-16">
            <FeaturedVideo video={featuredVideo} onClick={() => setSelectedVideo(featuredVideo)} />
          </AnimatedSection>
        }

        {/* Filters */}
        <AnimatedSection className="mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) =>
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-body text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                activeCategory === cat.label ?
                'bg-accent text-primary border-accent' :
                'bg-white/5 text-white/70 border-white/10 hover:border-accent/40 hover:text-white'}`
                }>
                
                  <cat.icon size={14} />
                  {CATEGORY_LABELS[cat.label][lang]}
                </button>
              )}
            </div>

            {/* Right filters */}
            <div className="flex gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 lg:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={tr.tutoriels_search}
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition-colors" />

              </div>
              {/* Level filter */}
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <select
                  value={activeLevel}
                  onChange={(e) => setActiveLevel(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2.5 font-body text-sm text-white appearance-none focus:outline-none focus:border-accent/50 transition-colors cursor-pointer">

                  {LEVELS.map((l) =>
                  <option key={l} value={l} className="bg-[#1B4332] text-white">{LEVEL_LABELS[l][lang]}</option>
                  )}
                </select>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Results count */}
        <div className="mb-6">
          <p className="font-body text-sm text-white/40">
            <span className="text-accent font-bold">{filtered.length}</span> {filtered.length > 1 ? tr.tutoriels_results : tr.tutoriels_result}
          </p>
        </div>

        {/* Video Grid */}
        {loading ?
        <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div> :
        filtered.length === 0 ?
        <div className="text-center py-20">
            <BookOpen size={48} className="text-white/20 mx-auto mb-4" />
            <p className="font-heading text-2xl text-white/30">{tr.tutoriels_no_results}</p>
            <p className="font-body text-sm text-white/20 mt-2">{tr.tutoriels_no_results_desc}</p>
          </div> :

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeCategory === 'Tous' && !search && activeLevel === 'Tous les niveaux' ?
          videos.filter((v) => !v.featured) :
          filtered).
          map((video, i) =>
          <VideoCard
            key={video.id}
            video={video}
            index={i}
            onClick={() => setSelectedVideo(video)} />

          )}
          </div>
        }
      </div>

      {/* Video Player Modal */}
      {selectedVideo &&
      <VideoPlayer
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)} />

      }
    </div>);

}