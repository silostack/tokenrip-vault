import type { BlogPost, BlogPostSummary } from './templates/types';
import { TTLCache } from './cache';

const POST_TTL = 5 * 60 * 1000;    // 5 minutes
const LIST_TTL = 2 * 60 * 1000;    // 2 minutes
const RSS_TTL = 10 * 60 * 1000;    // 10 minutes
const SITEMAP_TTL = 60 * 60 * 1000; // 1 hour

export class BlogApiClient {
  private postCache = new TTLCache<BlogPost | null>();
  private listCache = new TTLCache<{ posts: BlogPostSummary[]; total: number }>();

  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  async getPost(slug: string): Promise<BlogPost | null> {
    const cached = this.postCache.get(slug);
    if (!TTLCache.isMiss(cached)) return cached;

    const metaRes = await fetch(`${this.baseUrl}/v0/assets/${slug}`);
    if (metaRes.status === 404) return null;
    if (!metaRes.ok) return null;

    const metaJson = await metaRes.json() as any;
    const data = metaJson.data;

    // Only serve blog posts
    if (data.metadata?.post_type !== 'blog_post') return null;
    // Skip drafts
    if (data.metadata?.draft) return null;

    const contentRes = await fetch(`${this.baseUrl}/v0/assets/${slug}/content`);
    if (!contentRes.ok) return null;
    const content = await contentRes.text();

    const post: BlogPost = {
      publicId: data.id,
      alias: data.alias,
      content,
      metadata: data.metadata,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
    this.postCache.set(slug, post, POST_TTL);
    return post;
  }

  async listPosts(opts: {
    limit?: number;
    offset?: number;
    tag?: string;
  } = {}): Promise<{ posts: BlogPostSummary[]; total: number }> {
    const cacheKey = `list:${opts.limit ?? 20}:${opts.offset ?? 0}:${opts.tag ?? ''}`;
    const cached = this.listCache.get(cacheKey);
    if (!TTLCache.isMiss(cached)) return cached;

    const body: Record<string, unknown> = {
      metadata: { post_type: 'blog_post' },
      sort: '-publish_date',
      limit: opts.limit ?? 20,
      offset: opts.offset ?? 0,
    };

    if (opts.tag) {
      body.tag = opts.tag;
    }

    const res = await fetch(`${this.baseUrl}/v0/assets/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return { posts: [], total: 0 };
    }

    const json = await res.json() as any;
    const posts: BlogPostSummary[] = json.assets
      .filter((a: any) => !a.metadata?.draft)
      .map((a: any) => ({
        publicId: a.publicId,
        alias: a.alias,
        title: a.title,
        metadata: a.metadata,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }));

    const result = { posts, total: json.pagination.total };
    const ttl = opts.tag ? POST_TTL : LIST_TTL;
    this.listCache.set(cacheKey, result, ttl);
    return result;
  }
}
