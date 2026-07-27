import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import { api } from '../api/client';

// contentType: 'article' | 'forum_topic' | 'forum_reply' | 'event'
// fields: { [key: string]: string } — the untranslated source strings
// onResult: (translatedFieldsOrNull) => void — called with the translated
//   object when a translation is showing, or null when reverted to original
export default function TranslateButton({ contentType, contentId, fields, onResult, compact = false }) {
  const { lang } = useLang();
  const tr = t[lang];
  const [status, setStatus] = useState('idle'); // idle | loading | translated | error
  const [showingOriginal, setShowingOriginal] = useState(false);
  const [translated, setTranslated] = useState(null);

  if (lang === 'fr') return null;

  const handleTranslate = async () => {
    setStatus('loading');
    try {
      const res = await api.translate.run({ contentType, contentId, targetLang: lang, fields });
      setTranslated(res.translated);
      setShowingOriginal(false);
      setStatus('translated');
      onResult?.(res.translated);
    } catch (err) {
      console.error('Translation failed:', err);
      setStatus('error');
    }
  };

  const toggleOriginal = () => {
    const next = !showingOriginal;
    setShowingOriginal(next);
    onResult?.(next ? null : translated);
  };

  if (status === 'loading') {
    return (
      <span className="inline-flex items-center gap-2 font-body text-xs text-white/50">
        <span className="w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        {tr.translate_loading}
      </span>
    );
  }

  if (status === 'translated') {
    return (
      <span className="inline-flex items-center gap-2 font-body text-xs text-white/50">
        <Languages size={13} className="text-accent" />
        {!compact && tr.translate_translated_label}
        <button type="button" onClick={toggleOriginal} className="underline hover:text-white transition-colors">
          {showingOriginal ? tr.translate_show_translation : tr.translate_show_original}
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleTranslate}
      className="inline-flex items-center gap-1.5 font-body text-xs font-bold uppercase tracking-wider text-accent hover:text-white transition-colors"
    >
      <Languages size={13} />
      {!compact && tr.translate_button}
      {status === 'error' && <span className="text-red-400 normal-case font-normal ml-1">{tr.translate_error}</span>}
    </button>
  );
}
