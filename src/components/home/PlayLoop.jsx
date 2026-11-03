import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';
import t from '../../lib/translations';
import FieldLines from '../field/FieldLines';
import { GEO } from '../field/geometry';
import { RevealText } from '../motion/Reveal';
import { useLenis } from '../motion/SmoothScroll';
import { useMediaQuery } from '@/hooks/use-media-query';
import { EASE_OUT } from '@/lib/motion';

const STEPS = 5;
// Scroll stops shared by every actor; each beat owns a fifth of the scroll.
const S = [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.88, 0.95, 1];
const C1 = GEO.peripheral[0];
const C2 = GEO.peripheral[1];
const C3 = GEO.peripheral[2];

// Field positions (metres) at each stop in S.
const ACTORS = {
  shooterA: { team: 5, path: [C1, C1, C1, C3, C3, C3, C3, C3, C3, C3, C3] },
  shooterB: { team: 5, path: [C2, C2, C2, C1, C1, C1, C1, C1, C1, C1, C1] },
  shooterC: { team: 5, path: [C3, C3, C3, C2, C2, C2, C2, C2, C2, C2, C2] },
  defenderA: { team: 5, path: [[36, 8], [36, 8], [36, 8], [36, 8], [36, 8], [36, 8], [35, 8.6], [33.6, 9.3], [32.6, 10.2], [32.6, 10.2], [32.6, 10.2]] },
  defenderB: { team: 5, path: [[36, 16], [36, 16], [36, 16], [36, 16], [36, 16], [36, 16], [35, 15], [34, 14], [33, 13.2], [33, 13.2], [33, 13.2]] },
  target: { team: 4, ring: true, path: [[12, 12], [12, 12], [10.6, 13.4], [11, 15.5], [12, 20], [13, 17.2], [12.6, 15], [12.6, 15], [12.6, 15], [12.6, 15], [12.6, 15]] },
  playmaker: { team: 4, path: [[20.5, 7], [20.5, 7], [20.5, 7], [20.5, 7], [20.3, 8], [20.5, 7.4], [20.5, 7.4], [20.5, 7.4], [20.5, 7.4], [20.5, 7.4], [20.5, 7.4]] },
  attackerA: { team: 4, path: [[28, 8], [28, 8], [28, 8], [28, 8], [28, 8], [27.4, 8.6], [28, 8.4], [28, 8.4], [30.4, 11], [30.6, 11.2], [30.6, 11.2]] },
  attackerB: { team: 4, path: [[28, 16], [28, 16], [28, 16], [28, 16], [28, 16], [28, 16], [28.5, 15], [29, 14.6], [30, 14.4], [30, 14.4], [30, 14.4]] },
};
const SHOT_BALL = [[12, 3.9], [12, 3.9], [10.2, 12.6], [5, 16], [5, 16], [5, 16], [5, 16], [5, 16], [5, 16], [5, 16], [5, 16]];
const CATCH_BALL = [[12, 21], [12, 21], [12, 21], [12, 21], [12, 20.5], [20.5, 7.4], [28.4, 8.4], [28.4, 8.4], [30.9, 11], [47.7, 12], [47.7, 12]];

function useTrack(progress, path, p) {
  const pts = path.map(([x, y]) => p(x, y));
  const cx = useTransform(progress, S, pts.map((v) => v[0]));
  const cy = useTransform(progress, S, pts.map((v) => v[1]));
  return { cx, cy };
}

function Actor({ progress, actor, p }) {
  const { cx, cy } = useTrack(progress, actor.path, p);
  const fill = actor.team === 4 ? 'hsl(var(--accent))' : 'hsl(var(--brand-red))';
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={0.62}
      fill={fill}
      stroke={actor.ring ? 'hsl(var(--chalk))' : 'hsl(var(--pitch))'}
      strokeWidth={actor.ring ? 0.22 : 0.14}
    />
  );
}

function Ball({ progress, path, p, r, fill, stroke }) {
  const { cx, cy } = useTrack(progress, path, p);
  return <motion.circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={0.14} />;
}

// A pass or shot line that draws during its window, then fades.
function Trail({ progress, from, to, window: [a, b], p, color = 'hsl(var(--accent))' }) {
  const length = useTransform(progress, [a, b], [0, 1]);
  const opacity = useTransform(progress, [a - 0.01, a, b + 0.08, b + 0.16], [0, 0.9, 0.9, 0.25]);
  const [x1, y1] = p(...from);
  const [x2, y2] = p(...to);
  return (
    <motion.path
      d={`M${x1} ${y1} L${x2} ${y2}`}
      stroke={color}
      strokeWidth={0.12}
      strokeLinecap="round"
      style={{ pathLength: length, opacity }}
    />
  );
}

function ScorePop({ progress, at, label, window: [a, b], p }) {
  const opacity = useTransform(progress, [a, a + 0.02, b, b + 0.03], [0, 1, 1, 0]);
  const scale = useTransform(progress, [a, a + 0.03], [0.6, 1]);
  const [x, y] = p(...at);
  return (
    <motion.text
      x={x}
      y={y}
      textAnchor="middle"
      fontFamily="Fester, sans-serif"
      fontWeight="900"
      fontSize={2.6}
      fill="hsl(var(--accent))"
      style={{ opacity, scale, transformBox: 'fill-box', transformOrigin: 'center' }}
    >
      {label}
    </motion.text>
  );
}

