import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Check, ChevronRight, Shield, Truck, Award } from 'lucide-react';
import { formatPrice } from '../lib/shopData';
import { addToCart } from '../lib/cartStore';
import CartIcon from '../components/shop/CartIcon';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import { api } from '../api/client';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const tr = t[lang];
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const list = await api.products.list();
        const found = list.find((p) => p.id === id);
        if (found) {
          // Normalize schema to match what UI expects
          found.imgs = found.imgs || [found.image_url];
          found.desc = found.desc || found.description;
          setProduct(found);

          const relatedList = list
            .filter((p) => p.id !== found.id && p.category === found.category)
            .slice(0, 3)
            .map(p => ({
              ...p,
              img: p.image_url // map for related cards
            }));
          setRelated(relatedList);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAdd = () => {
    if (product.sizes && !selectedSize) return;
    addToCart(product, selectedSize, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="font-heading text-3xl text-white/30 mb-4">{tr.shop_not_found}</p>
          <Link to="/boutique" className="font-body text-sm text-accent hover:text-accent/80">← {tr.shop_back_to_shop}</Link>
        </div>
      </div>
    );
  }

  const badge = product.badge || (product.in_stock ? tr.shop_badge_approved : tr.shop_badge_on_order);
  const specs = product.specs || [
    { label: tr.shop_spec_category, value: product.category },
    { label: tr.shop_spec_approval, value: 'Association Nationale de Vizball' },
    { label: tr.shop_spec_status, value: product.in_stock ? tr.shop_in_stock : tr.shop_on_order_avail }
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Top bar */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-primary/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-body text-xs text-white/40">
            <Link to="/boutique" className="hover:text-white transition-colors">{tr.nav_shop}</Link>
            <ChevronRight size={12} />
            <span className="text-white/70 truncate max-w-48">{product.name}</span>
          </div>
          <CartIcon />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20">
        <Link to="/boutique" className="inline-flex items-center gap-2 font-body text-sm text-white/40 hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> {tr.shop_back_to_shop}
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-square bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
              <img
                src={product.imgs[selectedImg]}
                alt={product.name}
                className="w-full h-full object-contain p-10 max-h-[500px]"
              />
              <div className="absolute top-4 left-4">
                <span className="font-body text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-accent/20 text-accent border border-accent/30">
                  {badge}
                </span>
              </div>
            </div>
            {product.imgs.length > 1 && (
              <div className="flex gap-3">
                {product.imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImg === i ? 'border-accent' : 'border-white/10 hover:border-white/30'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="font-body text-xs text-white/40 uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="font-heading text-4xl sm:text-5xl text-white mb-4 leading-tight">{product.name}</h1>
            <div className="font-heading text-4xl text-accent mb-6">{formatPrice(product.price, lang)}</div>
            <p className="font-body text-sm text-white/60 leading-relaxed mb-8">{product.desc}</p>

            {/* Size selector */}
            {product.sizes && (
              <div className="mb-6">
                <p className="font-body text-xs font-bold uppercase tracking-wider text-white/50 mb-3">{tr.shop_size}</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border font-body text-sm font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-accent text-primary border-accent'
                          : 'bg-white/5 text-white/70 border-white/15 hover:border-accent/40 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {product.sizes && !selectedSize && (
                  <p className="font-body text-xs text-white/30 mt-2">{tr.shop_select_size}</p>
                )}
              </div>
            )}

            {/* Qty + Add */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-white/15 rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 transition-colors font-body text-lg">−</button>
                <span className="px-5 py-3 font-body font-bold text-white border-x border-white/15">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 transition-colors font-body text-lg">+</button>
              </div>
              <button
                onClick={handleAdd}
                disabled={product.sizes && !selectedSize}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-body font-bold text-sm uppercase tracking-wider transition-all ${
                  added
                    ? 'bg-secondary text-white'
                    : product.sizes && !selectedSize
                    ? 'bg-white/10 text-white/30 cursor-not-allowed'
                    : 'bg-accent hover:bg-accent/90 text-primary'
                }`}
              >
                {added ? <><Check size={16} /> {tr.shop_added}</> : <><ShoppingCart size={16} /> {tr.shop_add}</>}
              </button>
            </div>

            {/* Specs */}
            <div className="border border-white/10 rounded-xl overflow-hidden mb-6">
              <div className="bg-white/5 px-5 py-3 border-b border-white/10">
                <p className="font-body text-xs font-bold uppercase tracking-wider text-white/40">{tr.shop_specs}</p>
              </div>
              {specs.map((spec, i) => (
                <div key={i} className={`flex items-center justify-between px-5 py-3 ${i < specs.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <span className="font-body text-xs text-white/40">{spec.label}</span>
                  <span className="font-body text-xs font-semibold text-white/80 text-right max-w-48">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Award, text: tr.shop_approved },
                { icon: Shield, text: tr.shop_quality },
                { icon: Truck, text: tr.shop_delivery },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-white/40">
                  <b.icon size={14} className="text-accent" />
                  <span className="font-body text-xs">{b.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-heading text-4xl text-white mb-8">{tr.shop_related}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.id} to={`/boutique/${p.id}`} className="group block">
                  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-accent/40 transition-all hover:-translate-y-1">
                    <div className="aspect-square overflow-hidden bg-white/5 flex items-center justify-center">
                      <img src={p.img} alt={p.name} className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500 max-h-[300px]" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-lg text-white group-hover:text-accent transition-colors">{p.name}</h3>
                      <span className="font-heading text-xl text-accent">{formatPrice(p.price, lang)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}