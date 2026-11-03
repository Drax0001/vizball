// Official Vizball field, in metres (origin top-left, x to the right, y down).
// Source: the rulebook on /le-sport and GAME_DESIGN.md §1.2.
export const FIELD = { w: 48, h: 24 };

const GC_R = 9;
const onGreatCircle = (deg) => {
  const r = (deg * Math.PI) / 180;
  return [12 + GC_R * Math.cos(r), 12 + GC_R * Math.sin(r)];
};

export const GEO = {
  midline: 24,
  zoneLines: [32, 40],
  greatCircle: { cx: 12, cy: 12, r: GC_R },
  centralCircle: { cx: 12, cy: 12, r: 1.5 },
  // Shooters' peripheral circles C1 (top), C2 (bottom-left), C3 (bottom-right)
  peripheral: [-90, 150, 30].map(onGreatCircle),
  peripheralR: 1.5,
  // Catch-ball supports, halfway between the shooters
  supports: [-150, -30, 90].map(onGreatCircle),
  butoir: { x: 48, y1: 10.5, y2: 13.5 },
  claque: [40, 12],
  // Kick-off positions
  target: [12, 12],
  playmaker: [20.5, 7],
  attackers: [[28, 8], [28, 16]],
  defenders: [[36, 8], [36, 16]],
  zones: [
    { id: 'z3', x: 24, pts: 3 },
    { id: 'z2', x: 32, pts: 2 },
    { id: 'z1', x: 40, pts: 1 },
  ],
};

// Map field metres to SVG units for an orientation.
// 'h': landscape 48 x 24. 'v': portrait 24 x 48, rotated clockwise so the
// shooting zone sits on top and the backstop plate at the bottom.
export function project(orient, x, y) {
  return orient === 'v' ? [FIELD.h - y, x] : [x, y];
}

export function viewBox(orient, pad = 0.6) {
  const w = orient === 'v' ? FIELD.h : FIELD.w;
  const h = orient === 'v' ? FIELD.w : FIELD.h;
  return `${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`;
}

// Axis-aligned rectangle in field metres, projected.
export function rect(orient, x, y, w, h) {
  if (orient === 'v') return { x: FIELD.h - y - h, y: x, width: h, height: w };
  return { x, y, width: w, height: h };
}
