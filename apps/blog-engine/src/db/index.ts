import { Database } from 'bun:sqlite';

export interface ArticleRow {
  slug: string;
  title: string;
  description: string | null;
  publishedAt: string | null;
  image: string | null;
  tags: string[];
  fileKey: string;
  indexedAt?: string;
}

export interface TagCount {
  tag: string;
  count: number;
}

export class ArticleIndex {
  private db: Database;
  private upsertStmt: ReturnType<Database['prepare']>;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.exec('PRAGMA journal_mode = WAL');
    this.init();
    this.upsertStmt = this.db.prepare(`
      INSERT INTO articles
        (slug, title, description, published_at, image, tags, file_key, indexed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        published_at = excluded.published_at,
        image = excluded.image,
        tags = excluded.tags,
        file_key = excluded.file_key,
        indexed_at = excluded.indexed_at
    `);
  }

  private init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        slug TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        published_at TEXT,
        image TEXT,
        tags TEXT NOT NULL DEFAULT '[]',
        file_key TEXT NOT NULL,
        indexed_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_published_at
        ON articles(published_at DESC);
    `);
  }

  upsert(article: Omit<ArticleRow, 'indexedAt'>) {
    this.upsertStmt.run(
      article.slug,
      article.title,
      article.description,
      article.publishedAt,
      article.image,
      JSON.stringify(article.tags),
      article.fileKey,
      new Date().toISOString(),
    );
  }

  get(slug: string): ArticleRow | null {
    const row = this.db
      .prepare('SELECT * FROM articles WHERE slug = ?')
      .get(slug) as any;
    if (!row) return null;
    return this.mapRow(row);
  }

  list({ limit, offset }: { limit: number; offset: number }): ArticleRow[] {
    const rows = this.db
      .prepare(
        'SELECT * FROM articles ORDER BY published_at DESC LIMIT ? OFFSET ?',
      )
      .all(limit, offset) as any[];
    return rows.map(this.mapRow);
  }

  tags(): TagCount[] {
    return this.db
      .prepare(
        `SELECT value as tag, COUNT(*) as count
         FROM articles, json_each(articles.tags)
         GROUP BY value
         ORDER BY count DESC`,
      )
      .all() as TagCount[];
  }

  remove(slug: string) {
    this.db.prepare('DELETE FROM articles WHERE slug = ?').run(slug);
  }

  clear() {
    this.db.exec('DELETE FROM articles');
  }

  close() {
    this.db.close();
  }

  private mapRow(row: any): ArticleRow {
    return {
      slug: row.slug,
      title: row.title,
      description: row.description,
      publishedAt: row.published_at,
      image: row.image,
      tags: JSON.parse(row.tags),
      fileKey: row.file_key,
      indexedAt: row.indexed_at,
    };
  }
}