export default function PlayLoop() {
  const { lang } = useLang();
  const tr = t[lang];
  const ref = useRef(null);
  const lenis = useLenis();
  const portrait = useMediaQuery('(max-width: 767px)');
  const orient = portrait ? 'v' : 'h';
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setStep(Math.min(STEPS - 1, Math.max(0, Math.floor(v * STEPS))));
  });

  const steps = [1, 2, 3, 4, 5].map((n) => ({ title: tr[`play_${n}_t`], desc: tr[`play_${n}_d`] }));

  const goTo = (i) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const y = top + span * ((i + 0.5) / STEPS);
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="pitch-2 relative h-[520vh]" aria-labelledby="play-title">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-6 pt-24 md:pb-10 md:pt-28">
        <div className="shell flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <RevealText id="play-title" text={tr.play_title} className="display text-[clamp(2rem,4.6vw,4.5rem)]" />
          <p className="max-w-sm text-sm text-chalk/65 md:text-base">{tr.play_intro}</p>
        </div>

        <div className="shell mt-5 grid min-h-0 flex-1 gap-5 md:mt-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] md:gap-12">
          {/* Narration */}
          <div className="order-2 flex min-h-0 flex-col justify-between gap-5 md:order-1">
            <ol className="flex gap-1.5" aria-label={tr.play_title}>
              {steps.map((s, i) => (
                <li key={i} className="flex-1">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={step === i ? 'step' : undefined}
                    aria-label={`${i + 1}. ${s.title}`}
                    className="group block w-full py-2 text-left"
                  >
                    <span className={`block h-[3px] rounded-full transition-colors duration-500 ${i <= step ? 'bg-accent' : 'bg-chalk/15 group-hover:bg-chalk/35'}`} />
                  </button>
                </li>
              ))}
            </ol>

            <div className="relative min-h-[9.5rem] md:min-h-[16rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                  transition={{ duration: 0.55, ease: EASE_OUT }}
                  aria-live="polite"
                >
                  <p className="display tabular text-[clamp(3rem,7vw,6rem)] text-accent">
                    {step + 1}
                    <span className="text-chalk/25">/{STEPS}</span>
                  </p>
                  <h3 className="display mt-2 text-[clamp(1.6rem,2.6vw,2.6rem)]">{steps[step].title}</h3>
                  <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-chalk/75 md:text-lg">{steps[step].desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <ul className="hidden flex-wrap gap-x-6 gap-y-2 text-sm text-chalk/70 md:flex">
              <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-brand-red" />{tr.play_team5}</li>
              <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-accent" />{tr.play_team4}</li>
            </ul>
          </div>

          {/* Field */}
          <div className="relative order-1 flex min-h-0 items-center justify-center md:order-2">
            <FieldLines
              orient={orient}
              draw="view"
              duration={1.4}
              zoneTint
              highlight={step === 4 ? ['z3'] : []}
              labels={{ shooting: tr.field_label_shooting, duel: tr.field_label_duel }}
              className="h-full max-h-full w-full text-chalk/60"
              under={(p) => <GreatCircleGlow p={p} active={step === 1 || step === 2} />}
            >
              {(p) => (
                <g>
                  <Trail progress={scrollYProgress} from={C1} to={[5, 16]} window={[0.2, 0.4]} p={p} color="hsl(var(--chalk))" />
                  <Trail progress={scrollYProgress} from={[12, 20.5]} to={[20.5, 7.4]} window={[0.5, 0.6]} p={p} />
                  <Trail progress={scrollYProgress} from={[20.5, 7.4]} to={[28.4, 8.4]} window={[0.6, 0.7]} p={p} />
                  <Trail progress={scrollYProgress} from={[30.9, 11]} to={[47.7, 12]} window={[0.88, 0.95]} p={p} />
                  {Object.entries(ACTORS).map(([k, a]) => (
                    <Actor key={k} progress={scrollYProgress} actor={a} p={p} />
                  ))}
                  <Ball progress={scrollYProgress} path={SHOT_BALL} p={p} r={0.3} fill="hsl(var(--chalk))" stroke="hsl(var(--brand-red))" />
                  <Ball progress={scrollYProgress} path={CATCH_BALL} p={p} r={0.38} fill="hsl(var(--chalk))" stroke="hsl(var(--accent))" />
                  <ScorePop progress={scrollYProgress} at={[43.5, 8]} label="+3" window={[0.94, 0.995]} p={p} />
                </g>
              )}
            </FieldLines>
          </div>
        </div>

        <div className="shell mt-4 md:mt-6">
          <div className="h-px w-full bg-chalk/10">
            <motion.div className="h-px bg-accent" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function GreatCircleGlow({ p, active }) {
  const [cx, cy] = p(GEO.greatCircle.cx, GEO.greatCircle.cy);
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={GEO.greatCircle.r}
      fill="hsl(var(--accent))"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 0.1 : 0 }}
      transition={{ duration: 0.6 }}
    />
  );
}
