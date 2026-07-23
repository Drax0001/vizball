import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';

const faqs = [
  {
    q: { fr: "Combien de joueurs participent à un match de Vizball ?", en: 'How many players take part in a Vizball match?' },
    a: { fr: "Un match oppose deux équipes : une équipe de 4 joueurs (les tireurs + passeur ou configuration équivalente) et une équipe de 5 joueurs. Les deux équipes permutent leurs positions après chaque manche.", en: 'A match pits two teams against each other: a team of 4 players (Shooters + Playmaker or an equivalent setup) and a team of 5 players. The two teams swap positions after each period.' }
  },
  {
    q: { fr: "Combien de manches dure un match et quelle est leur durée ?", en: 'How many periods does a match last and how long are they?' },
    a: { fr: "Un match se joue en 4 manches de 15 minutes chacune, séparées par une pause d'1 minute. Après chaque manche, les deux équipes échangent leurs positions.", en: 'A match is played in 4 periods of 15 minutes each, separated by a 1-minute break. After each period, the two teams swap positions.' }
  },
  {
    q: { fr: "Comment marque-t-on des points au Vizball ?", en: 'How do you score points in Vizball?' },
    a: { fr: "Les tireurs marquent 2 points en atteignant la cible avec une balle de tir, à condition que chacun soit dans son cercle périphérique respectif au moment du tir. En cas de faute, une pénalité appelée CLAQUE vaut 1 point.", en: 'Shooters score 2 points by hitting the Target with a shooting ball, provided each of them is in their respective peripheral circle at the moment of the shot. In the event of a foul, a penalty called the CLAQUE is worth 1 point.' }
  },
  {
    q: { fr: "Peut-on jouer avec les pieds au Vizball ?", en: 'Can you play with your feet in Vizball?' },
    a: { fr: "Oui, mais de manière encadrée. Les attaquants peuvent contrôler la balle avec les pieds (footplay) uniquement lorsque la balle de catch touche le sol dans la zone de duel. La défense se fait alors comme au football pendant cette phase.", en: 'Yes, but in a controlled way. Attackers may control the ball with their feet ("footplay") only when the catch ball touches the ground in the duel zone. Defence during this phase is then conducted as in football.' }
  },
  {
    q: { fr: "Qu'est-ce que la Crosspass ?", en: 'What is the Crosspass?' },
    a: { fr: "La Crosspass est la passe effectuée par le passeur vers les attaquants (ou inversement). Lorsque le passeur envoie la Crosspass aux attaquants, les tireurs arrêtent de tirer sur la cible. Si les attaquants renvoient la balle au passeur, les tireurs peuvent recommencer.", en: 'The Crosspass is the pass made by the Playmaker to the Attackers (or vice versa). Once the Playmaker sends the Crosspass to the Attackers, the Shooters stop shooting at the Target. If the Attackers send the ball back to the Playmaker, the Shooters may resume.' }
  },
  {
    q: { fr: "Combien de ballons sont utilisés pendant un match ?", en: 'How many balls are used during a match?' },
    a: { fr: "Le Vizball se joue avec 12 ballons : des balles de tir (3 par tireur dans leur bac) et des balles de catch. Une seule balle de tir à la fois peut circuler dans la zone de tir.", en: "Vizball is played with 12 balls: shooting balls (3 per Shooter in their tray) and catch balls. Only one shooting ball at a time may be in circulation in the shooting zone." }
  },
  {
    q: { fr: "Quelles sont les fautes les plus courantes ?", en: 'What are the most common fouls?' },
    a: { fr: "Les fautes correspondent au non-respect des règles T1 (positionnement tireurs), T4 (une seule balle de tir), C1 (zone cible), P1 (position passeur), A1 (zone attaquants), A3 (footplay) et G3 (tacles, coups, injures interdits).", en: 'Fouls correspond to a failure to respect rules T1 (Shooter positioning), T4 (only one shooting ball), C1 (Target zone), P1 (Playmaker position), A1 (Attacker zone), A3 (footplay), and G3 (tackles, blows, insults forbidden).' }
  },
  {
    q: { fr: "Qu'est-ce qu'une CLAQUE ?", en: 'What is a CLAQUE?' },
    a: { fr: "La CLAQUE est la pénalité infligée lors d'une faute. Il s'agit d'un coup donné sur la balle avec la paume de main ouverte, à 8 mètres de la plaque (similaire au service smash au volley-ball). Elle vaut 1 point, chaque équipe l'effectue avec son propre ballon.", en: 'The CLAQUE is the penalty imposed for a foul. It is a strike on the ball with an open palm, from 8 metres from the plate (similar to a volleyball smash serve). It is worth 1 point, and each team performs it with their own ball.' }
  },
  {
    q: { fr: "Combien de remplacements sont autorisés par manche ?", en: 'How many substitutions are allowed per period?' },
    a: { fr: "Chaque équipe n'a droit qu'à un seul remplacement par manche. Après un but marqué, les équipes peuvent se réorganiser en intervertissant des postes ou en effectuant ce remplacement.", en: 'Each team is only allowed one substitution per period. After a goal is scored, teams may reorganise by swapping positions or making that substitution.' }
  },
  {
    q: { fr: "Quelle est la taille du terrain de Vizball ?", en: 'What is the size of a Vizball field?' },
    a: { fr: "Le terrain officiel du Vizball mesure 48 × 24 mètres. Il est divisé en plusieurs zones : zone de tir (avec cercle central et cercles périphériques), interzone, et zone de duel.", en: 'The official Vizball field measures 48 × 24 metres. It is divided into several zones: the shooting zone (with a central circle and peripheral circles), the interzone, and the duel zone.' }
  },
];

function FaqItem({ item, index, lang }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-border rounded-xl overflow-hidden bg-card"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors gap-4"
      >
        <div className="flex items-start gap-3">
          <HelpCircle size={18} className="text-accent shrink-0 mt-0.5" />
          <span className="font-body font-semibold text-sm text-foreground">{item.q[lang]}</span>
        </div>
        <ChevronDown
          size={18}
          className={`text-accent shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-11 border-t border-border/50">
              <p className="font-body text-sm text-muted-foreground leading-relaxed pt-4">{item.a[lang]}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="font-subtitle text-sm uppercase tracking-widest text-secondary">{tr.faq_badge}</span>
          <h2 className="text-[hsl(var(--chart-3))] mt-3 mb-3 text-4xl font-heading sm:text-5xl">{tr.faq_title}</h2>
          <p className="font-body text-muted-foreground mb-10">
            {tr.faq_subtitle}
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FaqItem key={i} item={item} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}