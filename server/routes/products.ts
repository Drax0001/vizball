import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../db';
import { authenticateAdmin } from '../middleware';

const router = Router();

function serialize(row: any) {
  return { ...row, in_stock: !!row.in_stock };
}

router.get('/', (req: Request, res: Response) => {
  const rows = db.query('SELECT * FROM products').all();
  return res.json(rows.map(serialize));
});

router.post('/', authenticateAdmin, (req: Request, res: Response) => {
  const product = {
    id: `prod-${randomUUID()}`,
    name: req.body.name || 'Produit',
    category: req.body.category || 'Équipements de Jeu',
    price: Number(req.body.price) || 0,
    description: req.body.description || '',
    image_url: req.body.image_url || '',
    in_stock: req.body.in_stock !== undefined ? !!req.body.in_stock : true,
  };

  db.prepare(
    'INSERT INTO products (id, name, category, price, description, image_url, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(product.id, product.name, product.category, product.price, product.description, product.image_url, product.in_stock ? 1 : 0);

  return res.status(201).json(product);
});

router.put('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const existing = db.query('SELECT * FROM products WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  const updated = { ...existing, ...req.body, id: req.params.id };
  db.prepare(
    'UPDATE products SET name = ?, category = ?, price = ?, description = ?, image_url = ?, in_stock = ? WHERE id = ?'
  ).run(updated.name, updated.category, Number(updated.price) || 0, updated.description, updated.image_url, updated.in_stock ? 1 : 0, req.params.id);

  return res.json(serialize({ ...updated, in_stock: updated.in_stock ? 1 : 0 }));
});

router.delete('/:id', authenticateAdmin, (req: Request, res: Response) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
  return res.json({ success: true });
});

export default router;
