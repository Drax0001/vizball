import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Target, Crosshair, Shield, ChevronRight, ChevronDown, Search, Filter, Play, BookOpen, Dumbbell, Scale } from 'lucide-react';
import FaqSection from '../components/rules/FaqSection';
import VideoCard from '../components/tutorials/VideoCard';
import FeaturedVideo from '../components/tutorials/FeaturedVideo';
import VideoPlayer from '../components/tutorials/VideoPlayer';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';
import { CATEGORY_LABELS, LEVEL_LABELS } from '../lib/tutorialLabels';
import { api } from '../api/client';

const VIDEO_CATEGORIES = [
  { label: 'Tous', icon: Play },
  { label: 'Gestes Techniques', icon: Crosshair },
  { label: 'Placements Tactiques', icon: Users },
  { label: 'Entraînements', icon: Dumbbell },
  { label: 'Règles & Arbitrage', icon: Scale },
];
const LEVELS = ['Tous les niveaux', 'Débutant', 'Intermédiaire', 'Avancé'];

const avantPartie = [
  { fr: 'La cible doit se trouver dans le cercle central', en: 'The Target must be in the central circle' },
  { fr: 'Chaque tireur doit être dans son cercle périphérique', en: 'Each Shooter must be in their peripheral circle' },
  { fr: 'Le passeur doit être dans l\'interzone', en: 'The Playmaker must be in the interzone' },
  { fr: 'Les défenseurs et les attaquants doivent se positionner dans la zone de duel', en: 'Defenders and Attackers must position themselves in the duel zone' },
  { fr: 'Les balles de catch doivent être fixées sur les supports', en: 'Catch balls must be fixed on their supports' },
  { fr: 'Il doit avoir 3 balles de tir dans le bac de chaque tireur', en: 'There must be 3 shooting balls in each Shooter\'s tray' },
  { fr: 'Un seul tireur doit avoir la balle de tir à main', en: 'Only one Shooter may hold a shooting ball at a time' },
  { fr: 'La plaque du butoir doit être parallèle à la ligne de fond', en: 'The backstop plate must be parallel to the back line' },
  { fr: 'Une équipe doit être en 5 et l\'autre en 4', en: 'One team must have 5 players and the other 4' },
  { fr: 'Les joueurs ne doivent pas avoir sur eux des objets pouvant blesser', en: 'Players must not carry any objects that could cause injury' }];

