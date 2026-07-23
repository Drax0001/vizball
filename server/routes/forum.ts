import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db';
import { authenticateAdmin, authenticateUser, AuthenticatedRequest } from '../middleware';

const router = Router();

function serializeTopic(row: any) {
  return { ...row, pinned: !!row.pinned, closed: !!row.closed };
}

router.get('/topics', authenticateUser, (req: Request, res: Response) => {
  const rows = db.query('SELECT * FROM forum_topics ORDER BY pinned DESC, created_date DESC').all();
  return res.json(rows.map(serializeTopic));
});

router.get('/topics/:id', authenticateUser, (req: Request, res: Response) => {
  const topic = db.query('SELECT * FROM forum_topics WHERE id = ?').get(req.params.id) as any;
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  const replies = db.query('SELECT * FROM forum_replies WHERE topic_id = ? ORDER BY created_date ASC').all(req.params.id);
  return res.json({ ...serializeTopic(topic), replies });
});

router.post('/topics', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const authorName = req.user ? req.user.username : req.body.author_name;
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  if (!authorName) {
    return res.status(400).json({ error: 'Author name is required' });
  }

  const topic = {
    id: `topic-${randomUUID()}`,
    title: req.body.title,
    category: req.body.category || 'Général',
    author_name: authorName,
    user_id: req.user?.id || null,
    created_date: new Date().toISOString(),
    content: req.body.content,
    pinned: 0,
    closed: 0,
  };

  db.prepare(
    'INSERT INTO forum_topics (id, title, category, author_name, user_id, created_date, content, pinned, closed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(topic.id, topic.title, topic.category, topic.author_name, topic.user_id, topic.created_date, topic.content, topic.pinned, topic.closed);

  return res.status(201).json(serializeTopic(topic));
});

router.get('/topics/:id/replies', authenticateUser, (req: Request, res: Response) => {
  const replies = db.query('SELECT * FROM forum_replies WHERE topic_id = ? ORDER BY created_date ASC').all(req.params.id);
  return res.json(replies);
});

router.post('/topics/:id/replies', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const topic = db.query('SELECT * FROM forum_topics WHERE id = ?').get(req.params.id) as any;
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  if (topic.closed) return res.status(400).json({ error: 'Topic is closed for replies' });

  const authorName = req.user ? req.user.username : req.body.author_name;
  if (!req.body.content) return res.status(400).json({ error: 'Content is required' });
  if (!authorName) return res.status(400).json({ error: 'Author name is required' });

  const reply = {
    id: `rep-${randomUUID()}`,
    topic_id: req.params.id,
    author_name: authorName,
    user_id: req.user?.id || null,
    created_date: new Date().toISOString(),
    content: req.body.content,
  };

  db.prepare(
    'INSERT INTO forum_replies (id, topic_id, author_name, user_id, created_date, content) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(reply.id, reply.topic_id, reply.author_name, reply.user_id, reply.created_date, reply.content);

  return res.status(201).json(reply);
});

// Admin pin/close topic
router.put('/topics/:id', authenticateAdmin, (req: Request, res: Response) => {
  const existing = db.query('SELECT * FROM forum_topics WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Topic not found' });

  const pinned = req.body.pinned !== undefined ? !!req.body.pinned : !!existing.pinned;
  const closed = req.body.closed !== undefined ? !!req.body.closed : !!existing.closed;

  db.prepare('UPDATE forum_topics SET pinned = ?, closed = ? WHERE id = ?').run(pinned ? 1 : 0, closed ? 1 : 0, req.params.id);

  return res.json(serializeTopic({ ...existing, pinned: pinned ? 1 : 0, closed: closed ? 1 : 0 }));
});

router.delete('/topics/:id', authenticateAdmin, (req: Request, res: Response) => {
  const existing = db.query('SELECT id FROM forum_topics WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Topic not found' });

  db.transaction(() => {
    db.prepare('DELETE FROM forum_replies WHERE topic_id = ?').run(req.params.id);
    db.prepare('DELETE FROM forum_topics WHERE id = ?').run(req.params.id);
  })();

  return res.json({ success: true });
});

export default router;
