import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Scale, BookOpen, Shield, TrendingUp,
  FileText, ScrollText, Award, Handshake,
  Users, Gavel, ClipboardList, BarChart3,
  Heart, Star, Globe, Briefcase,
  ChevronDown, Search, Download } from
'lucide-react';
import DocCard from '../components/docs/DocCard';
import DocViewer from '../components/docs/DocViewer';
import GouvernanceTeamSection from '../components/gouvernance/TeamSection';
import { api } from '../api/client';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';

// Document icons aren't stored server-side (React components don't serialize
// through JSON) — matched back onto fetched documents by category instead.
const ICONS_BY_CATEGORY = {
  'Gouvernance': Gavel,
  'Propriété Intellectuelle': Handshake,
  'Héritage & Pérennité': Award,
  'Règles du Jeu': BookOpen,
  'Ingénierie Sportive': ClipboardList,
  'Compétition': Gavel,
  'Protection & Sécurité': Heart,
  'Intégrité': Shield,
  'Responsabilité Sociale': Users,
  'Stratégie': TrendingUp,
  'Impact & RSE': BarChart3,
  'Partenariat': Briefcase,
};

// ─── Données des documents ─────────────────────────────────────────────────

const PILLARS = [
{
  id: 'institutionnel',
  icon: Scale,
  label: { fr: 'Pilier 1', en: 'Pillar 1' },
  title: { fr: 'Institutionnel', en: 'Institutional' },
  subtitle: { fr: 'Gouvernance & Droits', en: 'Governance & Rights' },
  color: 'from-secondary/30 to-secondary/5',
  borderColor: 'border-secondary/40',
  iconColor: 'text-secondary',
  bgIcon: 'bg-secondary/20',
  desc: { fr: 'Documents fondateurs qui prouvent la structuration légale de l\'organisation et la protection des droits de propriété intellectuelle du Fondateur.', en: 'Founding documents proving the legal structuring of the organisation and the protection of the Founder\'s intellectual property rights.' }
},
{
  id: 'technique',
  icon: BookOpen,
  label: { fr: 'Pilier 2', en: 'Pillar 2' },
  title: { fr: 'Technique & Sportif', en: 'Technical & Sporting' },
  subtitle: { fr: 'Intégrité du Jeu', en: 'Integrity of the Game' },
  color: 'from-accent/30 to-accent/5',
  borderColor: 'border-accent/40',
  iconColor: 'text-accent',
  bgIcon: 'bg-accent/20',
  desc: { fr: 'Documents qui attestent que le Vizball est un sport codifié, mature et prêt pour la compétition internationale.', en: 'Documents attesting that Vizball is a codified, mature sport ready for international competition.' }
},
{
  id: 'ethique',
  icon: Shield,
  label: { fr: 'Pilier 3', en: 'Pillar 3' },
  title: { fr: 'Éthique & Social', en: 'Ethics & Social' },
  subtitle: { fr: 'Crédibilité Bailleurs', en: 'Funder Credibility' },
  color: 'from-white/10 to-white/3',
  borderColor: 'border-white/20',
  iconColor: 'text-white/80',
  bgIcon: 'bg-white/10',
  desc: { fr: 'Documents de responsabilité sociale indispensables pour les bailleurs de fonds et partenaires institutionnels.', en: 'Social responsibility documents essential for funders and institutional partners.' }
},
{
  id: 'vision',
  icon: TrendingUp,
  label: { fr: 'Pilier 4', en: 'Pillar 4' },
  title: { fr: 'Vision & Développement', en: 'Vision & Development' },
  subtitle: { fr: 'Transparence', en: 'Transparency' },
  color: 'from-accent/20 to-secondary/10',
  borderColor: 'border-accent/30',
  iconColor: 'text-accent',
  bgIcon: 'bg-accent/15',
  desc: { fr: 'Documents stratégiques pour convaincre les investisseurs et montrer la trajectoire de croissance du Vizball.', en: 'Strategic documents to convince investors and show Vizball\'s growth trajectory.' }
}];


// Documents now come from GET /api/governance-documents (see loadDocuments below).


// ─── Composants utilitaires ────────────────────────────────────────────────

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}>
      
      {children}
    </motion.div>);

}

function PillarHeader({ pillar, count, lang }) {
  return (
    <div className={`flex items-center gap-4 p-6 rounded-xl bg-gradient-to-br ${pillar.color} border ${pillar.borderColor} mb-6`}>
      <div className={`w-14 h-14 rounded-xl ${pillar.bgIcon} flex items-center justify-center shrink-0`}>
        <pillar.icon size={26} className={pillar.iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`font-subtitle text-xs uppercase tracking-widest ${pillar.iconColor}`}>{pillar.label[lang]}</span>
          <span className="font-body text-xs text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">{count} documents</span>
        </div>
        <h3 className="font-heading text-3xl text-white mt-0.5">{pillar.title[lang]}</h3>
        <p className="font-body text-xs text-white/50 uppercase tracking-wider">{pillar.subtitle[lang]}</p>
      </div>
    </div>);

}

// ─── Page principale ───────────────────────────────────────────────────────

