import React from 'react';
import Marquee from '../motion/Marquee';

function Ball() {
  return (
    <svg viewBox="0 0 24 24" className="mx-[0.45em] h-[0.62em] w-[0.62em] shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <path d="M4.5 7.5c4 2.6 11 2.6 15 0M4.5 16.5c4-2.6 11-2.6 15 0" fill="none" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

// The two official slogans running as a gold advertising board.
export default function SloganBand() {
  const run = (
    <>
      <span>Rise Above The Game</span>
      <Ball />
      <span className="voice normal-case">Justice · Volonté · Succès</span>
      <Ball />
    </>
  );
  return (
    <div className="relative z-20 bg-brand-red py-4 text-chalk md:py-5">
      <p className="sr-only">Rise Above The Game — Justice, Volonté, Succès</p>
      <Marquee duration={32}>
        <div className="display flex items-center whitespace-nowrap pr-[0.45em] text-[clamp(1.6rem,3.6vw,3.25rem)] leading-none">
          {run}
          {run}
        </div>
      </Marquee>
    </div>
  );
}
