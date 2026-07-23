import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { authenticateAdmin } from '../middleware';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WEBP, GIF images or PDF files are allowed.'));
    }
    cb(null, true);
  },
});

const router = Router();

router.post('/', authenticateAdmin, (req: Request, res: Response) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    return res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

// Resolves an Unsplash *page* URL (unsplash.com/photos/...) to the direct
// images.unsplash.com asset URL by reading the page's og:image meta tag —
// the page slug doesn't encode the CDN asset id, so this can't be done by
// string manipulation alone.
router.post('/resolve-image-url', authenticateAdmin, async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'A url is required.' });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL.' });
  }

  if (parsed.hostname !== 'unsplash.com' && parsed.hostname !== 'www.unsplash.com') {
    return res.status(400).json({ error: 'Only unsplash.com page URLs can be resolved.' });
  }

  try {
    const pageRes = await fetch(parsed.toString(), { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!pageRes.ok) return res.status(422).json({ error: 'Could not fetch the Unsplash page.' });
    const html = await pageRes.text();
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (!match) return res.status(422).json({ error: 'Could not find an image on that page.' });
    return res.json({ url: match[1] });
  } catch (err) {
    return res.status(502).json({ error: 'Failed to resolve the image URL.' });
  }
});

export default router;
