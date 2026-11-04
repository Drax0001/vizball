import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Newspaper } from 'lucide-react';
import { format } from 'date-fns';
import { useLang } from '../../lib/LanguageContext';
import { getDateLocale } from '../../lib/dateLocale';
import t from '../../lib/translations';
import { api } from '../../api/client';

function dateOf(a, lang) {
  const d = a.published_at || a.created_date;
  return d ? format(new Date(d), 'd MMMM yyyy', { locale: getDateLocale(lang) }) : '';
}

function Cover({ src, alt, className }) {
  return src ? (
    <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className || ''}`} />
  ) : (
    <div className="grid h-full w-full place-items-center bg-primary">
      <Newspaper className="text-white/25" size={40} />
    </div>
  );
}

// "À la une": the newest published article large, the next three listed beside it.
export default function LatestNews() {
  const { lang } = useLang();
  const tr = t[lang];
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    api.articles
      .list()
      .then((data) => {
        const published = (data || [])
          .filter((a) => a.status === 'publié')
          .sort((a, b) => new Date(b.published_at || b.created_date) - new Date(a.published_at || a.created_date));
        const featured = published.find((a) => a.featured);
        setArticles(featured ? [featured, ...published.filter((a) => a !== featured)] : published);
      })
      .catch(() => setArticles([]));
  }, []);

  const [lead, ...rest] = articles || [];

  return (
    <section className="bg-background py-20 md:py-28" aria-labelledby="news-title">
      <div className="shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 id="news-title" className="section-title text-primary">{tr.news_home_title}</h2>
          <Link to="/actualites" className="group inline-flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-primary hover:text-[hsl(var(--brand-red))]">
            {tr.news_see_all}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {articles === null ? (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]" aria-hidden="true">
            <div className="aspect-[16/10] animate-pulse rounded-lg bg-muted" />
            <div className="space-y-4">
              {[0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />)}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border px-6 py-16 text-center">
            <Newspaper size={36} className="text-muted-foreground" />
            <p className="max-w-md text-muted-foreground">{tr.news_home_empty}</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Link to={`/actualites/${lead.id}`} className="photo-card group relative block overflow-hidden rounded-lg bg-primary">
                <div className="aspect-[16/10] overflow-hidden">
                  <Cover src={lead.cover_image} alt={lead.title} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <span className="meta inline-block rounded bg-accent px-2.5 py-1 text-primary">{lead.category}</span>
                  <h3 className="mt-3 font-heading text-2xl font-black uppercase leading-tight text-white group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4 md:text-4xl">
                    {lead.title}
                  </h3>
                  <p className="meta mt-3 text-white/70">{dateOf(lead, lang)}</p>
                </div>
              </Link>
            </motion.div>

            <ul className="flex flex-col divide-y divide-border">
              {rest.slice(0, 3).map((a, i) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="py-4 first:pt-0"
                >
                  <Link to={`/actualites/${a.id}`} className="photo-card group grid grid-cols-[7.5rem_1fr] gap-4">
                    <div className="aspect-[4/3] overflow-hidden rounded-md">
                      <Cover src={a.cover_image} alt={a.title} />
                    </div>
                    <div className="min-w-0">
                      <span className="meta text-[hsl(var(--brand-red))]">{a.category}</span>
                      <h3 className="mt-1 line-clamp-2 font-heading text-lg font-bold leading-snug text-primary group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4">
                        {a.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{dateOf(a, lang)}</p>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
