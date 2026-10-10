import { Database } from 'bun:sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';

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

    CREATE TABLE IF NOT EXISTS visitor_log (
      ip TEXT PRIMARY KEY,
      first_seen_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT,
      photo TEXT,
      display_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS gallery_photos (
      id TEXT PRIMARY KEY,
      image_url TEXT NOT NULL,
      category TEXT NOT NULL,
      caption TEXT,
      featured INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS translations_cache (
      content_type TEXT NOT NULL,
      content_id TEXT NOT NULL,
      target_lang TEXT NOT NULL CHECK (target_lang IN ('fr','en')),
      translated_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (content_type, content_id, target_lang)
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0
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

  db.prepare(
    `INSERT INTO users (id, username, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    'admin-id-1',
    'admin',
    null,
    bcrypt.hashSync('admin-test-2026', 10),
    'admin',
    new Date().toISOString()
  );
}

migrate();
ensureColumn('articles', 'views', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('articles', 'rating_sum', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('articles', 'rating_count', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('tutorials', 'rating_sum', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('tutorials', 'rating_count', 'INTEGER NOT NULL DEFAULT 0');
migrateTutorialViewsColumn();
db.prepare('INSERT OR IGNORE INTO visitors (id, count) VALUES (1, 0)').run();
seedIfEmpty();
