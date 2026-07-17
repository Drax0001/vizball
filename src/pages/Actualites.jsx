import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Newspaper, Search } from 'lucide-react';
import ArticleCard from '../components/news/ArticleCard';
import CalendarSection from '../components/home/CalendarSection';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import { api } from '../api/client';

const CATEGORIES = ['Tous', 'Événement', 'Tournoi', 'Portrait', 'Actualité', 'Communiqué'];
const CATEGORY_LABELS = {
  'Tous': { fr: 'Tous', en: 'All' },
  'Événement': { fr: 'Événement', en: 'Event' },
  'Tournoi': { fr: 'Tournoi', en: 'Tournament' },
  'Portrait': { fr: 'Portrait', en: 'Portrait' },
  'Actualité': { fr: 'Actualité', en: 'News' },
  'Communiqué': { fr: 'Communiqué', en: 'Press release' },
};

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className={className}>
      {children}
    </motion.div>);

}

export default function Actualites() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { lang } = useLang();
  const tr = t[lang];
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [search, setSearch] = useState('');

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await api.articles.list();
      setArticles(data);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const published = articles.filter((a) => a.status === 'publié');

  const filtered = published.filter((a) => {
    const matchCat = activeCategory === 'Tous' || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || (a.excerpt || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredArticle = filtered.find((a) => a.featured) || filtered[0];
  const otherArticles = filtered.filter((a) => a !== featuredArticle);

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
                <Newspaper size={14} className="text-accent" />
                <span className="font-body text-xs font-bold uppercase tracking-wider text-accent">{tr.news_badge}</span>
              </div>
              <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl text-white leading-none mb-4">
                {tr.news_title}<span className="text-[hsl(var(--background))]">{tr.news_title2}</span>
              </h1>
              <p className="font-body text-lg text-white/60 max-w-xl leading-relaxed">
                {tr.news_subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-20 z-30 bg-primary/95 backdrop-blur-md border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) =>
              <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-body text-xs font-bold uppercase tracking-wider border transition-all ${activeCategory === cat ? 'bg-accent text-primary border-accent' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'}`}>
                  {CATEGORY_LABELS[cat][lang]}
                </button>
              )}
            </div>
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tr.news_search} className="w-full bg-white/5 border border-white/10 rounded-full pl-8 pr-4 py-2 font-body text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ?
        <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div> :
        filtered.length === 0 ?
        <div className="text-center py-24">
            <Newspaper size={48} className="text-white/15 mx-auto mb-4" />
            <p className="font-heading text-2xl text-white/25">{tr.news_no_results}</p>
          </div> :

        <>
            {/* Featured */}
            {featuredArticle &&
          <div className="mb-10">
                <ArticleCard article={featuredArticle} featured />
              </div>
          }

            {/* Grid */}
            {otherArticles.length > 0 &&
          <AnimatedSection>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherArticles.map((article, i) =>
              <ArticleCard key={article.id} article={article} index={i} />
              )}
                </div>
              </AnimatedSection>
          }
          </>
        }
      </div>

      {/* Agenda */}
      <CalendarSection />
    </div>);

}