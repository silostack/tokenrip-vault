import Anthropic from '@anthropic-ai/sdk';
import matter from 'gray-matter';
import { StorageService } from '../storage/storage.interface';
import { ArticleService, ArticleFrontmatter } from './article.service';

export interface EnrichmentResult {
  description: string;
  tags: string[];
  faq: Array<{ q: string; a: string }>;
  og: { type: string };
}

export interface AuthorConfig {
  authorName: string;
  authorType: string;
}

export function buildEnrichPrompt(title: string, content: string) {
  const system = `You are a content enrichment engine for a technical blog. Given an article, produce a JSON object with:

- "description": SEO-optimized summary, 1-2 sentences, max 160 characters
- "tags": array of 3-7 lowercase topic tags relevant to the article
- "faq": array of 5-10 objects with "q" (question) and "a" (answer) fields. Questions should be what a reader would naturally ask. Answers should be concise (1-3 sentences) and drawn from the article content.
- "og": { "type": "article" }

Respond with ONLY valid JSON. No markdown fencing, no explanation.`;

  const user = `# ${title}\n\n${content}`;

  return { system, user };
}

export function mergeEnrichment(
  existing: Record<string, any>,
  enrichment: EnrichmentResult,
  author: AuthorConfig,
): Record<string, any> {
  const merged = { ...existing };

  // Additive: only fill missing fields
  if (!merged.description) {
    merged.description = enrichment.description;
  }

  if (!merged.tags || merged.tags.length === 0) {
    merged.tags = enrichment.tags;
  }

  if (!merged.og) {
    merged.og = enrichment.og;
  }

  // JSON-LD: build if missing
  if (!merged.jsonLd) {
    merged.jsonLd = {};
  }

  if (!merged.jsonLd.faq) {
    merged.jsonLd.faq = enrichment.faq;
  }

  if (!merged.jsonLd.article) {
    merged.jsonLd.article = {
      type: 'Article',
      author: { name: author.authorName, type: author.authorType },
    };
  }

  return merged;
}

export class EnrichService {
  private client: Anthropic;
  private inProgress = new Set<string>();

  constructor(
    private readonly storage: StorageService,
    private readonly articleService: ArticleService,
    private readonly model: string,
    private readonly author: AuthorConfig,
    apiKey: string,
  ) {
    this.client = new Anthropic({ apiKey });
  }

  async enrichArticle(slug: string): Promise<boolean> {
    if (this.inProgress.has(slug)) return false;
    this.inProgress.add(slug);

    try {
      const article = await this.articleService.getBySlug(slug);
      if (!article) return false;

      // Already enriched
      if (article.frontmatter.jsonLd?.faq) return false;

      const { system, user } = buildEnrichPrompt(
        article.frontmatter.title,
        article.content,
      );

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2048,
        system,
        messages: [{ role: 'user', content: user }],
      });

      const text = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

      const enrichment: EnrichmentResult = JSON.parse(text);
      const merged = mergeEnrichment(
        article.frontmatter,
        enrichment,
        this.author,
      );

      // Re-serialize and overwrite
      const output = matter.stringify(article.content, merged);
      await this.articleService.store(output, {
        frontmatter: merged as ArticleFrontmatter,
      });

      return true;
    } finally {
      this.inProgress.delete(slug);
    }
  }

  async scanAndEnrich(): Promise<string | null> {
    const files = await this.storage.list();

    for (const fileKey of files) {
      const buf = await this.storage.read(fileKey);
      const { data } = matter(buf.toString());

      if (data.jsonLd?.faq) continue; // Already enriched
      if (!data.slug) continue;
      if (this.inProgress.has(data.slug)) continue;

      await this.enrichArticle(data.slug);
      return data.slug; // One per tick
    }

    return null; // Nothing to enrich
  }
}
