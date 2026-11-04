// Writes a .gz copy next to every compressible file in dist/, so nginx can
// serve it directly with `gzip_static on` (maximum compression, no CPU cost
// per request). Runs after `vite build` as part of `npm run build`.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { gzipSync, constants } from 'node:zlib';

const DIST = 'dist';
const TYPES = new Set(['.js', '.css', '.html', '.svg', '.json', '.webmanifest', '.xml', '.txt', '.otf', '.ttf', '.ico']);
const MIN_BYTES = 1024;

let before = 0;
let after = 0;
let count = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    if (!TYPES.has(extname(name)) || statSync(path).size < MIN_BYTES) continue;
    const data = readFileSync(path);
    const gz = gzipSync(data, { level: constants.Z_BEST_COMPRESSION });
    if (gz.length >= data.length) continue;
    writeFileSync(`${path}.gz`, gz);
    before += data.length;
    after += gz.length;
    count += 1;
  }
}

walk(DIST);
console.log(`precompress: ${count} files, ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB gzip`);
