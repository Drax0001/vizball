import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db';
import { authenticateAdmin } from '../middleware';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  return res.json(db.query('SELECT * FROM clubs').all());
});

router.post('/', authenticateAdmin, (req: Request, res: Response) => {
  const club = {
    id: `club-${randomUUID()}`,
    name: req.body.name || 'Nouveau Club',
    city: req.body.city || 'Yaoundé',
    address: req.body.address || '',
    latitude: Number(req.body.latitude) || 3.864,
    longitude: Number(req.body.longitude) || 11.502,
    status: req.body.status || 'actif',
    members: Number(req.body.members) || 0,
  };

  db.prepare(
    'INSERT INTO clubs (id, name, city, address, latitude, longitude, status, members) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(club.id, club.name, club.city, club.address, club.latitude, club.longitude, club.status, club.members);

  return res.status(201).json(club);
});

router.put('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const existing = db.query('SELECT * FROM clubs WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Club not found' });

  const updated = { ...existing, ...req.body, id: req.params.id };
  db.prepare(
    'UPDATE clubs SET name = ?, city = ?, address = ?, latitude = ?, longitude = ?, status = ?, members = ? WHERE id = ?'
  ).run(updated.name, updated.city, updated.address, Number(updated.latitude), Number(updated.longitude), updated.status, Number(updated.members), req.params.id);

  return res.json(updated);
});

router.delete('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const result = db.prepare('DELETE FROM clubs WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Club not found' });
  return res.json({ success: true });
});

export default router;