const rulesSections = [
  {
    title: { fr: 'I — Règles sur les Tireurs (T)', en: 'I — Rules for Shooters (T)' },
    rules: [
      { code: 'T1', title: { fr: 'Positionnement', en: 'Positioning' }, desc: { fr: 'Les tireurs se font les passes ou tirent seulement lorsqu\'ils sont dans leur cercle respectif.', en: 'Shooters may only pass to each other or shoot while in their respective circle.' } },
      { code: 'T2', title: { fr: 'Déplacement après chaque tir', en: 'Movement after each shot' }, desc: { fr: 'Après chaque tir vers la cible, les 3 tireurs doivent se déplacer chacun vers le cercle périphérique de l\'autre. Ainsi, un tireur occupe un cercle périphérique par tir.', en: 'After each shot at the Target, all 3 Shooters must move to another peripheral circle. This way, a Shooter occupies one peripheral circle per shot.' } },
      { code: 'T3', title: { fr: 'Validité du tir', en: 'Validity of a shot' }, desc: { fr: 'Un tir est valide si et seulement si les 3 tireurs sont dans leurs cercles périphériques respectifs.', en: 'A shot is valid if and only if all 3 Shooters are in their respective peripheral circles.' } },
      { code: 'T4', title: { fr: 'Diffusion des balles de tir', en: 'Circulation of shooting balls' }, desc: { fr: 'Une seule balle de tir a le droit de circuler dans la zone de tir.', en: 'Only one shooting ball may be in circulation in the shooting zone at a time.' } },
      { code: 'T5', title: { fr: 'Balle de tir reposant sur la zone', en: 'Ball resting in the zone' }, desc: { fr: 'Si une balle de tir se trouve dans le grand cercle, un des tireurs s\'il veut, pourra aller la récupérer pendant que l\'action se déroule.', en: 'If a shooting ball ends up in the big circle, a Shooter may go and retrieve it while play continues.' } },
      { code: 'T6', title: { fr: 'Réserve des balles de tir', en: 'Reserve of shooting balls' }, desc: { fr: 'L\'équipe en 5 doit prévoir des ramasseurs de balles, considérés comme leurs remplaçants, afin que leur réserve ne soit pas vide.', en: 'The team of 5 must provide ball collectors, considered their substitutes, so their reserve is never empty.' } },
      { code: 'T7', title: { fr: 'Arrêt de l\'activité dans la zone de tir', en: 'Stopping activity in the shooting zone' }, desc: { fr: 'Les tireurs arrêtent de tirer sur la cible lorsque le passeur envoie la balle de catch aux attaquants.', en: 'Shooters stop shooting at the Target once the Playmaker sends the catch ball to the Attackers.' } },
      { code: 'T8', title: { fr: 'Passe entre les tireurs', en: 'Passing between Shooters' }, desc: { fr: 'Les tireurs peuvent se faire des passes pour des raisons de feintes. Pour celà, ils n\'ont pas le droit de sortir de leurs cercles respectifs.', en: 'Shooters may pass to each other as feints. To do so, they may not leave their respective circles.' } },
      { code: 'T9', title: { fr: 'But marqué par les tireurs', en: 'Goal scored by Shooters' }, desc: { fr: 'Les tireurs marquent 2 points lorsqu\'ils parviennent à atteindre avec une balle de tir la cible, en étant tous chacun dans leurs cercles respectifs, avant que la balle de catch ne soit envoyé par le passeur aux attaquants.', en: 'Shooters score 2 points when they hit the Target with a shooting ball while all three are in their respective circles, before the Playmaker sends the catch ball to the Attackers.' } },
      { code: 'T10', title: { fr: 'La Crosspass', en: 'The Crosspass' }, desc: { fr: 'Si les attaquants renvoient la balle de catch au passeur, les tireurs peuvent recommencer à tirer sur la cible, jusqu\'à ce que le passeur réeffectue la crosspass vers les attaquants.', en: 'If the Attackers send the catch ball back to the Playmaker, Shooters may resume shooting at the Target until the Playmaker performs the crosspass to the Attackers again.' } }]
  },
  {
    title: { fr: 'II — Règles sur la Cible (C)', en: 'II — Rules for the Target (C)' },
    rules: [
      { code: 'C1', title: { fr: 'Zone de circulation', en: 'Movement zone' }, desc: { fr: 'La zone de circulation de la cible est uniquement le grand cercle.', en: 'The Target\'s only movement zone is the big circle.' } },
      { code: 'C2', title: { fr: 'La décharge', en: 'The release' }, desc: { fr: 'La décharge désigne la passe que la cible effectue au passeur. Elle peut se faire avec toutes les parties du corps.', en: 'The release is the pass the Target makes to the Playmaker. It may be done with any part of the body.' } }]
  },
  {
    title: { fr: 'III — Règles sur le Passeur (P)', en: 'III — Rules for the Playmaker (P)' },
    rules: [
      { code: 'P1', title: { fr: 'Position du passeur', en: 'Playmaker\'s position' }, desc: { fr: 'Le passeur circule uniquement dans l\'interzone. Il ne doit se trouver ni dans le grand cercle, ni dans la zone de duel.', en: 'The Playmaker moves only within the interzone. They must never be in the big circle or the duel zone.' } },
      { code: 'P2', title: { fr: 'Crosspass (1)', en: 'Crosspass (1)' }, desc: { fr: 'Elle désigne la passe effectuée par le passeur vers les attaquants, et vice-versa.', en: 'This is the pass made by the Playmaker to the Attackers, and vice versa.' } },
      { code: 'P3', title: { fr: 'Crosspass (2)', en: 'Crosspass (2)' }, desc: { fr: 'Si les attaquants renvoient la balle de catch au passeur, les tireurs peuvent recommencer à tirer sur la cible, jusqu\'à ce que le passeur réeffectue la crosspass vers les attaquants.', en: 'If the Attackers send the catch ball back to the Playmaker, Shooters may resume shooting at the Target until the Playmaker performs the crosspass to the Attackers again.' } },
      { code: 'P4', title: { fr: 'Crosspass (3)', en: 'Crosspass (3)' }, desc: { fr: 'Le passeur peut faire la crosspass avec n\'importe quelle partie du corps.', en: 'The Playmaker may perform the crosspass with any part of the body.' } }]
  },
  {
    title: { fr: 'IV — Règles sur les Attaquants (A)', en: 'IV — Rules for Attackers (A)' },
    rules: [
      { code: 'A1', title: { fr: 'Position des attaquants', en: 'Attackers\' position' }, desc: { fr: 'Ils circulent uniquement dans la zone de duel. Ils ne doivent pas se retrouver dans la zone de tir.', en: 'Attackers move only within the duel zone. They must never end up in the shooting zone.' } },
      { code: 'A2', title: { fr: 'Contrôle de balle', en: 'Ball control' }, desc: { fr: 'Après réception de la crosspass, les attaquants se déplacent avec la balle à main, sans contrôle spécial jusqu\'à l\'atteinte du butoir.', en: 'After receiving the crosspass, Attackers move with the ball in hand, with no special control, until reaching the backstop.' } },
      { code: 'A3', title: { fr: 'Contrôle avec les pieds : le « footplay »', en: 'Foot control: the "footplay"' }, desc: { fr: 'Les attaquants contrôlent la balle avec les pieds si la balle de catch touche le sol dans la zone de duel.', en: 'Attackers control the ball with their feet if the catch ball touches the ground in the duel zone.' } },
      { code: 'A4', title: { fr: 'Clôture du footplay', en: 'Ending the footplay' }, desc: { fr: 'Les attaquants peuvent mettre un terme au footplay, en ramassant la balle avec la main. L\'attaquant est alors obligé de tirer sur la plaque avec maximum 3 pas à faire.', en: 'Attackers may end the footplay by picking up the ball with their hand. The Attacker must then shoot at the plate within a maximum of 3 steps.' } },
      { code: 'A5', title: { fr: 'Temps de jeu en zone de duel', en: 'Playing time in the duel zone' }, desc: { fr: 'Lorsque les attaquants reçoivent la balle de catch dans la zone de duel, ils ont 27 secondes de jeu. Au-delà, la partie est annulée et reprise dans la zone de tir.', en: 'Once Attackers receive the catch ball in the duel zone, they have 27 seconds of play. Beyond that, the play is cancelled and restarted in the shooting zone.' } }]
  },
  {
    title: { fr: 'V — Règles sur les Défenseurs (D)', en: 'V — Rules for Defenders (D)' },
    rules: [
      { code: 'D1', title: { fr: 'Défense en zone de duel (1)', en: 'Defence in the duel zone (1)' }, desc: { fr: 'Les défenseurs doivent chercher à récupérer la balle de catch des attaquants ou à retarder ces derniers jusqu\'à l\'expiration des 27 secondes allouées à cette zone.', en: 'Defenders must try to recover the catch ball from the Attackers or delay them until the 27 seconds allotted to this zone expire.' } },
      { code: 'D2', title: { fr: 'Défense en zone de duel (2)', en: 'Defence in the duel zone (2)' }, desc: { fr: 'Lorsque les attaquants contrôlent la balle avec la main, la défense se fait par le blocage du passage, l\'interception de la passe ou du tir.', en: 'While Attackers control the ball with their hand, defence is done by blocking the path, or intercepting the pass or shot.' } },
      { code: 'D3', title: { fr: 'Défense lors du « footplay » (3)', en: 'Defence during "footplay" (3)' }, desc: { fr: 'Lorsque les attaquants contrôlent la balle avec les pieds, la défense envers les attaquants se fait comme au football.', en: 'While Attackers control the ball with their feet, defence against them is done as in football.' } }]
  },
  {
    title: { fr: 'VI — Règles Générales (G)', en: 'VI — General Rules (G)' },
    rules: [
      { code: 'G1', title: { fr: 'Sur un but marqué', en: 'On a goal scored' }, desc: { fr: 'Après chaque but marqué la partie se relance normalement, et l\'arbitre s\'assure que les conditions initiales d\'entames sont respectées.', en: 'After each goal, play resumes normally, and the referee ensures the initial starting conditions are respected.' } },
      { code: 'G2', title: { fr: 'Réorganisation après but', en: 'Reorganisation after a goal' }, desc: { fr: 'Après un but marqué, chaque équipe peut se réorganiser en intervertissant les postes ou en effectuant des remplacements.', en: 'After a goal, each team may reorganise by swapping positions or making substitutions.' } },
      { code: 'G3', title: { fr: 'Gestes interdits', en: 'Forbidden actions' }, desc: { fr: 'Les tacles, les coups, les obstructions, les placages, les jets volontaires de la balle hors de l\'aire de jeu, et les injures sont interdits.', en: 'Tackles, blows, obstruction, tackling to the ground, deliberately throwing the ball out of play, and insults are forbidden.' } },
      { code: 'G4', title: { fr: 'Remplacements', en: 'Substitutions' }, desc: { fr: 'Chaque équipe n\'a droit qu\'à un seul remplacement par manche.', en: 'Each team is only allowed one substitution per period.' } },
      { code: 'G5', title: { fr: 'Phases du match', en: 'Match phases' }, desc: { fr: 'Un match se joue en 4 manches de 15mn intercalées chacune par une pause de 1mn. Après chaque manche il y a permutation des positions des 2 équipes.', en: 'A match is played in 4 periods of 15 minutes, each separated by a 1-minute break. After each period, the two teams swap positions.' } }]
  }];

