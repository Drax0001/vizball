import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShoppingBag, Search } from 'lucide-react';
import { CATEGORIES, CATEGORY_LABELS } from '../lib/shopData';
import ProductCard from '../components/shop/ProductCard';
import CartIcon from '../components/shop/CartIcon';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import { api } from '../api/client';
import Seo from '../components/Seo';
import PageHero from '../components/site/PageHero';
import shopImage from '../assets/images/ball-to-the-leg.webp';
import { Award, Package, Handshake, Wallet } from 'lucide-react';

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
      <Seo title={tr.shop_title} description={tr.shop_subtitle} canonicalPath="/boutique" />
      <PageHero title={tr.shop_title} subtitle={tr.shop_subtitle} image={shopImage} imageAlt={tr.gallery_cap_4} crop="duel">
        <CartIcon />
      </PageHero>

      {/* Info banner */}
      <div className="border-y border-chalk/10 bg-night">
        <div className="shell py-4">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 md:justify-center">
            {[
            { icon: Award, text: tr.shop_info_official },
            { icon: Package, text: tr.shop_info_delivery },
            { icon: Handshake, text: tr.shop_info_order },
            { icon: Wallet, text: tr.shop_info_payment }].
            map((item, i) =>
            <div key={i} className="flex items-center gap-2">
                <item.icon size={16} className="text-accent" aria-hidden="true" />
                <span className="text-sm text-chalk/70">{item.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-30 border-b border-chalk/10 bg-pitch">
        <div className="shell py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) =>
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-body text-xs font-bold uppercase tracking-wider border transition-all ${
                activeCategory === cat ?
                'bg-accent text-primary border-accent' :
                'bg-white/5 text-chalk/60 border-white/10 hover:border-white/30 hover:text-chalk'}`
                }>

                  {CATEGORY_LABELS[cat][lang]}
                </button>
              )}
            </div>
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-chalk/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tr.shop_search}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-8 pr-4 py-2 font-body text-xs text-chalk placeholder-chalk/30 focus:outline-none focus:border-accent/50 transition-colors" />

            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="shell py-14">
        <AnimatedSection className="mb-6">
          <p className="font-body text-sm text-chalk/30">
            <span className="text-accent font-bold">{filtered.length}</span> {tr.shop_products}
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag size={48} className="text-chalk/15 mx-auto mb-4" />
            <p className="font-heading text-2xl text-chalk/25">{tr.shop_no_results}</p>
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
          <div className="relative rounded-[14px] overflow-hidden bg-night p-10 text-center ring-1 ring-inset ring-chalk/10">
            <h3 className="text-[hsl(var(--accent))] mb-3 text-4xl font-heading">{tr.shop_quote}</h3>
            <p className="font-body text-sm text-chalk/50 max-w-md mx-auto mb-6 leading-relaxed">
              {tr.shop_quote_desc}
            </p>
            <a href="/contact" className="inline-flex items-center gap-2 h-12 bg-accent px-8 font-heading font-bold text-sm uppercase tracking-[0.06em] text-night rounded-full transition-colors duration-300 hover:bg-chalk">
              {tr.shop_quote_cta}
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>);

}