import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { useLang } from './LanguageContext';
import t from './translations';
import FieldLines from '@/components/field/FieldLines';
import { RevealText } from '@/components/motion/Reveal';
import Cta from '@/components/site/Cta';

// Out of bounds: the ball left the field.
export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);
  const { lang } = useLang();
  const tr = t[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <main className="pitch relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center p-[var(--gutter)] opacity-30" aria-hidden="true">
          <FieldLines draw="mount" className="h-full w-full text-chalk">
            {(p) => {
              const [x, y] = p(50.5, -1.5);
              return <circle cx={x} cy={y} r={0.5} fill="hsl(var(--accent))" />;
            }}
          </FieldLines>
        </div>
        <div className="shell pb-[10vh]">
          <p className="display text-[clamp(6rem,26vw,22rem)] leading-[0.8] text-accent">404</p>
          <RevealText as="h1" trigger="mount" delay={0.2} text={tr.error_404_title} className="display mt-4 text-[clamp(2.2rem,5vw,4.5rem)]" />
          <p className="mt-5 max-w-xl text-lg text-chalk/75">
            {tr.error_404_prefix} <span className="font-bold text-chalk">"{pageName}"</span> {tr.error_404_suffix}
          </p>
          <div className="mt-10">
            <Cta to="/" tone="gold" size="lg">{tr.error_404_go_home}</Cta>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}
