import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db';
import { authenticateAdmin } from '../middleware';

const router = Router();

// Guided minutes:seconds format (e.g. "8:24"), enforced server-side too since
// the admin form's guided inputs can be bypassed by calling the API directly.
const DURATION_RE = /^\d+:[0-5]\d$/;

function serialize(row: any) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    desc: row.description,
    duration: row.duration,
    views: row.views,
    level: row.level,
    featured: !!row.featured,
    thumb: row.thumb,
    src: row.src,
    rating_avg: row.rating_count ? row.rating_sum / row.rating_count : 0,
    rating_count: row.rating_count,
  };
}

router.get('/', (req: Request, res: Response) => {
  const rows = db.query('SELECT * FROM tutorials ORDER BY featured DESC, title ASC').all();
  return res.json(rows.map(serialize));
});

router.post('/', authenticateAdmin, (req: Request, res: Response) => {
  const duration = req.body.duration || '0:00';
  if (!DURATION_RE.test(duration)) {
    return res.status(400).json({ error: 'Invalid duration format, expected M:SS (e.g. 8:24).' });
  }

  const tutorial = {
    id: `tut-${randomUUID()}`,
    title: req.body.title || 'Nouveau tutoriel',
    category: req.body.category || 'Gestes Techniques',
    description: req.body.desc || req.body.description || '',
    duration,
    // views is a real counter incremented only via POST /:id/view — never
    // settable on create, no matter what the request body sends.
    views: 0,
    level: req.body.level || 'Débutant',
    featured: !!req.body.featured,
    thumb: req.body.thumb || '',
    src: req.body.src || null,
  };

  db.transaction(() => {
    if (tutorial.featured) db.prepare('UPDATE tutorials SET featured = 0').run();
    db.prepare(
      'INSERT INTO tutorials (id, title, category, description, duration, views, level, featured, thumb, src) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(tutorial.id, tutorial.title, tutorial.category, tutorial.description, tutorial.duration, tutorial.views, tutorial.level, tutorial.featured ? 1 : 0, tutorial.thumb, tutorial.src);
  })();

  return res.status(201).json(serialize({ ...tutorial, featured: tutorial.featured ? 1 : 0 }));
});

router.put('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const existing = db.query('SELECT * FROM tutorials WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Tutorial not found' });

  const duration = req.body.duration ?? existing.duration;
  if (!DURATION_RE.test(duration)) {
    return res.status(400).json({ error: 'Invalid duration format, expected M:SS (e.g. 8:24).' });
  }

  const updated = {
    title: req.body.title ?? existing.title,
    category: req.body.category ?? existing.category,
    description: req.body.desc ?? req.body.description ?? existing.description,
    duration,
    // views/rating are never settable here either — always carry over the
    // real, server-tracked values regardless of what the request body contains.
    views: existing.views,
    rating_sum: existing.rating_sum,
    rating_count: existing.rating_count,
    level: req.body.level ?? existing.level,
    featured: req.body.featured !== undefined ? !!req.body.featured : !!existing.featured,
    thumb: req.body.thumb ?? existing.thumb,
    src: req.body.src ?? existing.src,
  };

  db.transaction(() => {
    if (updated.featured) db.prepare('UPDATE tutorials SET featured = 0 WHERE id != ?').run(req.params.id);
    db.prepare(
      'UPDATE tutorials SET title = ?, category = ?, description = ?, duration = ?, level = ?, featured = ?, thumb = ?, src = ? WHERE id = ?'
    ).run(updated.title, updated.category, updated.description, updated.duration, updated.level, updated.featured ? 1 : 0, updated.thumb, updated.src, req.params.id);
  })();

  return res.json(serialize({ ...updated, featured: updated.featured ? 1 : 0 }));
});

router.delete('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const result = db.prepare('DELETE FROM tutorials WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Tutorial not found' });
  return res.json({ success: true });
});

// Public — records a play. No auth: viewers aren't logged in. The frontend
// dedupes per browser session (see VideoPlayer.jsx) so reopening the same
// tutorial in one session doesn't inflate the count.
router.post('/:id/view', (req: Request, res: Response) => {
  const result = db.prepare('UPDATE tutorials SET views = views + 1 WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Tutorial not found' });
  const row = db.query('SELECT views FROM tutorials WHERE id = ?').get(req.params.id) as { views: number };
  return res.json({ views: row.views });
});

// Public — records a 1-5 rating. No auth: viewers aren't logged in. The
// frontend dedupes per browser session (see VideoPlayer.jsx) so a single
// viewer can't submit more than one rating per session.
router.post('/:id/rate', (req: Request, res: Response) => {
  const value = Number(req.body.value);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return res.status(400).json({ error: 'Invalid rating value, expected an integer from 1 to 5.' });
  }
  const result = db.prepare('UPDATE tutorials SET rating_sum = rating_sum + ?, rating_count = rating_count + 1 WHERE id = ?').run(value, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Tutorial not found' });
  const row = db.query('SELECT rating_sum, rating_count FROM tutorials WHERE id = ?').get(req.params.id) as { rating_sum: number; rating_count: number };
  return res.json({ rating_avg: row.rating_count ? row.rating_sum / row.rating_count : 0, rating_count: row.rating_count });
});

export default router;
