import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db';
import { authenticateAdmin } from '../middleware';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  return res.json(db.query('SELECT * FROM events ORDER BY date ASC').all());
});

router.post('/', authenticateAdmin, (req: Request, res: Response) => {
  const event = {
    id: `evt-${randomUUID()}`,
    title: req.body.title || 'Nouvel Événement',
    type: req.body.type || 'Autre',
    date: req.body.date || new Date().toISOString().split('T')[0],
    time: req.body.time || '12:00',
    location: req.body.location || '',
    city: req.body.city || '',
    teams: req.body.teams || '',
    status: req.body.status || 'confirmé',
  };

  db.prepare(
    'INSERT INTO events (id, title, type, date, time, location, city, teams, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(event.id, event.title, event.type, event.date, event.time, event.location, event.city, event.teams, event.status);

  return res.status(201).json(event);
});

router.put('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const existing = db.query('SELECT * FROM events WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Event not found' });

  const updated = { ...existing, ...req.body, id: req.params.id };
  db.prepare(
    'UPDATE events SET title = ?, type = ?, date = ?, time = ?, location = ?, city = ?, teams = ?, status = ? WHERE id = ?'
  ).run(updated.title, updated.type, updated.date, updated.time, updated.location, updated.city, updated.teams, updated.status, req.params.id);

  return res.json(updated);
});

router.delete('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const result = db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Event not found' });
  return res.json({ success: true });
});

export default router;
