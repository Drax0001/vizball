import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Lock, ChevronRight } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

const statusStyles = {
  disponible: 'bg-secondary/20 text-secondary border-secondary/30',
  'bientôt': 'bg-accent/20 text-accent border-accent/30',
  restreint: 'bg-white/10 text-white/50 border-white/20'
};

export default function DocCard({ doc, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const { lang } = useLang();
  const tr = t[lang];
  const isAvailable = doc.status === 'disponible';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => isAvailable && onClick(doc)}
      className={`group relative bg-white/5 border rounded-xl p-5 transition-all duration-400 ${
      isAvailable ?
      'border-white/10 hover:border-accent/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10 cursor-pointer' :
      'border-white/5 opacity-60'}`
      }>
      
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
        hovered && isAvailable ? 'bg-accent/30 border border-accent/50' : 'bg-white/10 border border-white/10'}`
        }>
          <doc.icon size={22} className={hovered && isAvailable ? 'text-accent' : 'text-white/60'} />
        </div>
        <span className="bg-[hsl(var(--brand-red))] text-[hsl(var(--background))] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border border-secondary/30">
          {doc.status}
        </span>
      </div>

      {/* Title & desc */}
      <h4 className={`font-heading text-lg leading-tight mb-2 transition-colors ${
      hovered && isAvailable ? 'text-accent' : 'text-white'}`
      }>
        {doc.title}
      </h4>
      <p className="font-body text-xs text-white/50 leading-relaxed mb-5 line-clamp-3">{doc.desc}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        {doc.pages &&
        <span className="font-body text-xs text-white/30">{doc.pages} pages · {tr.doc_pdf}</span>
        }
        {isAvailable ?
        <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1 text-xs font-body text-white/40 hover:text-white transition-colors">
              <Eye size={13} /> {tr.doc_consult}
            </div>
            <div className="flex items-center gap-1 text-xs font-body font-bold text-accent group-hover:gap-2 transition-all">
              <Download size={13} /> {tr.doc_pdf} <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div> :

        <div className="flex items-center gap-1 text-xs font-body text-white/30 ml-auto">
            <Lock size={12} /> {doc.status === 'restreint' ? tr.doc_on_request : tr.doc_coming_soon}
          </div>
        }
      </div>
    </motion.div>);

}