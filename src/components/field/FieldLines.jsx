import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FIELD, GEO, project, viewBox, rect } from './geometry';
import { EASE_IN_OUT } from '@/lib/motion';

// The official field drawn as chalk lines. Lines stroke themselves in on
// mount (`draw="mount"`) or when scrolled into view (`draw="view"`).
// Overlays (players, balls, photos) are passed as a render function that
// receives `p(x, y)` to project field metres into this orientation.
export default function FieldLines({
  orient = 'h',
  draw = 'view',
  delay = 0,
  duration = 1.6,
  strokeWidth = 0.07,
  labels = null,
  zoneTint = false,
  highlight = [],
  preserveAspectRatio = 'xMidYMid meet',
  className = '',
  defs = null,
  under = null,
  children,
}) {
  const reduce = useReducedMotion();
  const p = (x, y) => project(orient, x, y);
  const animated = draw && !reduce;

  const stroke = (i) =>
    animated
      ? {
          initial: { pathLength: 0, opacity: 0 },
          [draw === 'mount' ? 'animate' : 'whileInView']: { pathLength: 1, opacity: 1 },
          viewport: { once: true, margin: '-10% 0px' },
          transition: {
            pathLength: { duration, ease: EASE_IN_OUT, delay: delay + i * 0.07 },
            opacity: { duration: 0.2, delay: delay + i * 0.07 },
          },
        }
      : {};

  const outer = rect(orient, 0, 0, FIELD.w, FIELD.h);
  const line = (x1, y1, x2, y2) => {
    const [a, b] = p(x1, y1);
    const [c, d] = p(x2, y2);
    return { x1: a, y1: b, x2: c, y2: d };
  };
  const [gcx, gcy] = p(GEO.greatCircle.cx, GEO.greatCircle.cy);
  const [b1x, b1y] = p(GEO.butoir.x, GEO.butoir.y1);
  const [b2x, b2y] = p(GEO.butoir.x, GEO.butoir.y2);
  const [pcx, pcy] = p(...GEO.claque);
  let i = 0;

  return (
    <svg
      viewBox={viewBox(orient)}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {defs && <defs>{defs}</defs>}

      {zoneTint &&
        GEO.zones.map((z, zi) => (
          <motion.rect
            key={z.id}
            {...rect(orient, z.x, 0, 8, FIELD.h)}
            fill="hsl(var(--accent))"
            initial={{ opacity: 0 }}
            animate={{ opacity: highlight.includes(z.id) ? 0.22 : 0.025 * (3 - zi) }}
            transition={{ duration: 0.6, ease: EASE_IN_OUT }}
          />
        ))}

      {under && under(p)}

      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
        <motion.rect {...outer} {...stroke(i++)} />
        <motion.line {...line(GEO.midline, 0, GEO.midline, FIELD.h)} {...stroke(i++)} />
        {GEO.zoneLines.map((x) => (
          <motion.line key={x} {...line(x, 0, x, FIELD.h)} strokeOpacity={0.55} {...stroke(i++)} />
        ))}
        <motion.circle cx={gcx} cy={gcy} r={GEO.greatCircle.r} {...stroke(i++)} />
        <motion.circle cx={gcx} cy={gcy} r={GEO.centralCircle.r} {...stroke(i++)} />
        {GEO.peripheral.map(([x, y]) => {
          const [cx, cy] = p(x, y);
          return <motion.circle key={`${x}-${y}`} cx={cx} cy={cy} r={GEO.peripheralR} {...stroke(i++)} />;
        })}
      </g>

      {/* Backstop plate and claque point */}
      <motion.line
        x1={b1x} y1={b1y} x2={b2x} y2={b2y}
        stroke="hsl(var(--accent))"
        strokeWidth={0.42}
        strokeLinecap="round"
        {...stroke(i++)}
      />
      <motion.circle
        cx={pcx} cy={pcy} r={0.26}
        fill="hsl(var(--brand-red))"
        initial={animated ? { scale: 0 } : false}
        animate={animated && draw === 'mount' ? { scale: 1 } : undefined}
        whileInView={animated && draw === 'view' ? { scale: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ delay: delay + duration * 0.8, duration: 0.5, ease: EASE_IN_OUT }}
      />
      {GEO.supports.map(([x, y]) => {
        const [cx, cy] = p(x, y);
        return (
          <motion.circle
            key={`s-${x}-${y}`}
            cx={cx} cy={cy} r={0.32}
            fill="hsl(var(--accent))"
            initial={animated ? { scale: 0 } : false}
            animate={animated && draw === 'mount' ? { scale: 1 } : undefined}
            whileInView={animated && draw === 'view' ? { scale: 1 } : undefined}
            viewport={{ once: true }}
            transition={{ delay: delay + duration * 0.7, duration: 0.5, ease: EASE_IN_OUT }}
          />
        );
      })}

      {labels && <FieldLabels orient={orient} labels={labels} p={p} />}

      {children && children(p)}
    </svg>
  );
}

function FieldLabels({ orient, labels, p }) {
  const size = orient === 'v' ? 0.75 : 0.62;
  const zoneText = (z) => `${z.id.toUpperCase()} · ${z.pts} PTS`;
  const items =
    orient === 'v'
      ? [
          { x: 1.3, y: 12, text: labels.shooting, anchor: 'middle' },
          ...(labels.zones === false ? [] : GEO.zones.map((z) => ({ x: z.x + 4, y: 12, text: zoneText(z), anchor: 'middle', gold: true }))),
        ]
      : [
          { x: 12, y: 23.1, text: labels.shooting, anchor: 'middle' },
          { x: 36, y: 23.1, text: labels.duel, anchor: 'middle' },
          ...(labels.zones === false ? [] : GEO.zones.map((z) => ({ x: z.x + 4, y: 1.5, text: zoneText(z), anchor: 'middle', gold: true }))),
        ];
  return (
    <g fontFamily="Fester, sans-serif" fontWeight="700">
      {items.map((it) => {
        const [x, y] = p(it.x, it.y);
        return (
          <text
            key={it.text}
            x={x}
            y={y}
            fontSize={size}
            letterSpacing={size * 0.12}
            textAnchor={it.anchor}
            fill={it.gold ? 'hsl(var(--accent))' : 'currentColor'}
            fillOpacity={it.gold ? 0.9 : 0.55}
            style={{ textTransform: 'uppercase' }}
          >
            {it.text}
          </text>
        );
      })}
    </g>
  );
}
