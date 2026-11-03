import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { useLang } from '../../lib/LanguageContext';
import { getDateLocale } from '../../lib/dateLocale';
import t from '../../lib/translations';
import { api } from '../../api/client';
import FieldLines from '../field/FieldLines';
import { GEO } from '../field/geometry';
import { RevealText } from '../motion/Reveal';
import { useIntroReady } from '../motion/intro';
import Cta from '../site/Cta';
import { useMediaQuery } from '@/hooks/use-media-query';
import { EASE_OUT, EASE_IN_OUT } from '@/lib/motion';
import heroThrone from '../../assets/images/vizball-throne.webp';

// First upcoming, non-cancelled event, or null.
function pickNext(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    events
      .filter((e) => e.date && e.status !== 'annulé' && parseISO(e.date) >= today)
      .sort((a, b) => parseISO(a.date) - parseISO(b.date))[0] || null
  );
}

export default function HeroSection() {
  const { lang } = useLang();
  const tr = t[lang];
  const ready = useIntroReady();
  const reduce = useReducedMotion();
  const portrait = useMediaQuery('(max-width: 767px)');
  const orient = portrait ? 'v' : 'h';
  const ref = useRef(null);
  const [next, setNext] = useState(null);

  useEffect(() => {
    api.events
      .list()
      .then((events) => setNext(pickNext(events || [])))
      .catch(() => setNext(null));
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const fieldScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);
  const wordY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);

  return (
    <section
      ref={ref}
      className="pitch relative isolate flex h-[100svh] min-h-[640px] flex-col overflow-hidden"
      aria-labelledby="hero-title"
    >
      <motion.div
        className="relative mx-[var(--gutter)] mt-[76px] min-h-0 flex-1 md:absolute md:inset-x-[var(--gutter)] md:bottom-[9vw] md:top-24 md:m-0"
        style={reduce ? undefined : { scale: fieldScale, opacity: fieldOpacity }}
      >
        {ready && (
          <FieldLines
            orient={orient}
            draw="mount"
            delay={0.25}
            duration={1.8}
            zoneTint
            preserveAspectRatio={portrait ? 'xMidYMin slice' : 'xMidYMid meet'}
            labels={null}
            className="h-full w-full text-chalk/45"
            under={(p) => <GreatCirclePhoto p={p} play={ready} />}
          >
            {(p) => <AmbientPlay p={p} />}
          </FieldLines>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-night to-transparent md:hidden" />
      </motion.div>

      <motion.div
        className="relative z-10 -mt-[0.12em] md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:flex md:items-end md:justify-between md:gap-10 md:px-[var(--gutter)] md:pb-7"
        style={reduce ? undefined : { y: wordY }}
      >
        <div>
        <h1
          id="hero-title"
          className="display whitespace-nowrap px-[calc(var(--gutter)*0.6)] text-center text-[21vw] leading-[0.8] md:px-0 md:text-left md:text-[15vw]"
        >
          <span className="sr-only">Vizball — {tr.hero_subtitle}</span>
          <span aria-hidden="true">
            <RevealText as="span" text="VIZ" trigger="mount" play={ready} delay={0.35} className="inline" />
            <RevealText as="span" text="BALL" trigger="mount" play={ready} delay={0.5} className="inline text-accent" />
          </span>
        </h1>
        <motion.p
          className="mt-5 hidden max-w-2xl text-lg leading-snug text-chalk/85 md:block lg:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE_OUT, delay: 1.1 }}
        >
          {tr.hero_subtitle}
        </motion.p>
        </div>
        <motion.div
          className="hidden shrink-0 md:block"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE_OUT, delay: 1.25 }}
        >
          <Cta to="/le-sport" tone="red" size="lg">{tr.hero_cta_discover}</Cta>
        </motion.div>
      </motion.div>

      <motion.div
        className="shell relative z-10 pb-6 pt-4 md:hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: EASE_OUT, delay: 1 }}
      >
        <p className="text-base leading-snug text-chalk/85">{tr.hero_subtitle}</p>
        <p className="label mb-5 mt-3 text-accent">
          {next ? `${tr.hero_widget_next} · ${next.title}` : `${tr.hero_widget_since} · ${tr.hero_widget_since_sub}`}
        </p>
        <Cta to="/le-sport" tone="red" size="lg" magnetic={false} className="w-full">{tr.hero_cta_discover}</Cta>
      </motion.div>

      <NextWidget next={next} ready={ready} tr={tr} lang={lang} />
    </section>
  );
}

function NextWidget({ next, ready, tr, lang }) {
  const dateLocale = getDateLocale(lang);
  return (
    <motion.aside
      className="absolute right-[var(--gutter)] top-28 z-10 hidden w-64 rounded-[14px] bg-night/80 p-5 ring-1 ring-inset ring-chalk/15 md:block"
      initial={{ opacity: 0, x: 24 }}
      animate={ready ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, ease: EASE_OUT, delay: 1.4 }}
      aria-label={next ? tr.hero_widget_next : tr.hero_widget_since}
    >
      {next ? (
        <>
          <p className="label flex items-center gap-2 text-chalk/60">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
            {tr.hero_widget_next}
          </p>
          <p className="mt-3 line-clamp-2 font-heading text-xl font-bold leading-tight text-chalk">{next.title}</p>
          <p className="mt-2 text-sm text-accent">
            {format(parseISO(next.date), 'd MMMM yyyy', { locale: dateLocale })}
            {next.city ? ` · ${next.city}` : ''}
          </p>
        </>
      ) : (
        <>
          <p className="display text-4xl text-accent">{tr.hero_widget_since}</p>
          <p className="label mt-2 text-chalk/60">{tr.hero_widget_since_sub}</p>
        </>
      )}
    </motion.aside>
  );
}

