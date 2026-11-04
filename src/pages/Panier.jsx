import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, ArrowLeft, ChevronRight, Send, Check, Package } from 'lucide-react';
import { getCart, updateQty, removeFromCart, clearCart, cartTotal, cartCount } from '../lib/cartStore';
import { formatPrice } from '../lib/shopData';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';

export default function Panier() {
  const { lang } = useLang();
  const tr = t[lang];
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState('cart'); // 'cart' | 'form' | 'confirm'
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', note: '' });

  const refresh = () => setCart(getCart());

  useEffect(() => {
    refresh();
    window.addEventListener('cart-updated', refresh);
    return () => window.removeEventListener('cart-updated', refresh);
  }, []);

  const total = cartTotal(cart);
  const count = cartCount(cart);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('confirm');
    clearCart();
  };

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="w-20 h-20 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-secondary" />
          </div>
          <h2 className="font-heading text-5xl text-white mb-3">{tr.cart_confirm_title}</h2>
          <p className="font-body text-sm text-white/60 leading-relaxed mb-8 max-w-sm mx-auto">
            {tr.cart_confirm_desc}
          </p>
          <Link to="/boutique" className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-lg transition-all">
            {tr.cart_continue}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link to="/boutique" className="inline-flex items-center gap-2 font-body text-xs text-white/40 hover:text-white transition-colors mb-3 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> {tr.nav_shop}
            </Link>
            <h1 className="font-heading text-5xl sm:text-6xl text-white">
              {tr.cart_title}
            </h1>
          </div>
          {count > 0 && (
            <span className="font-body text-sm text-white/40">{count} {count > 1 ? tr.cart_articles : tr.cart_article}</span>
          )}
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-10">
          {[tr.cart_step1, tr.cart_step2, tr.cart_step3].map((s, i) => {
            const stepIdx = step === 'cart' ? 0 : step === 'form' ? 1 : 2;
            return (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${i <= stepIdx ? 'text-accent' : 'text-white/20'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-body text-xs font-bold border ${i <= stepIdx ? 'bg-accent/20 border-accent text-accent' : 'border-white/10 text-white/20'}`}>{i + 1}</div>
                  <span className="font-body text-xs uppercase tracking-wider hidden sm:inline">{s}</span>
                </div>
                {i < 2 && <ChevronRight size={14} className="text-white/20 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>

        {cart.length === 0 && step === 'cart' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <ShoppingCart size={56} className="text-white/15 mx-auto mb-6" />
            <p className="font-heading text-3xl text-white/25 mb-2">{tr.cart_empty}</p>
            <p className="font-body text-sm text-white/30 mb-8">{tr.cart_empty_desc}</p>
            <Link to="/boutique" className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-lg transition-all">
              <Package size={16} /> {tr.cart_see_shop}
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left — items or form */}
            <div className="lg:col-span-2">
              {step === 'cart' ? (
                <div className="space-y-3">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 shrink-0 rounded-lg bg-white/5 overflow-hidden">
                            <img src={item.product.img} alt={item.product.name} className="w-full h-full object-contain p-2" />
                          </div>
                          <div className="flex-1 min-w-0 sm:hidden">
                            <p className="font-body text-xs text-white/40 uppercase tracking-wider">{item.product.category}</p>
                            <h3 className="font-heading text-lg text-white leading-tight">{item.product.name}</h3>
                            {item.size && <span className="font-body text-xs text-accent border border-accent/30 bg-accent/10 rounded-full px-2 py-0.5 mt-1 inline-block">{tr.shop_size} {item.size}</span>}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 hidden sm:block">
                          <p className="font-body text-xs text-white/40 uppercase tracking-wider">{item.product.category}</p>
                          <h3 className="font-heading text-lg text-white leading-tight">{item.product.name}</h3>
                          {item.size && <span className="font-body text-xs text-accent border border-accent/30 bg-accent/10 rounded-full px-2 py-0.5 mt-1 inline-block">{tr.shop_size} {item.size}</span>}
                        </div>
                        <div className="flex items-center justify-between sm:justify-start gap-4">
                          <div className="flex items-center border border-white/15 rounded-lg overflow-hidden shrink-0">
                            <button onClick={() => updateQty(item.key, item.qty - 1)} className="px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm">−</button>
                            <span className="px-3 py-2 font-body text-sm font-bold text-white border-x border-white/15">{item.qty}</span>
                            <button onClick={() => updateQty(item.key, item.qty + 1)} className="px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm">+</button>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-heading text-lg text-accent">{formatPrice(item.product.price * item.qty, lang)}</p>
                            <button onClick={() => removeFromCart(item.key)} className="text-white/20 hover:text-destructive transition-colors mt-1">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <h2 className="font-heading text-3xl text-white mb-6">{tr.cart_your_info}</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.cart_name}</label>
                      <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={tr.contact_name_placeholder} className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
                    </div>
                    <div>
                      <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.cart_email}</label>
                      <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemple.com" className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.cart_phone}</label>
                      <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+237 6XX XX XX XX" className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
                    </div>
                    <div>
                      <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.cart_city}</label>
                      <Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Yaoundé, Douala..." className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.cart_notes}</label>
                    <Textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder={tr.cart_notes_placeholder} rows={3} className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
                  </div>
                  <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-sm font-body text-white/60 leading-relaxed">
                    ℹ️ {tr.cart_info_note}
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider py-4 rounded-lg transition-all">
                    <Send size={16} /> {tr.cart_send}
                  </button>
                </motion.form>
              )}
            </div>

            {/* Right — Order summary */}
            <div>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden lg:sticky lg:top-36">
                <div className="p-5 border-b border-white/10">
                  <h3 className="font-heading text-xl text-white">{tr.cart_summary}</h3>
                </div>
                <div className="p-5 space-y-3">
                  {cart.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-body text-xs text-white/40 shrink-0">{item.qty}×</span>
                        <span className="font-body text-xs text-white/70 truncate">{item.product.name}{item.size ? ` (${item.size})` : ''}</span>
                      </div>
                      <span className="font-body text-xs font-bold text-white shrink-0">{formatPrice(item.product.price * item.qty, lang)}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-white/50">{tr.cart_subtotal}</span>
                    <span className="font-body text-sm text-white">{formatPrice(total, lang)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-white/50">{tr.cart_delivery}</span>
                    <span className="font-body text-xs text-white/40">{tr.cart_delivery_note}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="font-heading text-lg text-white">{tr.cart_total}</span>
                    <span className="font-heading text-2xl text-accent">{formatPrice(total, lang)}</span>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  {step === 'cart' ? (
                    <button
                      onClick={() => setStep('form')}
                      className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider py-4 rounded-lg transition-all"
                    >
                      {tr.cart_checkout} <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button onClick={() => setStep('cart')} className="w-full font-body text-sm text-white/40 hover:text-white transition-colors py-2">
                      {tr.cart_modify}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}