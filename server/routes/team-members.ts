import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db';
import { authenticateAdmin } from '../middleware';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const rows = db.query('SELECT * FROM team_members ORDER BY display_order ASC').all();
  return res.json(rows);
});

router.post('/', authenticateAdmin, (req: Request, res: Response) => {
  const member = {
    id: `team-${randomUUID()}`,
    name: req.body.name || 'Nouveau membre',
    role: req.body.role || '',
    bio: req.body.bio || '',
    photo: req.body.photo || '',
    displayOrder: Number.isInteger(req.body.displayOrder) ? req.body.displayOrder : 0,
  };

  db.prepare(
    'INSERT INTO team_members (id, name, role, bio, photo, display_order) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(member.id, member.name, member.role, member.bio, member.photo, member.displayOrder);

  return res.status(201).json({
    id: member.id, name: member.name, role: member.role, bio: member.bio,
    photo: member.photo, display_order: member.displayOrder,
  });
});

router.put('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const existing = db.query('SELECT * FROM team_members WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Team member not found' });

  const updated = {
    name: req.body.name ?? existing.name,
    role: req.body.role ?? existing.role,
    bio: req.body.bio ?? existing.bio,
    photo: req.body.photo ?? existing.photo,
    displayOrder: Number.isInteger(req.body.displayOrder) ? req.body.displayOrder : existing.display_order,
  };

  db.prepare(
    'UPDATE team_members SET name = ?, role = ?, bio = ?, photo = ?, display_order = ? WHERE id = ?'
  ).run(updated.name, updated.role, updated.bio, updated.photo, updated.displayOrder, req.params.id);

  return res.json({
    id: req.params.id, name: updated.name, role: updated.role, bio: updated.bio,
    photo: updated.photo, display_order: updated.displayOrder,
  });
});

router.delete('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const result = db.prepare('DELETE FROM team_members WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Team member not found' });
  return res.json({ success: true });
});

export default router;
