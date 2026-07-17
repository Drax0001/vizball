import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db';
import { authenticateAdmin } from '../middleware';

const router = Router();

function serialize(row: any) {
  return {
    id: row.id,
    pillarId: row.pillar_id,
    pillar: row.pillar,
    title: row.title,
    category: row.category,
    desc: row.description,
    content: row.content ? JSON.parse(row.content) : [],
    status: row.status,
    pages: row.pages,
    year: row.year,
    fileUrl: row.file_url,
  };
}

router.get('/', (req: Request, res: Response) => {
  const rows = db.query('SELECT * FROM governance_documents').all();
  return res.json(rows.map(serialize));
});

router.post('/', authenticateAdmin, (req: Request, res: Response) => {
  const doc = {
    id: `doc-${randomUUID()}`,
    pillarId: req.body.pillarId || 'institutionnel',
    pillar: req.body.pillar || 'Pilier Institutionnel',
    title: req.body.title || 'Nouveau document',
    category: req.body.category || 'Gouvernance',
    description: req.body.desc || req.body.description || '',
    content: Array.isArray(req.body.content) ? req.body.content : [],
    status: req.body.status || 'restreint',
    pages: req.body.pages ?? null,
    year: req.body.year || '',
    fileUrl: req.body.fileUrl ?? null,
  };

  db.prepare(
    'INSERT INTO governance_documents (id, pillar_id, pillar, title, category, description, content, status, pages, year, file_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(doc.id, doc.pillarId, doc.pillar, doc.title, doc.category, doc.description, JSON.stringify(doc.content), doc.status, doc.pages, doc.year, doc.fileUrl);

  return res.status(201).json(serialize({
    id: doc.id, pillar_id: doc.pillarId, pillar: doc.pillar, title: doc.title, category: doc.category,
    description: doc.description, content: JSON.stringify(doc.content), status: doc.status,
    pages: doc.pages, year: doc.year, file_url: doc.fileUrl,
  }));
});

router.put('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const existing = db.query('SELECT * FROM governance_documents WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Document not found' });

  const updated = {
    pillarId: req.body.pillarId ?? existing.pillar_id,
    pillar: req.body.pillar ?? existing.pillar,
    title: req.body.title ?? existing.title,
    category: req.body.category ?? existing.category,
    description: req.body.desc ?? req.body.description ?? existing.description,
    content: Array.isArray(req.body.content) ? req.body.content : JSON.parse(existing.content || '[]'),
    status: req.body.status ?? existing.status,
    pages: req.body.pages ?? existing.pages,
    year: req.body.year ?? existing.year,
    fileUrl: req.body.fileUrl ?? existing.file_url,
  };

  db.prepare(
    'UPDATE governance_documents SET pillar_id = ?, pillar = ?, title = ?, category = ?, description = ?, content = ?, status = ?, pages = ?, year = ?, file_url = ? WHERE id = ?'
  ).run(updated.pillarId, updated.pillar, updated.title, updated.category, updated.description, JSON.stringify(updated.content), updated.status, updated.pages, updated.year, updated.fileUrl, req.params.id);

  return res.json(serialize({
    id: req.params.id, pillar_id: updated.pillarId, pillar: updated.pillar, title: updated.title, category: updated.category,
    description: updated.description, content: JSON.stringify(updated.content), status: updated.status,
    pages: updated.pages, year: updated.year, file_url: updated.fileUrl,
  }));
});

router.delete('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const result = db.prepare('DELETE FROM governance_documents WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Document not found' });
  return res.json({ success: true });
});

export default router;