const positions = [
{
  title: { fr: 'Les Tireurs (3)', en: 'The Shooters (3)' },
  icon: Crosshair,
  desc: { fr: 'Les tireurs se font les passes ou tirent seulement lorsqu\'ils sont dans leur cercle respectif. Après chaque tir vers la cible, les 3 tireurs doivent se déplacer chacun vers le cercle périphérique de l\'autre.', en: 'Shooters only pass to each other or shoot while in their respective circle. After each shot at the Target, all 3 Shooters must move to another peripheral circle.' },
  color: 'bg-accent/10 text-accent border-accent/20'
},
{
  title: { fr: 'La Cible (1)', en: 'The Target (1)' },
  icon: Target,
  desc: { fr: 'La cible doit essayer de ramasser la balle de catch sans se faire toucher par la balle de tir des tireurs, et l\'envoyer au passeur. Sa zone de circulation est uniquement le grand cercle.', en: 'The Target must try to pick up the catch ball without being hit by the Shooters\' balls, then send it to the Playmaker. Their only movement zone is the big circle.' },
  color: 'bg-secondary/10 text-secondary border-secondary/20'
},
{
  title: { fr: 'Le Passeur (1)', en: 'The Playmaker (1)' },
  icon: Users,
  desc: { fr: 'Le passeur circule uniquement dans l\'interzone. Il ne doit se trouver ni dans le grand cercle, ni dans la zone de duel. Il effectue la crosspass vers les attaquants.', en: 'The Playmaker moves only within the interzone. They must never be in the big circle or the duel zone. They perform the crosspass to the Attackers.' },
  color: 'bg-accent/10 text-accent border-accent/20'
},
{
  title: { fr: 'Les Attaquants', en: 'The Attackers' },
  icon: ChevronRight,
  desc: { fr: 'Ils circulent uniquement dans la zone de duel. Après réception de la crosspass, les attaquants se déplacent avec la balle à main jusqu\'à l\'atteinte du butoir.', en: 'They move only within the duel zone. After receiving the crosspass, Attackers move with the ball in hand until reaching the backstop.' },
  color: 'bg-secondary/10 text-secondary border-secondary/20'
},
{
  title: { fr: 'Les Défenseurs', en: 'The Defenders' },
  icon: Shield,
  desc: { fr: 'Les défenseurs doivent chercher à récupérer la balle de catch des attaquants ou à retarder ces derniers jusqu\'à l\'expiration des 27 secondes allouées.', en: 'Defenders must try to recover the catch ball from the Attackers or delay them until the allotted 27 seconds expire.' },
  color: 'bg-accent/10 text-accent border-accent/20'
}];