export default function Gouvernance() {
  const { lang } = useLang();
  const tr = t[lang];
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePillar, setActivePillar] = useState('tous');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const data = await api.governanceDocuments.list();
        setDocuments(data.map((d) => ({ ...d, icon: ICONS_BY_CATEGORY[d.category] || FileText })));
      } catch (err) {
        console.error('Failed to load governance documents:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDocuments();
  }, []);

  const filteredDocs = documents.filter((d) => {
    const matchPillar = activePillar === 'tous' || d.pillarId === activePillar;
    const q = search.toLowerCase();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
    return matchPillar && matchSearch;
  });

  const totalAvailable = documents.filter((d) => d.status === 'disponible').length;

  return (
    <div className="min-h-screen bg-primary">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* BG pattern */}
        <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(43,75%,49%) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
              <Scale size={14} className="text-accent" />
              <span className="font-body text-xs font-bold uppercase tracking-wider text-accent">{tr.gov_espace}</span>
            </div>
            <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl text-white leading-none mb-6">
              {tr.gov_title}<br /><span className="text-[hsl(var(--background))]">{tr.gov_title2}</span>
            </h1>
            <p className="font-body text-lg text-white/60 max-w-2xl leading-relaxed mb-10">
              {tr.gov_subtitle}
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6">
              {[
              { value: `${documents.length}`, label: tr.gov_stat_documents },
              { value: `${totalAvailable}`, label: tr.gov_stat_available },
              { value: '4', label: tr.gov_stat_pillars }].
              map((s, i) =>
              <div key={i} className="text-center">
                  <span className="font-heading text-4xl text-accent">{s.value}</span>
                  <p className="font-body text-xs text-white/40 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Sticky Filter Bar ── */}
      <div className="sticky top-20 z-30 bg-primary/95 backdrop-blur-md border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Pillar tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActivePillar('tous')}
                className={`px-4 py-2 rounded-full font-body text-xs font-bold uppercase tracking-wider border transition-all ${
                activePillar === 'tous' ?
                'bg-accent text-primary border-accent' :
                'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'}`
                }>

                {tr.gov_pillar_all}
              </button>
              {PILLARS.map((p) =>
              <button
                key={p.id}
                onClick={() => setActivePillar(p.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-body text-xs font-bold uppercase tracking-wider border transition-all ${
                activePillar === p.id ?
                'bg-accent text-primary border-accent' :
                'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'}`
                }>

                  <p.icon size={12} />
                  {p.title[lang]}
                </button>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tr.gov_search}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-8 pr-4 py-2 font-body text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition-colors" />

            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Result count */}
        <div className="mb-8 flex items-center justify-between">
          <p className="font-body text-sm text-white/30">
            <span className="text-accent font-bold">{filteredDocs.length}</span> {tr.gov_displayed}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-body text-xs text-white/40">{tr.gov_legend_available}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-body text-xs text-white/40">{tr.gov_legend_soon}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="font-body text-xs text-white/40">{tr.gov_legend_request}</span>
            </div>
          </div>
        </div>

        {/* By pillar layout */}
        {loading ?
        <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div> :
        activePillar === 'tous' && !search ?
        <div className="space-y-16">
            {PILLARS.map((pillar) => {
            const docs = documents.filter((d) => d.pillarId === pillar.id);
            return (
              <AnimatedSection key={pillar.id}>
                  {/* Pillar description */}
                  <PillarHeader pillar={pillar} count={docs.length} lang={lang} />
                  <p className="font-body text-sm text-white/50 leading-relaxed mb-6 max-w-3xl">{pillar.desc[lang]}</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {docs.map((doc, i) =>
                  <DocCard key={doc.id} doc={doc} index={i} onClick={setSelectedDoc} />
                  )}
                  </div>
                </AnimatedSection>);

          })}
          </div> :
        filteredDocs.length === 0 ?
        <div className="text-center py-24">
            <FileText size={48} className="text-white/15 mx-auto mb-4" />
            <p className="font-heading text-2xl text-white/25">{tr.gov_no_results}</p>
            <p className="font-body text-sm text-white/20 mt-2">{tr.gov_no_results_desc}</p>
          </div> :

        <AnimatedSection>
            {activePillar !== 'tous' &&
          <PillarHeader
            pillar={PILLARS.find((p) => p.id === activePillar)}
            count={filteredDocs.length}
            lang={lang} />

          }
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc, i) =>
            <DocCard key={doc.id} doc={doc} index={i} onClick={setSelectedDoc} />
            )}
            </div>
          </AnimatedSection>
        }

        {/* CTA bottom */}
        <AnimatedSection className="mt-20">
          <div className="relative rounded-2xl overflow-hidden border border-accent/20 bg-gradient-to-br from-accent/10 to-secondary/5 p-10 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <Globe size={36} className="text-[hsl(var(--background))] mb-4 mx-auto lucide lucide-globe" />
            <h3 className="text-[hsl(var(--accent))] mb-3 text-4xl font-heading">{tr.gov_cta_title}</h3>
            <p className="font-body text-sm text-white/50 max-w-md mx-auto mb-6 leading-relaxed">
              {tr.gov_cta_desc}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-body font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-lg transition-all">

              <Download size={16} /> {tr.gov_cta_button}
            </a>
          </div>
        </AnimatedSection>
      </div>

      {/* ── Team Section ── */}
      <GouvernanceTeamSection />

      {/* ── Doc Viewer Modal ── */}
      {selectedDoc &&
      <DocViewer doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      }
    </div>);

}