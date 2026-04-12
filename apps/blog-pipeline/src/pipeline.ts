import matter from 'gray-matter';
import { enrichContent, type AuthorConfig } from './services/enrich.service';
import { slugify, extractExcerpt } from './services/publish.service';
import { TokenripClient } from './tokenrip-client';

export interface PipelineConfig {
  tokenripUrl: string;
  tokenripApiKey: string;
  anthropicApiKey: string;
  anthropicModel: string;
  author: AuthorConfig;
}

export interface PipelineResult {
  slug: string;
  publicId: string;
  updated: boolean;
}

export async function publishBlogPost(
  markdownContent: string,
  config: PipelineConfig,
): Promise<PipelineResult> {
  // 1. Parse frontmatter
  const { data: frontmatter, content } = matter(markdownContent);

  // 2. Basic enrichment — slug, description, publish_date
  const title = frontmatter.title || extractTitleFromContent(content);
  const slug = frontmatter.slug || slugify(title);
  const description = frontmatter.description || extractExcerpt(content, 160);
  const publishDate = frontmatter.publish_date || frontmatter.publishedAt || new Date().toISOString();
  const author = frontmatter.author || config.author.authorName;
  const tags = frontmatter.tags || [];

  // 3. LLM enrichment (if API key configured) — additive, only fills missing fields
  let enrichedDescription = description;
  let enrichedTags = tags;
  let faq: Array<{ q: string; a: string }> = [];

  if (config.anthropicApiKey) {
    const enrichment = await enrichContent(title, content, config.anthropicApiKey, config.anthropicModel);
    if (!description) enrichedDescription = enrichment.description;
    if (tags.length === 0) enrichedTags = enrichment.tags;
    faq = enrichment.faq;
  }

  // 4. Build final metadata blob
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const metadata: Record<string, unknown> = {
    post_type: 'blog_post',
    title,
    description: enrichedDescription,
    publish_date: publishDate,
    author,
    tags: enrichedTags,
    reading_time: Math.max(1, Math.ceil(wordCount / 200)),
  };

  if (faq.length > 0) metadata.faq = faq;
  if (frontmatter.og_image) metadata.og_image = frontmatter.og_image;
  if (frontmatter.excerpt) metadata.excerpt = frontmatter.excerpt;
  if (frontmatter.featured) metadata.featured = frontmatter.featured;
  if (frontmatter.draft) metadata.draft = frontmatter.draft;
  if (frontmatter.series) metadata.series = frontmatter.series;
  if (frontmatter.series_order) metadata.series_order = frontmatter.series_order;

  // 5. Validate
  if (!title) throw new Error('Title is required');
  if (!slug) throw new Error('Slug is required');
  if (!content.trim()) throw new Error('Content is empty');

  // 6. Check if slug already exists (update vs create)
  const client = new TokenripClient(config.tokenripUrl, config.tokenripApiKey);
  const existing = await client.getByAlias(slug);

  if (existing) {
    // Update: new version + metadata update
    await client.createVersion(existing.id, content);
    await client.updateAsset(existing.id, { metadata });
    return { slug, publicId: existing.id, updated: true };
  } else {
    // Create new
    const result = await client.publishAsset(content, slug, metadata);
    return { slug, publicId: result.publicId, updated: false };
  }
}

function extractTitleFromContent(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}