function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className={className}>
      
      {children}
    </motion.div>);
}

function RuleAccordion({ title, rules, lang }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 bg-card hover:bg-muted transition-colors text-left">

        <h3 className="font-heading text-xl text-foreground">{title[lang]}</h3>
        <ChevronDown size={20} className={`text-accent transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open &&
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="px-5 pb-5 space-y-3">

          {rules.map((rule, i) =>
        <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
              <span className="font-body text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded shrink-0">{rule.code}</span>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{rule.title[lang]}</p>
                <p className="font-body text-sm text-muted-foreground mt-1 leading-relaxed">{rule.desc[lang]}</p>
              </div>
            </div>
        )}
        </motion.div>
      }
    </div>);
}

function TutorielsSection() {
  const { lang } = useLang();
  const tr = t[lang];
  const [videos, setVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeLevel, setActiveLevel] = useState('Tous les niveaux');
  const [search, setSearch] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    api.tutorials.list().then(setVideos).catch((err) => console.error('Failed to load tutorials:', err));
  }, []);

  const featuredVideo = videos.find((v) => v.featured);
  const filtered = videos.filter((v) => {
    const matchCat = activeCategory === 'Tous' || v.category === activeCategory;
    const matchLevel = activeLevel === 'Tous les niveaux' || v.level === activeLevel;
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) || v.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchLevel && matchSearch;
  });
  const showFeatured = featuredVideo && activeCategory === 'Tous' && !search && activeLevel === 'Tous les niveaux';

  return (
    <section className="py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <span className="font-body text-sm font-bold uppercase tracking-widest text-secondary">{tr.tutoriels_badge}</span>
          <h2 className="text-accent mt-3 mb-3 text-4xl font-heading sm:text-5xl">{tr.tutoriels_title}{tr.tutoriels_title2}</h2>
          <p className="font-body text-white/60">{tr.tutoriels_subtitle}</p>
        </AnimatedSection>

        {/* Featured */}
        {showFeatured && (
          <AnimatedSection className="mb-12">
            <FeaturedVideo video={featuredVideo} onClick={() => setSelectedVideo(featuredVideo)} />
          </AnimatedSection>
        )}

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            {VIDEO_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-body text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeCategory === cat.label ? 'bg-accent text-primary border-accent' : 'bg-white/5 text-white/70 border-white/10 hover:border-accent/40 hover:text-white'
                }`}>
                <cat.icon size={14} />{CATEGORY_LABELS[cat.label][lang]}
              </button>
            ))}
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tr.tutoriels_search} className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <select value={activeLevel} onChange={(e) => setActiveLevel(e.target.value)} className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2.5 font-body text-sm text-white appearance-none focus:outline-none focus:border-accent/50 transition-colors cursor-pointer">
                {LEVELS.map((l) => <option key={l} value={l} className="bg-[#1B4332] text-white">{LEVEL_LABELS[l][lang]}</option>)}
              </select>
            </div>
          </div>
        </div>

        <p className="font-body text-sm text-white/40 mb-6"><span className="text-accent font-bold">{filtered.length}</span> {filtered.length > 1 ? tr.tutoriels_results : tr.tutoriels_result}</p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-white/20 mx-auto mb-4" />
            <p className="font-heading text-2xl text-white/30">{tr.tutoriels_no_results}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showFeatured ? videos.filter((v) => !v.featured) : filtered).map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} onClick={() => setSelectedVideo(video)} />
            ))}
          </div>
        )}
      </div>
      {selectedVideo && <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </section>
  );
}

