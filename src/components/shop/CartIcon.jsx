import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { getCart, cartCount } from '../../lib/cartStore';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

export default function CartIcon() {
  const { lang } = useLang();
  const tr = t[lang];
  const [count, setCount] = useState(0);

  const refresh = () => setCount(cartCount(getCart()));

  useEffect(() => {
    refresh();
    window.addEventListener('cart-updated', refresh);
    return () => window.removeEventListener('cart-updated', refresh);
  }, []);

  return (
    <Link to="/boutique/panier" aria-label={tr.cart_word} className="relative inline-flex h-12 items-center gap-2.5 rounded-full bg-accent px-6 font-heading text-[0.95rem] font-bold uppercase tracking-[0.06em] text-night transition-colors duration-300 hover:bg-chalk">
      <ShoppingCart size={16} />
      <span className="hidden sm:inline">{tr.cart_word}</span>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white tabular"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}