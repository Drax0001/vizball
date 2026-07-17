import { Database } from 'bun:sqlite';
import path from 'path';
import {
  seedUsers,
  seedArticles,
  seedProducts,
  seedClubs,
  seedEvents,
  seedForumTopics,
  seedForumReplies,
  seedVisitorsCount,
  seedTutorials,
  seedGovernanceDocuments,
} from './seedData';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'vizball.db');

export const db = new Database(DB_PATH, { create: true });
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin','user')) DEFAULT 'user',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('publié','brouillon')),
      cover_image TEXT,
      excerpt TEXT,
      content TEXT,
      author_name TEXT,
      published_at TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      views INTEGER NOT NULL DEFAULT 0,
      rating_sum INTEGER NOT NULL DEFAULT 0,
      rating_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      image_url TEXT,
      in_stock INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS clubs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      address TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'actif',
      members INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT,
      city TEXT,
      teams TEXT,
      status TEXT NOT NULL DEFAULT 'confirmé'
    );

    CREATE TABLE IF NOT EXISTS forum_topics (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      author_name TEXT NOT NULL,
      user_id TEXT REFERENCES users(id),
      created_date TEXT NOT NULL,
      content TEXT NOT NULL,
      pinned INTEGER NOT NULL DEFAULT 0,
      closed INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS forum_replies (
      id TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
      author_name TEXT NOT NULL,
      user_id TEXT REFERENCES users(id),
      created_date TEXT NOT NULL,
      content TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tutorials (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      duration TEXT,
      views INTEGER NOT NULL DEFAULT 0,
      level TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      thumb TEXT,
      src TEXT,
      rating_sum INTEGER NOT NULL DEFAULT 0,
      rating_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS governance_documents (
      id TEXT PRIMARY KEY,
      pillar_id TEXT NOT NULL,
      pillar TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      content TEXT,
      status TEXT NOT NULL DEFAULT 'restreint',
      pages INTEGER,
      year TEXT,
      file_url TEXT
    );

    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      count INTEGER NOT NULL DEFAULT 0
    );
  `);
}

// Adds a column to an already-existing table if it's missing. CREATE TABLE IF
// NOT EXISTS above only helps on fresh databases — existing dev databases
// created before a column was added need this to pick it up.
function ensureColumn(table: string, column: string, definition: string) {
  const cols = db.query(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

// tutorials.views used to be a free-text display string (e.g. "2 341"),
// settable by admins. It's now a real INTEGER counter incremented by
// POST /api/tutorials/:id/view. Existing dev databases with the old TEXT
// column get migrated in place instead of losing their data.
function migrateTutorialViewsColumn() {
  const cols = db.query(`PRAGMA table_info(tutorials)`).all() as { name: string; type: string }[];
  const viewsCol = cols.find((c) => c.name === 'views');
  if (!viewsCol || viewsCol.type.toUpperCase() === 'INTEGER') return;

  db.transaction(() => {
    db.exec('ALTER TABLE tutorials ADD COLUMN views_int INTEGER NOT NULL DEFAULT 0');
    const rows = db.query('SELECT id, views FROM tutorials').all() as { id: string; views: string }[];
    const update = db.prepare('UPDATE tutorials SET views_int = ? WHERE id = ?');
    for (const row of rows) {
      const parsed = parseInt(String(row.views).replace(/[^\d]/g, ''), 10);
      update.run(Number.isNaN(parsed) ? 0 : parsed, row.id);
    }
    db.exec('ALTER TABLE tutorials DROP COLUMN views');
    db.exec('ALTER TABLE tutorials RENAME COLUMN views_int TO views');
  })();
}

function seedIfEmpty() {
  const { count } = db.query('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (count > 0) return;

  const insertUser = db.prepare(
    `INSERT INTO users (id, username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  );
  const insertArticle = db.prepare(
    `INSERT INTO articles (id, title, category, status, cover_image, excerpt, content, author_name, published_at, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertProduct = db.prepare(
    `INSERT INTO products (id, name, category, price, description, image_url, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const insertClub = db.prepare(
    `INSERT INTO clubs (id, name, city, address, latitude, longitude, status, members) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertEvent = db.prepare(
    `INSERT INTO events (id, title, type, date, time, location, city, teams, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertTopic = db.prepare(
    `INSERT INTO forum_topics (id, title, category, author_name, user_id, created_date, content, pinned, closed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertReply = db.prepare(
    `INSERT INTO forum_replies (id, topic_id, author_name, user_id, created_date, content) VALUES (?, ?, ?, ?, ?, ?)`
  );
  const insertTutorial = db.prepare(
    `INSERT INTO tutorials (id, title, category, description, duration, views, level, featured, thumb, src) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertDoc = db.prepare(
    `INSERT INTO governance_documents (id, pillar_id, pillar, title, category, description, content, status, pages, year, file_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  db.transaction(() => {
    for (const u of seedUsers) insertUser.run(u.id, u.username, u.email, u.passwordHash, u.role, new Date().toISOString());
    for (const a of seedArticles) insertArticle.run(a.id, a.title, a.category, a.status, a.cover_image, a.excerpt, a.content, a.author_name, a.published_at, a.featured ? 1 : 0);
    for (const p of seedProducts) insertProduct.run(p.id, p.name, p.category, p.price, p.description, p.image_url, p.in_stock ? 1 : 0);
    for (const c of seedClubs) insertClub.run(c.id, c.name, c.city, c.address, c.latitude, c.longitude, c.status, c.members);
    for (const e of seedEvents) insertEvent.run(e.id, e.title, e.type, e.date, e.time, e.location, e.city, e.teams, e.status);
    for (const t of seedForumTopics) insertTopic.run(t.id, t.title, t.category, t.author_name, t.user_id, t.created_date, t.content, t.pinned ? 1 : 0, t.closed ? 1 : 0);
    for (const r of seedForumReplies) insertReply.run(r.id, r.topic_id, r.author_name, r.user_id, r.created_date, r.content);
    for (const v of seedTutorials) insertTutorial.run(v.id, v.title, v.category, v.description, v.duration, v.views, v.level, v.featured ? 1 : 0, v.thumb, v.src);
    for (const d of seedGovernanceDocuments) insertDoc.run(d.id, d.pillarId, d.pillar, d.title, d.category, d.description, JSON.stringify(d.content), d.status, d.pages, d.year, d.fileUrl);
    db.prepare(`INSERT INTO visitors (id, count) VALUES (1, ?)`).run(seedVisitorsCount);
  })();
}

migrate();
ensureColumn('articles', 'views', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('articles', 'rating_sum', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('articles', 'rating_count', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('tutorials', 'rating_sum', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('tutorials', 'rating_count', 'INTEGER NOT NULL DEFAULT 0');
migrateTutorialViewsColumn();
seedIfEmpty();
