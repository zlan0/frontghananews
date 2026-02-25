import { createClient } from '@libsql/client';

let client: ReturnType<typeof createClient> | null = null;

export function getDb() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error('TURSO_DATABASE_URL environment variable is required');
    }

    client = createClient({ url, authToken });
  }
  return client;
}

export async function initDb() {
  const db = getDb();

  // Create tables one at a time (Turso HTTP client doesn't support multi-statement executeMultiple reliably)
  await db.execute(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category TEXT DEFAULT 'general',
    source TEXT,
    source_url TEXT,
    image_url TEXT,
    author TEXT DEFAULT 'GhanaFront Staff',
    status TEXT DEFAULT 'published',
    is_scraped INTEGER DEFAULT 0,
    is_ai_rewritten INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS rss_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'general',
    active INTEGER DEFAULT 1,
    last_fetched TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS scrape_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'general',
    article_selector TEXT DEFAULT 'article',
    title_selector TEXT DEFAULT 'h1, h2',
    content_selector TEXT DEFAULT 'p',
    image_selector TEXT DEFAULT 'img',
    active INTEGER DEFAULT 1,
    last_scraped TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`);

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_articles_created ON articles(created_at)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)`);

  // Seed default RSS sources if empty
  const existingRss = await db.execute('SELECT COUNT(*) as count FROM rss_sources');
  if ((existingRss.rows[0] as any).count === 0) {
    const rssSources = [
      ['GhanaWeb', 'https://www.ghanaweb.com/GhanaHomePage/rss_headline.php', 'general'],
      ['Graphic Online', 'https://www.graphic.com.gh/feed', 'general'],
      ['Ghana Business News', 'https://www.ghanabusinessnews.com/feed', 'business'],
      ['3News', 'https://3news.com/feed/', 'general'],
      ['Joy Online', 'https://www.myjoyonline.com/feed/', 'general'],
      ['CitiFM', 'https://citifmonline.com/feed/', 'general'],
      ['Football Ghana', 'https://footballghana.com/feed/', 'sports'],
    ];
    for (const [name, url, category] of rssSources) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO rss_sources (name, url, category) VALUES (?, ?, ?)`,
        args: [name, url, category],
      });
    }

    const scrapeSources = [
      ['GhanaWeb', 'https://www.ghanaweb.com', 'general'],
      ['Graphic Online', 'https://www.graphic.com.gh', 'general'],
    ];
    for (const [name, url, category] of scrapeSources) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO scrape_sources (name, url, category) VALUES (?, ?, ?)`,
        args: [name, url, category],
      });
    }
  }
}

export type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string;
  source: string | null;
  source_url: string | null;
  image_url: string | null;
  author: string;
  status: string;
  is_scraped: number;
  is_ai_rewritten: number;
  views: number;
  created_at: string;
  updated_at: string;
};
