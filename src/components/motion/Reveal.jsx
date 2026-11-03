import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' };

// Display type rises word by word out of a mask. One grammar, used only on
// display headings so it stays a signature rather than noise.
export function RevealText({ as: Tag = 'h2', text, className = '', delay = 0, stagger = 0.06, trigger = 'view', play = true, accent = [], id }) {
  const reduce = useReducedMotion();
  const words = String(text).split(' ');
  const MotionTag = motion[Tag] || motion.h2;

  if (reduce) {
    return (
      <Tag id={id} className={className}>
        {words.map((w, i) => (
          <React.Fragment key={i}>
            <span className={accent.includes(i) ? 'text-accent' : undefined}>{w}</span>{i < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </Tag>
    );
  }

  const parent = {
    hidden: {},
    shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const child = {
    hidden: { y: '108%', rotate: 2 },
    shown: { y: '0%', rotate: 0, transition: { duration: 1, ease: EASE_OUT } },
  };
  const triggerProps =
    trigger === 'mount'
      ? { initial: 'hidden', animate: play ? 'shown' : 'hidden' }
      : { initial: 'hidden', whileInView: 'shown', viewport: VIEWPORT };

  return (
    <MotionTag id={id} className={className} variants={parent} {...triggerProps}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]">
            <motion.span
              className={`inline-block origin-bottom-left ${accent.includes(i) ? 'text-accent' : ''}`}
              variants={child}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </MotionTag>
  );
}

// Block entrance: a short rise with a blur that clears. Content is laid out
// at its final size, so nothing shifts.
export function Reveal({ as = 'div', children, className = '', delay = 0, y = 28, ...rest }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  if (reduce) return <Comp className={className} {...rest}>{children}</Comp>;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

// An image that drifts slower than the page and unmasks on entry.
export function ParallaxImage({ src, alt, className = '', imgClassName = '', speed = 0.14, reveal = true, loading = 'lazy' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={reveal && !reduce ? { clipPath: 'inset(18% 0% 0% 0%)' } : false}
      whileInView={reveal && !reduce ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
      viewport={VIEWPORT}
      transition={{ duration: 1.3, ease: EASE_OUT }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        style={reduce ? undefined : { y, scale: 1 + speed * 2.2 }}
        className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
      />
    </motion.div>
  );
}
