// Regenerates the site icons from the transparent logo mark.
// Usage: node scripts/make-icons.mjs
import sharp from 'sharp';
import fs from 'node:fs';

const SOURCE = 'src/assets/images/favicon.ico'; // a transparent PNG despite its name
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

// The mark trimmed to its edges, centred on a square with a little breathing room.
async function icon(size, { padding = 0.06, background = CLEAR } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const mark = await sharp(SOURCE).trim().resize(inner, inner, { fit: 'contain', background: CLEAR }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: mark, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// An .ico file is a small directory followed by PNG images.
function ico(pngs) {
  const header = Buffer.alloc(6 + pngs.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

const small = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await icon(size, { padding: 0.02 }) })));
fs.writeFileSync('public/favicon.ico', ico(small));
fs.writeFileSync('public/favicon-32x32.png', small[1].data);
fs.writeFileSync('public/icon-192.png', await icon(192));
fs.writeFileSync('public/icon-512.png', await icon(512));
// iOS fills transparent pixels with black, so the home-screen icon keeps a white tile.
fs.writeFileSync('public/apple-touch-icon.png', await icon(180, { padding: 0.12, background: WHITE }));
console.log('icons written');
