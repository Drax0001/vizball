import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Magnetic from '../motion/Magnetic';

const TONES = {
  red: 'bg-brand-red text-white before:bg-accent hover:text-night',
  gold: 'bg-accent text-night before:bg-chalk',
  chalk: 'bg-chalk text-night before:bg-accent',
  ghost: 'text-chalk ring-1 ring-inset ring-chalk/35 before:bg-chalk hover:text-night hover:ring-chalk',
  ghostDark: 'text-night ring-1 ring-inset ring-night/25 before:bg-night hover:text-chalk hover:ring-night',
  night: 'bg-night text-chalk before:bg-accent hover:text-night',
};

const SIZES = {
  md: 'h-12 pl-6 pr-2 text-[0.95rem] gap-4',
  lg: 'h-14 sm:h-16 pl-7 pr-2 text-base sm:text-lg gap-5',
};

// Pill action: a colour fill rises from below on hover and the arrow disc
// spins forward. Renders a router Link, an anchor, or a button.
export default function Cta({
  to,
  href,
  onClick,
  type = 'button',
  tone = 'red',
  size = 'md',
  magnetic = true,
  arrow = true,
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'group relative isolate inline-flex items-center justify-between overflow-hidden rounded-full font-heading font-bold uppercase tracking-[0.06em] whitespace-nowrap',
    'transition-[color,box-shadow] duration-500 ease-out-expo',
    "before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:rounded-full before:transition-transform before:duration-500 before:ease-out-expo before:content-['']",
    'hover:before:translate-y-0 focus-visible:before:translate-y-0',
    'disabled:pointer-events-none disabled:opacity-50',
    TONES[tone],
    SIZES[size],
    arrow ? '' : 'pr-6',
    className,
  ].join(' ');

  const inner = (
    <>
      <span className="relative">{children}</span>
      {arrow && (
        <span
          className={`grid shrink-0 place-items-center rounded-full ${size === 'lg' ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-8 w-8'} bg-[color-mix(in_srgb,currentColor_16%,transparent)] transition-transform duration-500 ease-out-expo group-hover:-rotate-45`}
          aria-hidden="true"
        >
          <ArrowRight size={size === 'lg' ? 18 : 15} strokeWidth={2.25} />
        </span>
      )}
    </>
  );

  let el;
  if (to) el = <Link to={to} className={cls} {...rest}>{inner}</Link>;
  else if (href) el = <a href={href} className={cls} {...rest}>{inner}</a>;
  else el = <button type={type} onClick={onClick} className={cls} {...rest}>{inner}</button>;

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