// The Target's great circle holds a photograph, opening like an iris.
function GreatCirclePhoto({ p, play }) {
  const reduce = useReducedMotion();
  const [cx, cy] = p(GEO.greatCircle.cx, GEO.greatCircle.cy);
  const r = GEO.greatCircle.r;
  return (
    <>
      <defs>
        <clipPath id="hero-gc">
          <motion.circle
            cx={cx}
            cy={cy}
            initial={{ r: reduce ? r : 0 }}
            animate={play ? { r } : {}}
            transition={{ duration: 1.6, ease: EASE_IN_OUT, delay: 0.6 }}
          />
        </clipPath>
        <radialGradient id="hero-gc-shade">
          <stop offset="55%" stopColor="hsl(153 52% 9%)" stopOpacity="0" />
          <stop offset="100%" stopColor="hsl(153 52% 9%)" stopOpacity="0.75" />
        </radialGradient>
      </defs>
      <g clipPath="url(#hero-gc)">
        <motion.image
          href={heroThrone}
          x={cx - r}
          y={cy - r}
          width={r * 2}
          height={r * 2}
          preserveAspectRatio="xMidYMid slice"
          initial={{ scale: reduce ? 1 : 1.35 }}
          animate={play ? { scale: 1 } : {}}
          transition={{ duration: 2.4, ease: EASE_OUT, delay: 0.6 }}
          style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'view-box' }}
        />
        <circle cx={cx} cy={cy} r={r} fill="url(#hero-gc-shade)" />
      </g>
    </>
  );
}

// An ambient regulation play on loop: a missed shot, the Target picks up
// the catch ball, release, crosspass, run and strike on the plate for 3.
function AmbientPlay({ p }) {
  const reduce = useReducedMotion();
  const loop = { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2.2, repeatDelay: 0.6 };
  const track = (pts) => {
    const xy = pts.map(([x, y]) => p(x, y));
    return { cx: xy.map((v) => v[0]), cy: xy.map((v) => v[1]) };
  };
  const at = (x, y) => {
    const [cx, cy] = p(x, y);
    return { cx, cy };
  };
  const times7 = [0, 0.14, 0.3, 0.42, 0.55, 0.7, 1];

  // Positions at each beat: start, shot, pickup, release, crosspass, strike, reset
  const shotBall = track([[12, 3], [5.5, 15.6], [4.2, 16.5], [4.2, 16.5], [4.2, 16.5], [4.2, 16.5], [12, 3]]);
  const target = track([[12, 12], [11, 14], [12, 19.6], [13, 18], [12.5, 15], [12, 12], [12, 12]]);
  const catchBall = track([[12, 21], [12, 21], [12, 20.2], [20.5, 7], [28.4, 8.4], [48, 12], [12, 21]]);
  const attacker = track([[28, 8], [28, 8], [28, 8], [27, 9], [28.2, 8.6], [31, 11], [28, 8]]);
  const defenderA = track([[36, 8], [36, 8], [35, 8.5], [34, 9], [33, 9.5], [33.5, 10.5], [36, 8]]);
  const defenderB = track([[36, 16], [36, 16], [35.5, 15], [34.5, 14], [34, 13], [34.5, 12.5], [36, 16]]);
  const [plusX, plusY] = p(44.5, 8.6);

  const R = 0.5;
  const team5 = 'hsl(var(--brand-red))';
  const team4 = 'hsl(var(--accent))';
  const anim = (tr) => (reduce ? {} : { animate: tr, transition: { ...loop, times: times7 } });

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}>
      {/* Team of 5: three shooters in their circles, two defenders */}
      {GEO.peripheral.map(([x, y]) => (
        <circle key={`sh-${x}`} {...at(x, y)} r={R} fill={team5} />
      ))}
      <motion.circle {...at(36, 8)} r={R} fill={team5} {...anim(defenderA)} />
      <motion.circle {...at(36, 16)} r={R} fill={team5} {...anim(defenderB)} />

      {/* Team of 4: target, playmaker, two attackers */}
      <motion.circle {...at(12, 12)} r={R} fill={team4} stroke="hsl(var(--chalk))" strokeWidth={0.15} {...anim(target)} />
      <circle {...at(...GEO.playmaker)} r={R} fill={team4} />
      <motion.circle {...at(28, 8)} r={R} fill={team4} {...anim(attacker)} />
      <circle {...at(28, 16)} r={R} fill={team4} />

      {/* Balls */}
      <motion.circle {...at(12, 3)} r={0.26} fill="hsl(var(--chalk))" stroke="hsl(var(--brand-red))" strokeWidth={0.1} {...anim(shotBall)} />
      <motion.circle {...at(12, 21)} r={0.3} fill="hsl(var(--chalk))" stroke="hsl(var(--accent))" strokeWidth={0.12} {...anim(catchBall)} />

      {!reduce && (
        <motion.text
          x={plusX}
          y={plusY}
          textAnchor="middle"
          fontFamily="Fester, sans-serif"
          fontWeight="900"
          fontSize={1.6}
          fill="hsl(var(--accent))"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 1, 0], attrY: [plusY, plusY, plusY - 0.4, plusY - 1, plusY - 1.2] }}
          transition={{ ...loop, times: [0, 0.68, 0.72, 0.82, 0.9] }}
        >
          +3
        </motion.text>
      )}
    </motion.g>
  );
}
