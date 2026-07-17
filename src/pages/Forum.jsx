import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, MessageCircle, Zap, Shield, MapPin, Package } from 'lucide-react';
import TopicRow from '../components/forum/TopicRow';
import TopicDetail from '../components/forum/TopicDetail';
import NewTopicModal from '../components/forum/NewTopicModal';
import { useLang } from '../lib/LanguageContext';
import tr from '../lib/translations';
import { api } from '../api/client';

const CATEGORIES_FR = ['Tous', 'Tactiques', 'Règles', 'Rencontres', 'Général', 'Équipement'];
const CATEGORIES_EN = ['All', 'Tactics', 'Rules', 'Meetings', 'General', 'Equipment'];
// Always use French category values for entity storage
const CAT_EN_TO_FR = { 'All': 'Tous', 'Tactics': 'Tactiques', 'Rules': 'Règles', 'Meetings': 'Rencontres', 'General': 'Général', 'Equipment': 'Équipement' };
const CAT_FR_TO_EN = { 'Tous': 'All', 'Tactiques': 'Tactics', 'Règles': 'Rules', 'Rencontres': 'Meetings', 'Général': 'General', 'Équipement': 'Equipment' };

const categoryIcons = {
  'Tactiques': { icon: Zap, color: 'text-secondary', bg: 'bg-secondary/15 border-secondary/30' },
  'Règles': { icon: Shield, color: 'text-accent', bg: 'bg-accent/15 border-accent/30' },
  'Rencontres': { icon: MapPin, color: 'text-white/70', bg: 'bg-white/10 border-white/20' },
  'Général': { icon: MessageCircle, color: 'text-accent/80', bg: 'bg-accent/10 border-accent/20' },
  'Équipement': { icon: Package, color: 'text-white/60', bg: 'bg-white/8 border-white/15' }
};

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className={className}>
      {children}
    </motion.div>);

}

export default function Forum() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tous'); // Always FR internally
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { lang } = useLang();
  const t = tr[lang];

  const CATEGORIES = lang === 'en' ? CATEGORIES_EN : CATEGORIES_FR;

  const getDisplayCat = (frCat) => lang === 'en' ? CAT_FR_TO_EN[frCat] || frCat : frCat;

  const loadTopics = async () => {
    setLoading(true);
    try {
      const data = await api.forum.listTopics();
      setTopics(data);
    } catch (err) {
      console.error('Failed to fetch forum topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setModalOpen(false);
    loadTopics();
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const filtered = topics.filter((tp) => {
    const matchCat = activeCategory === 'Tous' || tp.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || tp.title.toLowerCase().includes(q) || (tp.content || '').toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const counts = {};
  CATEGORIES_FR.slice(1).forEach((cat) => {counts[cat] = topics.filter((tp) => tp.category === cat).length;});

  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <TopicDetail topic={selectedTopic} onBack={() => {setSelectedTopic(null); loadTopics();}} />
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(43,75%,49%) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
                <Users size={14} className="text-accent" />
                <span className="font-body text-xs font-bold uppercase tracking-wider text-accent">{t.forum_badge}</span>
              </div>
              <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl text-white leading-none mb-4">
                {t.forum_title.split(' ')[0]} <span className="text-[hsl(var(--background))]">{t.forum_title.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="font-body text-lg text-white/60 max-w-xl leading-relaxed">{t.forum_subtitle}</p>
            </motion.div>
            <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-lg transition-all">
              <Plus size={16} /> {t.forum_new_topic}
            </motion.button>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES_FR.slice(1).map((frCat) => {
            const cfg = categoryIcons[frCat];
            const Icon = cfg.icon;
            const isActive = activeCategory === frCat;
            return (
              <button key={frCat} onClick={() => setActiveCategory(isActive ? 'Tous' : frCat)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isActive ? 'bg-accent/20 border-accent text-white' : `${cfg.bg} hover:border-white/30`}`}>
                <Icon size={16} className={isActive ? 'text-accent' : cfg.color} />
                <div className="text-left min-w-0">
                  <p className={`font-body text-xs font-bold truncate ${isActive ? 'text-white' : 'text-white/70'}`}>{getDisplayCat(frCat)}</p>
                  <p className="font-body text-xs text-white/30">{counts[frCat] || 0} {t.forum_subjects}</p>
                </div>
              </button>);

          })}
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-20 z-30 bg-primary/95 backdrop-blur-md border-y border-white/10 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((displayCat, i) => {
                const frCat = lang === 'en' ? CAT_EN_TO_FR[displayCat] || displayCat : displayCat;
                const isActive = activeCategory === frCat;
                return (
                  <button key={displayCat} onClick={() => setActiveCategory(frCat)}
                  className={`px-4 py-1.5 rounded-full font-body text-xs font-bold uppercase tracking-wider border transition-all ${isActive ? 'bg-accent text-primary border-accent' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'}`}>
                    {displayCat}
                  </button>);

              })}
            </div>
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.forum_search}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-8 pr-4 py-2 font-body text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Topics list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatedSection className="mb-4">
          <p className="font-body text-sm text-white/30">
            <span className="text-accent font-bold">{filtered.length}</span> {t.forum_subjects}
          </p>
        </AnimatedSection>

        {loading ?
        <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" /></div> :
        filtered.length === 0 ?
        <div className="text-center py-24">
            <MessageCircle size={48} className="text-white/15 mx-auto mb-4" />
            <p className="font-heading text-2xl text-white/25 mb-2">{t.forum_no_results}</p>
            <button onClick={() => setModalOpen(true)} className="mt-4 flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-lg transition-all mx-auto">
              <Plus size={15} /> {t.forum_first}
            </button>
          </div> :

        <div className="space-y-3">
            {filtered.map((topic, i) =>
          <TopicRow key={topic.id} topic={topic} onClick={setSelectedTopic} index={i} />
          )}
          </div>
        }

        {/* CTA */}
        <AnimatedSection className="mt-16">
          <div className="border border-accent/20 rounded-2xl bg-gradient-to-br from-accent/10 to-secondary/5 p-8 text-center">
            <h3 className="text-[hsl(var(--accent))] mb-2 text-3xl font-heading">{t.forum_cta_title} <span className="text-accent">{t.forum_cta_title2}</span></h3>
            <p className="font-body text-sm text-white/50 max-w-md mx-auto mb-5 leading-relaxed">{t.forum_cta_desc}</p>
            <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-lg transition-all">
              <Plus size={16} /> {t.forum_create}
            </button>
          </div>
        </AnimatedSection>
      </div>

      <AnimatePresence>
        {modalOpen &&
        <NewTopicModal onClose={() => setModalOpen(false)} onSave={handleSave} />
        }
      </AnimatePresence>
    </div>);

}