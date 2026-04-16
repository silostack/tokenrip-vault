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
  const log = (step: string, data?: unknown) => {
    console.log(`\n[${'pipeline'}] ${step}`);
    if (data !== undefined) console.log(JSON.stringify(data, null, 2));
  };

  // 1. Parse frontmatter
  const { data: frontmatter, content } = matter(markdownContent);
  log('1. Parsed frontmatter', {
    keys: Object.keys(frontmatter),
    frontmatter,
    contentLength: content.length,
    contentPreview: content.slice(0, 200),
  });

  // 2. Basic enrichment — slug, description, publish_date
  const title = frontmatter.title || extractTitleFromContent(content);
  const slug = frontmatter.slug || slugify(title);
  const description = frontmatter.description || extractExcerpt(content, 160);
  const publishDate = frontmatter.publish_date || frontmatter.publishedAt || new Date().toISOString();
  const author = frontmatter.author || config.author.authorName;
  const tags = frontmatter.tags || [];

  log('2. Basic enrichment', { title, slug, description, publishDate, author, tags });

  // 3. LLM enrichment (if API key configured) — additive, only fills missing fields
  let enrichedDescription = description;
  let enrichedTags = tags;
  let faq: Array<{ q: string; a: string }> = [];

  if (config.anthropicApiKey) {
    log('3. LLM enrichment — calling Claude...', { model: config.anthropicModel });
    const enrichment = await enrichContent(title, content, config.anthropicApiKey, config.anthropicModel);
    log('3. LLM enrichment — result', enrichment);
    if (!description) enrichedDescription = enrichment.description;
    if (tags.length === 0) enrichedTags = enrichment.tags;
    faq = enrichment.faq;
  } else {
    log('3. LLM enrichment — skipped (no ANTHROPIC_API_KEY)');
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

  log('4. Final metadata', metadata);

  // 5. Validate
  if (!title) throw new Error('Title is required');
  if (!slug) throw new Error('Slug is required');
  if (!content.trim()) throw new Error('Content is empty');

  log('5. Validation passed');

  // 6. Check if slug already exists (update vs create)
  const client = new TokenripClient(config.tokenripUrl, config.tokenripApiKey);
  const existing = await client.getByAlias(slug);

  if (existing) {
    log('6. Slug exists — updating', { publicId: existing.id });
    await client.createVersion(existing.id, content);
    await client.updateAsset(existing.id, { metadata });
    log('6. Updated successfully');
    return { slug, publicId: existing.id, updated: true };
  } else {
    log('6. New slug — publishing', { slug });
    const result = await client.publishAsset(content, slug, metadata);
    log('6. Published successfully', { publicId: result.publicId });
    return { slug, publicId: result.publicId, updated: false };
  }
}

function extractTitleFromContent(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}
