import React, { useState } from 'react';
import { X, Upload, Save, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { api } from '@/api/client';
import { useLang } from '@/lib/LanguageContext';
import t from '@/lib/translations';

const CATEGORIES = ['Événement', 'Tournoi', 'Portrait', 'Actualité', 'Communiqué'];
const CATEGORY_LABELS = {
  'Événement': { fr: 'Événement', en: 'Event' },
  'Tournoi': { fr: 'Tournoi', en: 'Tournament' },
  'Portrait': { fr: 'Portrait', en: 'Portrait' },
  'Actualité': { fr: 'Actualité', en: 'News' },
  'Communiqué': { fr: 'Communiqué', en: 'Press release' },
};

function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ArticleEditor({ article, onSave, onClose }) {
  const { lang } = useLang();
  const tr = t[lang];
  const isEdit = !!article?.id;
  const [form, setForm] = useState({
    title: article?.title || '',
    category: article?.category || 'Actualité',
    status: article?.status || 'brouillon',
    cover_image: article?.cover_image || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    author_name: article?.author_name || '',
    published_at: article?.published_at || new Date().toISOString().split('T')[0],
    featured: article?.featured || false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploads.upload(file);
      set('cover_image', url);
    } catch (err) {
      console.error('Error uploading image:', err);
      alert(tr.admin_upload_error + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (status) => {
    setSaving(true);
    try {
      const payload = { ...form, status };
      if (isEdit) {
        await api.articles.update(article.id, payload);
      } else {
        await api.articles.create(payload);
      }
      onSave();
    } catch (err) {
      console.error('Error saving article:', err);
      alert(tr.editor_save_error + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 overflow-y-auto p-4 flex items-start justify-center">
      <div className="w-full max-w-3xl bg-[#0f2c1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-heading text-2xl text-white">{isEdit ? tr.editor_edit_article : tr.editor_new_article}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.admin_label_title_req}</label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder={tr.editor_title_placeholder} className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
          </div>

          {/* Category + Author */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.admin_th_category}</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 font-body text-sm text-white focus:outline-none focus:border-accent/50 transition-colors">
                {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0f2c1e]">{CATEGORY_LABELS[c][lang]}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.admin_th_author}</label>
              <Input value={form.author_name} onChange={(e) => set('author_name', e.target.value)} placeholder={tr.editor_author_placeholder} className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
            </div>
          </div>

          {/* Date + Featured */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.editor_pub_date}</label>
              <Input type="date" value={form.published_at} onChange={(e) => set('published_at', e.target.value)} className="bg-white/5 border-white/15 text-white focus:border-accent/50" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => set('featured', !form.featured)} className={`w-12 h-6 rounded-full transition-colors relative ${form.featured ? 'bg-accent' : 'bg-white/15'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.featured ? 'translate-x-7' : 'translate-x-1'}`} />
                </div>
                <span className="font-body text-sm text-white/60">{tr.editor_featured_toggle}</span>
              </label>
            </div>
          </div>

          {/* Cover image */}
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.editor_cover_image}</label>
            <div className="flex gap-3 items-start">
              <Input value={form.cover_image} onChange={(e) => set('cover_image', e.target.value)} placeholder="https://..." className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50 flex-1" />
              <label className={`flex items-center gap-2 px-4 py-2 border border-white/15 rounded-md font-body text-xs text-white/60 hover:border-accent/40 hover:text-white transition-all cursor-pointer shrink-0 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload size={14} />
                {uploading ? tr.admin_uploading : tr.admin_upload}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {form.cover_image && (
              <div className="mt-3 rounded-lg overflow-hidden h-32 border border-white/10">
                <img src={form.cover_image} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.editor_excerpt}</label>
            <Textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder={tr.editor_excerpt_placeholder} rows={2} className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
          </div>

          {/* Content */}
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{tr.forum_topic_content}</label>
            <Textarea value={form.content} onChange={(e) => set('content', e.target.value)} placeholder={tr.editor_content_placeholder} rows={12} className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50 font-body text-sm leading-relaxed" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-t border-white/10">
          <button onClick={onClose} className="font-body text-sm text-white/40 hover:text-white transition-colors">{tr.admin_cancel}</button>
          <div className="flex gap-3">
            <button onClick={() => handleSave('brouillon')} disabled={saving || !form.title} className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-body text-sm font-semibold px-5 py-2.5 rounded-lg transition-all disabled:opacity-40">
              <Save size={14} /> {tr.editor_draft}
            </button>
            <button onClick={() => handleSave('publié')} disabled={saving || !form.title || !form.content} className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body text-sm font-bold px-6 py-2.5 rounded-lg transition-all disabled:opacity-40">
              <Eye size={14} /> {tr.editor_publish}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}