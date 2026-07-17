import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import tr from '../../lib/translations';
import { api } from '../../api/client';

const CATEGORIES = ['Tactiques', 'Règles', 'Rencontres', 'Général', 'Équipement'];
const CATEGORY_LABELS = {
  'Tactiques': { fr: 'Tactiques', en: 'Tactics' },
  'Règles': { fr: 'Règles', en: 'Rules' },
  'Rencontres': { fr: 'Rencontres', en: 'Meetings' },
  'Général': { fr: 'Général', en: 'General' },
  'Équipement': { fr: 'Équipement', en: 'Equipment' },
};

export default function NewTopicModal({ onClose, onSave }) {
  const [form, setForm] = useState({ title: '', category: 'Général', content: '', author_name: '', city: '' });
  const [saving, setSaving] = useState(false);
  const { lang } = useLang();
  const t = tr[lang];

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.forum.createTopic(form);
      onSave();
    } catch (err) {
      console.error('Failed to create topic:', err);
      alert(t.forum_error_create + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#0f2c1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-heading text-2xl text-white">{t.forum_new_topic_title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{t.forum_topic_category}</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-accent/50 transition-colors">
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0f2c1e]">{CATEGORY_LABELS[c][lang]}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{t.forum_topic_your_name}</label>
              <Input required value={form.author_name} onChange={e => set('author_name', e.target.value)}
                placeholder="Prénom Nom" className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
            </div>
          </div>

          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{t.forum_topic_title}</label>
            <Input required value={form.title} onChange={e => set('title', e.target.value)}
              placeholder={lang === 'en' ? 'E.g. How to optimise the Shooter\'s placement?' : 'Ex : Comment optimiser le placement du Tireur ?'}
              className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
          </div>

          {form.category === 'Rencontres' && (
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{t.forum_topic_city}</label>
              <Input value={form.city} onChange={e => set('city', e.target.value)}
                placeholder="Ex : Yaoundé, Douala..." className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
            </div>
          )}

          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{t.forum_topic_content}</label>
            <Textarea required value={form.content} onChange={e => set('content', e.target.value)}
              placeholder={lang === 'en' ? 'Describe your question, idea or proposal...' : 'Décrivez votre question, idée ou proposition...'}
              rows={5} className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="font-body text-sm text-white/40 hover:text-white transition-colors">{t.forum_topic_cancel}</button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body text-sm font-bold px-6 py-2.5 rounded-lg transition-all disabled:opacity-40">
              <Send size={14} /> {saving ? '...' : t.forum_topic_publish}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}