import React from 'react';

// Endless band of repeated content. The track is duplicated once and
// translated by half its width, so the loop is seamless at any length.
export default function Marquee({ children, duration = 40, reverse = false, className = '' }) {
  return (
    <div className={`relative flex overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="flex shrink-0 animate-marquee items-center motion-reduce:animate-none"
        style={{ '--marquee-duration': `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
