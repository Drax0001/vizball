import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db';
import { authenticateAdmin } from '../middleware';

const router = Router();

function serialize(row: any) {
  return { ...row, read: !!row.read };
}

// Public — anyone can submit, no auth.
router.post('/', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }
  if (typeof message === 'string' && message.length > 5000) {
    return res.status(400).json({ error: 'Message is too long (max 5000 characters).' });
  }

  const row = {
    id: `msg-${randomUUID()}`,
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    subject: subject ? String(subject).slice(0, 300) : '',
    message: String(message).slice(0, 5000),
    created_at: new Date().toISOString(),
    read: 0,
  };

  db.prepare(
    'INSERT INTO contact_messages (id, name, email, subject, message, created_at, read) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(row.id, row.name, row.email, row.subject, row.message, row.created_at, row.read);

  return res.status(201).json(serialize(row));
});

// Admin only — newest first
router.get('/', authenticateAdmin, (req: Request, res: Response) => {
  const rows = db.query('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
  return res.json(rows.map(serialize));
});

// Admin only — mark read/unread
router.patch('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const existing = db.query('SELECT * FROM contact_messages WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Message not found' });
  const read = req.body.read !== undefined ? !!req.body.read : !!existing.read;
  db.prepare('UPDATE contact_messages SET read = ? WHERE id = ?').run(read ? 1 : 0, req.params.id);
  return res.json(serialize({ ...existing, read: read ? 1 : 0 }));
});

// Admin only — delete
router.delete('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const result = db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Message not found' });
  return res.json({ success: true });
});

export default router;
