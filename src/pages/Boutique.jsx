import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShoppingBag, Filter, Search } from 'lucide-react';
import { CATEGORIES, CATEGORY_LABELS } from '../lib/shopData';
import ProductCard from '../components/shop/ProductCard';
import CartIcon from '../components/shop/CartIcon';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import { api } from '../api/client';

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className={className}>
      {children}
    </motion.div>);

}

export default function Boutique() {
  const { lang } = useLang();
  const tr = t[lang];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [search, setSearch] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.products.list();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'Tous' || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(43,75%,49%) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
                <ShoppingBag size={14} className="text-accent" />
                <span className="font-body text-xs font-bold uppercase tracking-wider text-accent">{tr.shop_badge}</span>
              </div>
              <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl text-white leading-none mb-4">
                {tr.shop_title}
              </h1>
              <p className="font-body text-lg text-white/60 max-w-xl leading-relaxed">
                {tr.shop_subtitle}
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <CartIcon />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info banner */}
      <div className="border-y border-white/10 bg-white/3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            {[
            { icon: '🏅', text: tr.shop_info_official },
            { icon: '📦', text: tr.shop_info_delivery },
            { icon: '🤝', text: tr.shop_info_order },
            { icon: '⚽', text: tr.shop_info_payment }].
            map((item, i) =>
            <div key={i} className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="font-body text-xs text-white/50">{item.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-20 z-30 bg-primary/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) =>
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-body text-xs font-bold uppercase tracking-wider border transition-all ${
                activeCategory === cat ?
                'bg-accent text-primary border-accent' :
                'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'}`
                }>

                  {CATEGORY_LABELS[cat][lang]}
                </button>
              )}
            </div>
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tr.shop_search}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-8 pr-4 py-2 font-body text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition-colors" />

            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <AnimatedSection className="mb-6">
          <p className="font-body text-sm text-white/30">
            <span className="text-accent font-bold">{filtered.length}</span> {tr.shop_products}
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag size={48} className="text-white/15 mx-auto mb-4" />
            <p className="font-heading text-2xl text-white/25">{tr.shop_no_results}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <AnimatedSection className="mt-20">
          <div className="relative rounded-2xl overflow-hidden border border-accent/20 bg-gradient-to-br from-accent/10 to-secondary/5 p-10 text-center">
            <h3 className="text-[hsl(var(--accent))] mb-3 text-4xl font-heading">{tr.shop_quote}</h3>
            <p className="font-body text-sm text-white/50 max-w-md mx-auto mb-6 leading-relaxed">
              {tr.shop_quote_desc}
            </p>
            <a href="/contact" className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-lg transition-all">
              {tr.shop_quote_cta}
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>);

}