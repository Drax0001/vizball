import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Eye } from 'lucide-react';
import { format } from 'date-fns';
import StarRating from '../components/StarRating';
import { useLang } from '../lib/LanguageContext';
import { getDateLocale } from '../lib/dateLocale';
import t from '../lib/translations';
import { api } from '../api/client';

const categoryColors = {
  'Événement':   'bg-accent/20 text-accent border-accent/30',
  'Tournoi':     'bg-secondary/20 text-secondary border-secondary/30',
  'Portrait':    'bg-white/10 text-white/80 border-white/20',
  'Actualité':   'bg-accent/15 text-accent/80 border-accent/20',
  'Communiqué':  'bg-white/10 text-white/60 border-white/15',
};

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const { lang } = useLang();
  const tr = t[lang];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasRated, setHasRated] = useState(false);

  const loadArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.articles.get(id);
      setArticle(data);
    } catch (err) {
      console.error('Failed to load article:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticle();
  }, [id]);

  // Records one read per browser session per article — mirrors the dedup
  // approach already used by VisitorCounter.jsx, so a refresh doesn't inflate it.
  useEffect(() => {
    const trackedKey = `vizball_viewed_article_${id}`;
    if (sessionStorage.getItem(trackedKey)) return;
    api.articles.trackView(id)
      .then(() => sessionStorage.setItem(trackedKey, 'true'))
      .catch((err) => console.error('Failed to track article view:', err));
  }, [id]);

  useEffect(() => {
    setHasRated(!!sessionStorage.getItem(`vizball_rated_article_${id}`));
  }, [id]);

  const handleRate = async (value) => {
    try {
      const res = await api.articles.rate(id, value);
      setArticle((prev) => ({ ...prev, rating_avg: res.rating_avg, rating_count: res.rating_count }));
      sessionStorage.setItem(`vizball_rated_article_${id}`, 'true');
      setHasRated(true);
    } catch (err) {
      console.error('Failed to submit rating:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center text-center p-4">
        <div>
          <h2 className="font-heading text-2xl text-white mb-4">{tr.article_not_found}</h2>
          <p className="font-body text-white/60 mb-6">{error || tr.article_not_found_desc}</p>
          <Link to="/actualites" className="inline-flex items-center gap-2 bg-accent text-primary font-body font-bold text-sm uppercase px-6 py-3 rounded-lg">
            <ArrowLeft size={16} /> {tr.article_back_cta}
          </Link>
        </div>
      </div>
    );
  }

  const dateLocale = getDateLocale(lang);
  const dateLabel = article.published_at
    ? format(new Date(article.published_at), 'd MMMM yyyy', { locale: dateLocale })
    : article.created_date
      ? format(new Date(article.created_date), 'd MMMM yyyy', { locale: dateLocale })
      : tr.article_unknown_date;

  return (
    <div className="min-h-screen bg-primary">
      {/* Cover */}
      {article.cover_image && (
        <div className="relative h-[55vh] min-h-[350px] overflow-hidden">
          <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/20" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24" style={{ marginTop: article.cover_image ? '-120px' : '120px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
          {/* Back */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/actualites" className="inline-flex items-center gap-2 font-body text-sm text-white/40 hover:text-white transition-colors group">
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> {tr.article_back}
            </Link>
          </div>

          {/* Category + date */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`text-xs font-body font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${categoryColors[article.category] || categoryColors['Actualité']}`}>
              {article.category}
            </span>
            <div className="flex items-center gap-1.5 text-white/40 font-body text-xs">
              <Calendar size={12} /> {dateLabel}
            </div>
            {article.author_name && (
              <div className="flex items-center gap-1.5 text-white/40 font-body text-xs">
                <User size={12} /> {article.author_name}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-white/40 font-body text-xs">
              <Eye size={12} /> {(article.views || 0).toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')} {article.views > 1 ? tr.article_views : tr.article_view}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-8">
            <StarRating
              value={article.rating_avg || 0}
              count={article.rating_count || 0}
              interactive={!hasRated}
              onRate={handleRate}
            />
            <span className="font-body text-xs text-white/30">
              {hasRated ? tr.rating_thanks : tr.rating_rate_prompt}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">{article.title}</h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="font-body text-lg text-white/60 leading-relaxed border-l-2 border-accent pl-5 mb-10">{article.excerpt}</p>
          )}

          {/* Content */}
          <div className="font-body text-white/75 leading-relaxed space-y-4 text-[15px]">
            {article.content.split('\n\n').map((para, i) => (
              para.trim() ? <p key={i}>{para.trim()}</p> : null
            ))}
          </div>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-white/10">
              <Tag size={14} className="text-white/30" />
              {article.tags.map((tag, i) => (
                <span key={i} className="font-body text-xs text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          )}

          {/* Back CTA */}
          <div className="mt-14 pt-8 border-t border-white/10">
            <Link to="/actualites" className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-lg transition-all">
              <ArrowLeft size={15} /> {tr.article_back_cta}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}