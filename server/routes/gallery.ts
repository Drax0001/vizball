import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db';
import { authenticateAdmin } from '../middleware';

const router = Router();

function serialize(row: any) {
  return { ...row, featured: !!row.featured };
}

router.get('/', (req: Request, res: Response) => {
  const rows = db.query('SELECT * FROM gallery_photos ORDER BY rowid DESC').all();
  return res.json(rows.map(serialize));
});

router.post('/', authenticateAdmin, (req: Request, res: Response) => {
  const imageUrl = req.body.imageUrl || req.body.image_url || '';
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required' });

  const photo = {
    id: `photo-${randomUUID()}`,
    imageUrl,
    category: req.body.category || 'Matchs',
    caption: req.body.caption || '',
    featured: !!req.body.featured,
  };

  db.prepare(
    'INSERT INTO gallery_photos (id, image_url, category, caption, featured) VALUES (?, ?, ?, ?, ?)'
  ).run(photo.id, photo.imageUrl, photo.category, photo.caption, photo.featured ? 1 : 0);

  return res.status(201).json(serialize({
    id: photo.id, image_url: photo.imageUrl, category: photo.category,
    caption: photo.caption, featured: photo.featured ? 1 : 0,
  }));
});

router.put('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const existing = db.query('SELECT * FROM gallery_photos WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Photo not found' });

  const updated = {
    imageUrl: req.body.imageUrl ?? req.body.image_url ?? existing.image_url,
    category: req.body.category ?? existing.category,
    caption: req.body.caption ?? existing.caption,
    featured: req.body.featured !== undefined ? !!req.body.featured : !!existing.featured,
  };

  db.prepare(
    'UPDATE gallery_photos SET image_url = ?, category = ?, caption = ?, featured = ? WHERE id = ?'
  ).run(updated.imageUrl, updated.category, updated.caption, updated.featured ? 1 : 0, req.params.id);

  return res.json(serialize({
    id: req.params.id, image_url: updated.imageUrl, category: updated.category,
    caption: updated.caption, featured: updated.featured ? 1 : 0,
  }));
});

router.delete('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const result = db.prepare('DELETE FROM gallery_photos WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Photo not found' });
  return res.json({ success: true });
});

export default router;
