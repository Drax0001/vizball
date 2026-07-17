import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db';
import { authenticateAdmin, optionalAuthenticate, AuthenticatedRequest } from '../middleware';

const router = Router();

function serialize(row: any) {
  return {
    ...row,
    featured: !!row.featured,
    rating_avg: row.rating_count ? row.rating_sum / row.rating_count : 0,
  };
}

router.get('/', optionalAuthenticate, (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === 'admin';
  const rows = isAdmin
    ? db.query('SELECT * FROM articles ORDER BY published_at DESC').all()
    : db.query("SELECT * FROM articles WHERE status = 'publié' ORDER BY published_at DESC").all();
  return res.json(rows.map(serialize));
});

router.get('/:id', (req: Request, res: Response) => {
  const article = db.query('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  return res.json(serialize(article));
});

router.post('/', authenticateAdmin, (req: Request, res: Response) => {
  const id = `art-${randomUUID()}`;
  const featured = !!req.body.featured;
  const article = {
    id,
    title: req.body.title || 'Sans titre',
    category: req.body.category || 'Actualité',
    status: req.body.status || 'brouillon',
    cover_image: req.body.cover_image || '',
    excerpt: req.body.excerpt || '',
    content: req.body.content || '',
    author_name: req.body.author_name || 'Admin',
    published_at: req.body.published_at || new Date().toISOString().split('T')[0],
    featured,
    views: 0,
  };

  db.transaction(() => {
    if (featured) db.prepare('UPDATE articles SET featured = 0').run();
    db.prepare(
      'INSERT INTO articles (id, title, category, status, cover_image, excerpt, content, author_name, published_at, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(article.id, article.title, article.category, article.status, article.cover_image, article.excerpt, article.content, article.author_name, article.published_at, featured ? 1 : 0);
  })();

  return res.status(201).json(article);
});

router.put('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const existing = db.query('SELECT * FROM articles WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Article not found' });

  // views/rating are real counters incremented only via POST /:id/view and
  // /:id/rate — never settable through this endpoint, regardless of what the
  // request body sends.
  const updated = { ...existing, ...req.body, id: req.params.id, views: existing.views, rating_sum: existing.rating_sum, rating_count: existing.rating_count };
  const featured = !!updated.featured;

  db.transaction(() => {
    if (featured) db.prepare('UPDATE articles SET featured = 0 WHERE id != ?').run(req.params.id);
    db.prepare(
      'UPDATE articles SET title = ?, category = ?, status = ?, cover_image = ?, excerpt = ?, content = ?, author_name = ?, published_at = ?, featured = ? WHERE id = ?'
    ).run(updated.title, updated.category, updated.status, updated.cover_image, updated.excerpt, updated.content, updated.author_name, updated.published_at, featured ? 1 : 0, req.params.id);
  })();

  return res.json(serialize({ ...updated, featured: featured ? 1 : 0 }));
});

router.delete('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const result = db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Article not found' });
  return res.json({ success: true });
});

// Public — records a read. No auth: readers aren't logged in. The frontend
// dedupes per browser session (see ArticleDetail.jsx) so a single reader
// refreshing the page doesn't inflate the count.
router.post('/:id/view', (req: Request, res: Response) => {
  const result = db.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Article not found' });
  const row = db.query('SELECT views FROM articles WHERE id = ?').get(req.params.id) as { views: number };
  return res.json({ views: row.views });
});

// Public — records a 1-5 rating. No auth: readers aren't logged in. The
// frontend dedupes per browser session (see ArticleDetail.jsx) so a single
// reader can't submit more than one rating per session.
router.post('/:id/rate', (req: Request, res: Response) => {
  const value = Number(req.body.value);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return res.status(400).json({ error: 'Invalid rating value, expected an integer from 1 to 5.' });
  }
  const result = db.prepare('UPDATE articles SET rating_sum = rating_sum + ?, rating_count = rating_count + 1 WHERE id = ?').run(value, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Article not found' });
  const row = db.query('SELECT rating_sum, rating_count FROM articles WHERE id = ?').get(req.params.id) as { rating_sum: number; rating_count: number };
  return res.json({ rating_avg: row.rating_count ? row.rating_sum / row.rating_count : 0, rating_count: row.rating_count });
});

export default router;
