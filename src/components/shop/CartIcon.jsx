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
    <Link to="/boutique/panier" className="relative flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider rounded transition-all">
      <ShoppingCart size={16} />
      <span className="hidden sm:inline">{tr.cart_word}</span>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-accent text-xs font-bold rounded-full flex items-center justify-center border border-accent"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}