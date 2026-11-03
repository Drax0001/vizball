import React from 'react';

// The logo's three strokes as a rule: green, red, gold.
export default function Tricolour({ className = 'h-[3px]' }) {
  return (
    <div className={`flex w-full ${className}`} aria-hidden="true">
      <span className="flex-1 bg-secondary" />
      <span className="flex-1 bg-brand-red" />
      <span className="flex-1 bg-accent" />
    </div>
  );
}
