import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const row = db.query('SELECT count FROM visitors WHERE id = 1').get() as { count: number } | null;
  return res.json({ count: row?.count || 0 });
});

router.post('/', (req: Request, res: Response) => {
  db.prepare('UPDATE visitors SET count = count + 1 WHERE id = 1').run();
  const row = db.query('SELECT count FROM visitors WHERE id = 1').get() as { count: number };
  return res.json({ count: row.count });
});

export default router;
