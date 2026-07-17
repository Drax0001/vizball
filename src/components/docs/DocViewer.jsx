import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Calendar, Tag, ExternalLink } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

export default function DocViewer({ doc, onClose }) {
  const { lang } = useLang();
  const tr = t[lang];
  if (!doc) return null;

  const handleDownload = () => {
    if (doc.fileUrl) {
      const a = document.createElement('a');
      a.href = doc.fileUrl;
      a.target = '_blank';
      a.download = doc.title + '.pdf';
      a.click();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-2xl bg-[#0f2c1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-white/10 bg-white/3">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
                <doc.icon size={26} className="text-accent" />
              </div>
              <div>
                <span className="font-body text-xs font-bold uppercase tracking-wider text-accent">{doc.pillar}</span>
                <h2 className="font-heading text-2xl text-white mt-1 leading-tight">{doc.title}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-white/10">
            {[
              { icon: Tag, label: doc.category },
              { icon: Calendar, label: doc.year || '2024' },
              { icon: FileText, label: doc.pages ? `${doc.pages} pages` : tr.doc_pdf },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                <m.icon size={12} className="text-accent" />
                <span className="font-body text-xs text-white/60">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="px-6 py-6">
            <h3 className="font-body text-xs font-bold uppercase tracking-wider text-white/40 mb-3">{tr.doc_about}</h3>
            <p className="font-body text-sm text-white/70 leading-relaxed mb-4">{doc.desc}</p>
            {doc.content && (
              <div className="space-y-2 mt-4">
                <h3 className="font-body text-xs font-bold uppercase tracking-wider text-white/40 mb-3">{tr.doc_content}</h3>
                {doc.content.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <span className="font-body text-sm text-white/60">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4 px-6 py-5 border-t border-white/10 bg-white/3">
            <button
              onClick={onClose}
              className="font-body text-sm text-white/40 hover:text-white transition-colors"
            >
              {tr.doc_close}
            </button>
            <div className="flex gap-3">
              {doc.fileUrl && (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-white/20 hover:border-accent/40 text-white/70 hover:text-white font-body text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
                >
                  <ExternalLink size={15} /> {tr.doc_open}
                </a>
              )}
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body text-sm font-bold px-6 py-2.5 rounded-lg transition-all"
              >
                <Download size={15} /> {tr.doc_download}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}