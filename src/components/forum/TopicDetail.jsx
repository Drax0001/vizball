import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, MessageCircle, Pin, Lock, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useLang } from '../../lib/LanguageContext';
import { getDateLocale } from '../../lib/dateLocale';
import tr from '../../lib/translations';
import { api } from '../../api/client';

const categoryColors = {
  'Tactiques':  'bg-secondary/20 text-secondary border-secondary/30',
  'Règles':     'bg-accent/20 text-accent border-accent/30',
  'Rencontres': 'bg-white/10 text-white/80 border-white/20',
  'Général':    'bg-accent/15 text-accent/80 border-accent/20',
  'Équipement': 'bg-white/10 text-white/60 border-white/15',
};

function ReplyBubble({ reply, index, dateLocale }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0 font-heading text-accent text-lg">
        {(reply.author_name || 'A')[0].toUpperCase()}
      </div>
      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
          <span className="font-body text-sm font-bold text-white">{reply.author_name}</span>
          <span className="font-body text-xs text-white/30">
            {format(new Date(reply.created_date), 'd MMM yyyy · HH:mm', { locale: dateLocale })}
          </span>
        </div>
        <p className="font-body text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
      </div>
    </motion.div>
  );
}

export default function TopicDetail({ topic, onBack }) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ author_name: '', content: '' });
  const [sending, setSending] = useState(false);
  const { lang } = useLang();
  const t = tr[lang];
  const dateLocale = getDateLocale(lang);

  const loadReplies = async () => {
    setLoading(true);
    try {
      const data = await api.forum.getReplies(topic.id);
      setReplies(data);
    } catch (err) {
      console.error('Failed to fetch topic replies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReplies();
  }, [topic.id]);

  const handleReply = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.forum.createReply(topic.id, form);
      setForm({ author_name: '', content: '' });
      loadReplies();
    } catch (err) {
      console.error('Failed to create reply:', err);
      alert(t.forum_error_reply + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <button onClick={onBack} className="inline-flex items-center gap-2 font-body text-sm text-white/40 hover:text-white transition-colors group">
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> {t.forum_back}
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6">
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`text-xs font-body font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${categoryColors[topic.category] || categoryColors['Général']}`}>
              {topic.category}
            </span>
            {topic.pinned && <span className="flex items-center gap-1 text-accent text-xs font-body"><Pin size={11} /> {t.forum_pinned}</span>}
            {topic.closed && <span className="flex items-center gap-1 text-white/40 text-xs font-body"><Lock size={11} /> {t.forum_closed}</span>}
            {topic.city && <span className="flex items-center gap-1 text-white/40 text-xs font-body"><MapPin size={11} /> {topic.city}</span>}
          </div>
          <h1 className="font-heading text-3xl text-white mb-4">{topic.title}</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-heading text-accent text-lg shrink-0">
              {(topic.author_name || 'A')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-body text-sm font-bold text-white">{topic.author_name || t.forum_anonymous}</p>
              <p className="font-body text-xs text-white/30">{format(new Date(topic.created_date), 'd MMMM yyyy', { locale: dateLocale })}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="font-body text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{topic.content}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-heading text-xl text-white mb-5 flex items-center gap-2">
          <MessageCircle size={18} className="text-accent" />
          {replies.length} {t.forum_replies}
        </h3>
        {loading ? (
          <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" /></div>
        ) : replies.length === 0 ? (
          <p className="font-body text-sm text-white/30 text-center py-8">{t.forum_no_replies}</p>
        ) : (
          <div className="space-y-4">
            {replies.map((r, i) => <ReplyBubble key={r.id} reply={r} index={i} dateLocale={dateLocale} />)}
          </div>
        )}
      </div>

      {!topic.closed ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h4 className="font-heading text-lg text-white mb-5">{t.forum_your_reply}</h4>
          <form onSubmit={handleReply} className="space-y-4">
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{t.forum_reply_name}</label>
              <Input required value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                placeholder="Prénom Nom" className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
            </div>
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-white/40 block mb-2">{t.forum_topic_content}</label>
              <Textarea required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder={t.forum_reply_placeholder} rows={4} className="bg-white/5 border-white/15 text-white placeholder-white/20 focus:border-accent/50" />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={sending}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body text-sm font-bold px-6 py-2.5 rounded-lg transition-all disabled:opacity-40">
                <Send size={14} /> {sending ? '...' : t.forum_reply_submit}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center py-8 border border-white/10 rounded-2xl">
          <Lock size={24} className="text-white/20 mx-auto mb-2" />
          <p className="font-body text-sm text-white/30">{t.forum_closed_no_replies}</p>
        </div>
      )}
    </div>
  );
}