export default function LeSport() {
  const { lang } = useLang();
  const tr = t[lang];
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src="https://media.base44.com/images/public/69ebbc425ff9fc8f11d3960b/e19c13cfa_generated_a282d46d.png"
          alt="Vizball en action"
          className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="font-body text-sm font-bold uppercase tracking-widest text-accent">Vizball</span>
              <h1 className="text-[hsl(var(--background))] mt-2 text-6xl font-heading sm:text-7xl md:text-8xl">{tr.sport_title}</h1>
              <p className="font-body text-lg text-white/70 max-w-lg mt-4">
                {tr.sport_subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="font-body text-sm font-bold uppercase tracking-widest text-secondary">{lang === 'en' ? 'Overview' : 'Présentation'}</span>
                <h2 className="text-[hsl(var(--chart-3))] mt-3 mb-6 text-5xl font-heading">{lang === 'en' ? 'A UNIQUE SPORT' : 'UN SPORT UNIQUE'}</h2>
                <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                  <p>
                    {lang === 'en'
                      ? "VizBall is a team sport played mainly with the hands and sometimes the feet. When the referee blows the whistle to start play, the Shooters try to hit the Target with the shooting ball."
                      : "Le VizBall est un sport collectif qui se joue à l'aide des mains et parfois des pieds. Lorsque l'arbitre siffle le début de la partie, les Tireurs essaient d'atteindre la cible avec la balle de tir."}
                  </p>
                  <p>
                    {lang === 'en'
                      ? "The Target, meanwhile, must try to pick up the catch ball without being hit by the Shooters' balls, and send it to the Playmaker, who then passes it on to the Attackers."
                      : "La cible quant à elle doit essayer de ramasser la balle de catch sans se faire toucher par la balle de tir des tireurs, et l'envoyer au passeur, qui se chargera de la retransmettre aux attaquants."}
                  </p>
                  <p>
                    {lang === 'en'
                      ? "The Attackers, in turn, try to shoot the ball they've received onto the backstop plate, while being challenged by the Defenders from the opposing team."
                      : "Les attaquants à leur tour se chargeront de shooter la balle qu'ils ont reçue sur la plaque du butoir, mais seront cependant gênés par les défenseurs, appartenant à l'équipe adverse."}
                  </p>
                  <p>
                    {lang === 'en'
                      ? "After 15 minutes of play (a period), there is a 30-second break. When the next period resumes, the two teams swap positions on the field, with one team going to 5 players and the other to 4."
                      : "Après 15mn de jeu (manche), il y a une pause de 30s. À la reprise de la manche suivante, les deux équipes permutent de positionnement sur le terrain. L'une se retrouvant en 5 et l'autre en 4."}
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://media.base44.com/images/public/69ebbc425ff9fc8f11d3960b/e974c8229_generated_27869450.png"
                  alt="Match de Vizball"
                  className="rounded-lg w-full h-[450px] object-cover" />

                <div className="absolute -bottom-4 -left-4 bg-primary text-white p-5 rounded-lg">
                  <span className="font-heading text-3xl text-accent">{tr.sport_field_dims}</span>
                  <p className="font-body text-xs uppercase tracking-wider mt-1">{tr.sport_field_dims_label}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Zones du terrain */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-[hsl(var(--background))] text-sm font-bold uppercase tracking-widest">{tr.sport_field_title}</span>
            <h2 className="text-[hsl(var(--sidebar-ring))] mt-3 text-5xl font-heading sm:text-6xl">{tr.sport_zones_title}</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="bg-white/5 border border-white/10 rounded-lg p-8">
                <h3 className="font-heading text-3xl text-accent mb-4">{tr.sport_zone_tir}</h3>
                <ul className="space-y-3 font-body text-sm text-white/70">
                  <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span>{tr.sport_zone_tir_1}</li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span>{tr.sport_zone_tir_2}</li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span>{tr.sport_zone_tir_3}</li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span>{tr.sport_zone_tir_4}</li>
                </ul>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="bg-white/5 border border-white/10 rounded-lg p-8">
                <h3 className="font-heading text-3xl text-accent mb-4">{tr.sport_zone_duel}</h3>
                <ul className="space-y-3 font-body text-sm text-white/70">
                  <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span>{tr.sport_zone_duel_1}</li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span>{tr.sport_zone_duel_2}</li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span>{tr.sport_zone_duel_3}</li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span>{tr.sport_zone_duel_4}</li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-1">•</span>{tr.sport_zone_duel_5}</li>
                </ul>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection className="mt-12">
            <div className="relative rounded-lg overflow-hidden">
              <div className="w-full h-64 md:h-96 bg-gray-900" />

              <div className="absolute inset-0 bg-primary/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="font-heading text-6xl md:text-8xl text-white">{tr.sport_field_dims}</span>
                  <p className="font-body text-sm text-white/70 uppercase tracking-wider mt-2">{tr.sport_field_dims_official}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Postes des joueurs */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="font-body text-sm font-bold uppercase tracking-widest text-secondary">{tr.sport_positions_section_badge}</span>
            <h2 className="text-[hsl(var(--accent))] mt-3 text-5xl font-heading sm:text-6xl">{tr.sport_positions_title} {tr.sport_positions_title2}</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {positions.map((pos, i) =>
            <AnimatedSection key={i}>
                <div className={`p-6 rounded-lg border ${pos.color} h-full`}>
                  <pos.icon size={28} className="mb-4" />
                  <h3 className="font-heading text-2xl text-foreground mb-3">{pos.title[lang]}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{pos.desc[lang]}</p>
                </div>
              </AnimatedSection>
            )}
          </div>

        </div>
      </section>

      {/* Avant la partie */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-[hsl(var(--chart-3))] mt-2 mb-8 text-4xl font-heading sm:text-5xl">{tr.sport_avant_partie_title}</h2>
            <p className="font-body text-muted-foreground mb-6">
              {tr.sport_avant_partie_intro}
            </p>
            <div className="space-y-3">
              {avantPartie.map((item, i) =>
              <div key={i} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-body text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="font-body text-sm text-foreground">{item[lang]}</p>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pendant la partie */}
      <section className="py-24 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-[hsl(var(--accent))] mt-2 mb-8 text-4xl font-heading sm:text-5xl">{tr.sport_pendant_partie_title}</h2>
          </AnimatedSection>

          <div className="space-y-4">
            {rulesSections.map((section, i) =>
            <AnimatedSection key={i}>
                <RuleAccordion title={section.title} rules={section.rules} lang={lang} />
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

      {/* Fautes et Pénalités */}
      <section className="py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-[hsl(var(--accent))] mt-2 mb-8 text-4xl font-heading sm:text-5xl">{tr.sport_fautes_title}</h2>

            <div className="bg-white/5 border border-white/10 rounded-lg p-8">
              <p className="font-body text-white/80 leading-relaxed mb-4">
                {tr.sport_fautes_intro} <span className="text-accent font-semibold">T1, T4, C1, P1, A1, A3, G3</span>
              </p>
              <p className="font-body text-white/80 leading-relaxed mb-6">
                {tr.sport_fautes_penalty}
              </p>
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="font-body text-accent font-semibold text-sm">
                  {tr.sport_fautes_claque_value}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* Tutoriels */}
      <TutorielsSection />

      {/* Le Corps Arbitral */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <span className="font-body text-sm font-bold uppercase tracking-widest text-secondary">{tr.sport_arbitral_badge}</span>
            <h2 className="text-[hsl(var(--chart-3))] mt-3 mb-8 text-4xl font-heading sm:text-5xl">{tr.sport_arbitral_title}</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-10">
              {tr.sport_arbitral_intro}
            </p>
          </AnimatedSection>

          {/* Les 4 officiels */}
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {[
              {
                code: 'AC',
                title: { fr: "L'Arbitre Central", en: 'The Central Referee' },
                color: 'bg-accent/10 border-accent/30 text-accent',
                desc: { fr: "Officiel coordinateur positionné sur la Ligne Médiane. Seul à avoir une vision simultanée des deux zones. Il siffle, valide les points, gère les litiges et supervise l'ensemble de la partie. Voix prépondérante en cas de désaccord.", en: 'The coordinating official, positioned on the Midline. The only one with a simultaneous view of both zones. They blow the whistle, validate points, settle disputes, and oversee the whole match. Has the deciding voice in case of disagreement.' }
              },
              {
                code: 'AZT',
                title: { fr: "L'Arbitre de Zone de Tir", en: 'The Shooting Zone Referee' },
                color: 'bg-primary/10 border-primary/30 text-primary',
                desc: { fr: "Stationné en bordure de la zone de tir. Surveille le respect des règles T (positionnement des tireurs, validité des tirs, rotation entre cercles) et la circulation des balles. Signale les fautes par gestes officiels.", en: 'Stationed at the edge of the shooting zone. Monitors compliance with the T rules (Shooter positioning, shot validity, rotation between circles) and ball circulation. Signals fouls using official gestures.' }
              },
              {
                code: 'AZD',
                title: { fr: "L'Arbitre de Zone de Duel", en: 'The Duel Zone Referee' },
                color: 'bg-secondary/10 border-secondary/30 text-secondary',
                desc: { fr: "Positionné en bordure de la zone de duel. Surveille les règles A et D (attaquants, défenseurs), la régularité du footplay, le chronomètre des 27 secondes et les contacts physiques. Signale les fautes par gestes officiels.", en: 'Positioned at the edge of the duel zone. Monitors the A and D rules (Attackers, Defenders), the legality of the footplay, the 27-second clock, and physical contact. Signals fouls using official gestures.' }
              },
              {
                code: 'ACH',
                title: { fr: "L'Arbitre de Chrono", en: 'The Timekeeper Referee' },
                color: 'bg-muted border-border text-muted-foreground',
                desc: { fr: "Gère le temps officiel du match (4 manches de 15 min, pauses d'1 min) et le chrono des 27 secondes en zone de duel. Il signale les fins de période et synchronise son chrono avec l'AC. Peut assister en tant que 4e arbitre de terrain.", en: "Manages the match's official time (4 periods of 15 min, 1-min breaks) and the 27-second clock in the duel zone. Signals the end of periods and synchronises their clock with the Central Referee. May assist as a 4th on-field referee." }
              }
            ].map((official, i) => (
              <AnimatedSection key={i}>
                <div className={`border rounded-xl p-6 h-full ${official.color.split(' ').slice(0,2).join(' ')}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`font-heading text-lg px-3 py-1 rounded-full bg-background border ${official.color.split(' ').slice(1).join(' ')}`}>
                      {official.code}
                    </span>
                    <h3 className="font-heading text-xl text-foreground">{official.title[lang]}</h3>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{official.desc[lang]}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Gestes officiels */}
          <AnimatedSection>
            <div className="bg-muted rounded-xl p-8">
              <h3 className="font-heading text-2xl text-foreground mb-6">{tr.sport_arbitral_gestures_title}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { geste: { fr: 'Bras tendu, index pointé vers le haut', en: 'Arm extended, index finger pointed up' }, signification: { fr: 'Point validé', en: 'Point validated' } },
                  { geste: { fr: 'Deux bras croisés devant la poitrine', en: 'Both arms crossed over the chest' }, signification: { fr: 'Faute signalée', en: 'Foul signalled' } },
                  { geste: { fr: 'Bras horizontal, paume ouverte vers le sol', en: 'Arm horizontal, palm open toward the ground' }, signification: { fr: 'Jeu arrêté (stop)', en: 'Play stopped' } },
                  { geste: { fr: 'Main levée, 5 doigts tendus', en: 'Hand raised, 5 fingers extended' }, signification: { fr: 'Claque accordée', en: 'CLAQUE awarded' } },
                  { geste: { fr: 'Index pointé vers le cercle fautif', en: 'Index finger pointed at the offending circle' }, signification: { fr: 'Tireur hors position', en: 'Shooter out of position' } },
                  { geste: { fr: 'Rotation des avant-bras', en: 'Forearms rotating' }, signification: { fr: 'Reprise du jeu', en: 'Play resumes' } },
                  { geste: { fr: 'Sifflet long + bras vertical', en: 'Long whistle + arm vertical' }, signification: { fr: 'Fin de manche', en: 'End of period' } },
                  { geste: { fr: 'Sifflet court + geste de chrono', en: 'Short whistle + timing gesture' }, signification: { fr: 'Chrono 27s déclenché', en: '27s clock started' } },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <div>
                      <p className="font-body text-xs font-bold text-foreground">{item.signification[lang]}</p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5 italic">{item.geste[lang]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Principes */}
          <AnimatedSection className="mt-8">
            <div className="bg-primary rounded-xl p-8">
              <h3 className="font-heading text-2xl text-accent mb-4">{tr.sport_arbitral_principles_title}</h3>
              <ul className="space-y-3">
                {[
                  { fr: "Chaque officiel est souverain dans son territoire — aucun chevauchement de compétences.", en: 'Each official has sole authority within their territory — no overlap of responsibilities.' },
                  { fr: "L'Arbitre Central a autorité finale sur l'ensemble du terrain et des décisions.", en: 'The Central Referee has final authority over the whole field and all decisions.' },
                  { fr: "Les décisions arbitrales sont définitives et immédiatement applicables.", en: 'Refereeing decisions are final and take effect immediately.' },
                  { fr: "Tout officiel peut signaler une faute grave (violence, insulte) quel que soit son territoire.", en: 'Any official may report a serious offence (violence, insults) regardless of their territory.' },
                  { fr: "Le Corps Arbitral doit être nommé avant le début de chaque rencontre officielle.", en: 'The refereeing body must be appointed before the start of every official match.' }
                ].map((p, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm text-white/80">
                    <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">{i + 1}</span>
                    {p[lang]}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>);

}