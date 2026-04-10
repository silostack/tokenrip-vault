import matter from 'gray-matter';
import { StorageService } from '../storage/storage.interface';
import { ArticleIndex, ArticleRow } from '../db';

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description?: string;
  publishedAt?: string;
  image?: string;
  tags?: string[];
  jsonLd?: {
    article?: Record<string, any>;
    faq?: Array<{ q: string; a: string }>;
  };
  og?: Record<string, any>;
  [key: string]: any;
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
}

export class ArticleService {
  constructor(
    private readonly storage: StorageService,
    private readonly index: ArticleIndex,
  ) {}

  private toIndexRow(fm: ArticleFrontmatter, fileKey: string): Omit<ArticleRow, 'indexedAt'> {
    // gray-matter parses ISO dates into Date objects; SQLite needs strings
    const publishedAt = fm.publishedAt instanceof Date
      ? (fm.publishedAt as Date).toISOString()
      : fm.publishedAt || null;

    return {
      slug: fm.slug,
      title: fm.title,
      description: fm.description || null,
      publishedAt,
      image: fm.image || null,
      tags: fm.tags || [],
      fileKey,
    };
  }

  async store(raw: string, preParsed?: { frontmatter: ArticleFrontmatter }): Promise<string> {
    const frontmatter = preParsed?.frontmatter ?? matter(raw).data as ArticleFrontmatter;

    if (!frontmatter.slug) {
      throw new Error('Article frontmatter must include a slug');
    }

    const fileKey = `${frontmatter.slug}.md`;
    await this.storage.save(fileKey, Buffer.from(raw));

    this.index.upsert(this.toIndexRow(frontmatter, fileKey));

    return frontmatter.slug;
  }

  async getBySlug(slug: string): Promise<Article | null> {
    const fileKey = `${slug}.md`;
    let buf: Buffer;
    try {
      buf = await this.storage.read(fileKey);
    } catch {
      return null;
    }
    const { data, content } = matter(buf.toString());
    return { frontmatter: data as ArticleFrontmatter, content };
  }

  async list(opts: { limit: number; offset: number }): Promise<ArticleRow[]> {
    return this.index.list(opts);
  }

  async tags() {
    return this.index.tags();
  }

  async deleteBySlug(slug: string): Promise<void> {
    const fileKey = `${slug}.md`;
    try {
      await this.storage.delete(fileKey);
    } catch {
      // File already gone — that's fine
    }
    this.index.remove(slug);
  }

  async reindex(): Promise<number> {
    this.index.clear();
    const files = await this.storage.list();
    let count = 0;

    for (const fileKey of files) {
      const buf = await this.storage.read(fileKey);
      const { data } = matter(buf.toString());
      const fm = data as ArticleFrontmatter;

      if (!fm.slug) continue;

      this.index.upsert(this.toIndexRow(fm, fileKey));
      count++;
    }
    return count;
  }

  clearIndex() {
    this.index.clear();
  }

  close() {
    this.index.close();
  }
}
