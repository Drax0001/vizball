import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

const SITE_ORIGIN = 'https://vizball.org';

const STATIC_ROUTES = [
  '/',
  '/le-sport',
  '/gouvernance',
  '/actualites',
  '/boutique',
  '/tutoriels',
  '/contact',
];

function xmlEscape(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

router.get('/', (req: Request, res: Response) => {
  const articles = db.query("SELECT id, published_at FROM articles WHERE status = 'publié'").all() as { id: string; published_at: string | null }[];
  const products = db.query('SELECT id FROM products').all() as { id: string }[];

  const urls: { loc: string; lastmod?: string }[] = [
    ...STATIC_ROUTES.map((path) => ({ loc: `${SITE_ORIGIN}${path}` })),
    ...articles.map((a) => ({ loc: `${SITE_ORIGIN}/actualites/${a.id}`, lastmod: a.published_at || undefined })),
    ...products.map((p) => ({ loc: `${SITE_ORIGIN}/boutique/${p.id}` })),
  ];

  const body = urls
    .map(({ loc, lastmod }) => {
      const lastmodTag = lastmod ? `<lastmod>${xmlEscape(lastmod.slice(0, 10))}</lastmod>` : '';
      return `  <url><loc>${xmlEscape(loc)}</loc>${lastmodTag}</url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;

  res.type('application/xml').send(xml);
});

export default router;
