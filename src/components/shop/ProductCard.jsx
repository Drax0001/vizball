import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../lib/shopData';
import { addToCart } from '../../lib/cartStore';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

const badgeColors = {
  Officiel: 'bg-secondary/20 text-secondary border-secondary/30',
  Nouveau: 'bg-accent/20 text-accent border-accent/30',
  Pack: 'bg-white/10 text-white/70 border-white/20',
  Pro: 'bg-accent/30 text-accent border-accent/40',
  Club: 'bg-secondary/30 text-secondary border-secondary/40'
};

export default function ProductCard({ product, index }) {
  const { lang } = useLang();
  const tr = t[lang];
  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!product.sizes) {
      addToCart(product);
    }
    // If has sizes, redirect to detail
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}>
      
      <Link to={`/boutique/${product.id}`} className="group block">
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-accent/40 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-white/5">
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" />
            
            <div className="absolute top-3 left-3">
              <span className="bg-[hsl(var(--brand-red))] text-[hsl(var(--background))] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border border-secondary/30">
                {product.badge}
              </span>
            </div>
            {/* Quick add */}
            {!product.sizes &&
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-3 right-3 w-10 h-10 bg-accent text-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg">
              
                <ShoppingCart size={16} />
              </button>
            }
          </div>

          {/* Info */}
          <div className="p-5">
            <p className="font-body text-xs text-white/40 uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="font-heading text-xl text-white group-hover:text-accent transition-colors leading-tight mb-3">
              {product.name}
            </h3>
            <p className="font-body text-xs text-white/50 leading-relaxed line-clamp-2 mb-4">{product.desc}</p>
            <div className="flex items-center justify-between">
              <span className="font-heading text-2xl text-accent">{formatPrice(product.price, lang)}</span>
              <div className="flex items-center gap-1 font-body text-xs text-white/40 group-hover:text-accent transition-colors">
                {tr.shop_see} <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>);

}