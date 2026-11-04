import React from 'react';

export default function PageEyebrow({ children, className = 'text-accent' }) {
  return (
    <span className={`font-subtitle text-sm uppercase tracking-widest ${className}`}>
      {children}
    </span>
  );
}