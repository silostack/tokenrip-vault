import matter from 'gray-matter';
import type { LLMClient } from '../llm/client';
import { BlogDraftSchema, EnrichmentSchema } from '../llm/schemas';
import { buildDraftPostPrompt } from '../llm/prompts/draft-post';
import { buildEnrichPostPrompt } from '../llm/prompts/enrich-post';
import { RepoReader } from '../repo/reader';
import { RepoWriter } from '../repo/writer';
import type { PublishResult, Signal } from '../types';

export interface PublishParams {
  wikiPagePath: string; // relative to repo
  repoPath: string;
  llm: LLMClient;
  angle?: string;
  author?: string; // default 'Tokenrip'
}

/**
 * Slugify a title for use in URLs and filenames.
 * Lowercase, remove non-alphanumeric (keep spaces/dashes), replace spaces with dashes,
 * collapse multiple dashes, trim leading/trailing dashes, max 80 chars.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric except spaces and dashes
    .replace(/\s+/g, '-') // replace spaces with dashes
    .replace(/-+/g, '-') // collapse multiple dashes
    .replace(/^-+|-+$/g, '') // trim leading/trailing dashes
    .slice(0, 80);
}

/**
 * Publish pipeline: wiki page + signals -> blog-ready markdown.
 *
 * Steps:
 * 1. Gather — read wiki page, find cited and related signals
 * 2. Draft — LLM generates blog post title + body
 * 3. Enrich — LLM generates SEO metadata (description, tags, FAQ)
 * 4. Build frontmatter — assemble blog-pipeline-compatible frontmatter
 * 5. Write — serialize and write to content/blog/
 */
export async function publish(params: PublishParams): Promise<PublishResult> {
  const { wikiPagePath, repoPath, llm, angle, author = 'Tokenrip' } = params;
  const reader = new RepoReader(repoPath);
  const writer = new RepoWriter(repoPath);

  // 1. Gather — read wiki page and signals
  const wikiRaw = await reader.readFile(wikiPagePath);
  const { data: wikiFrontmatter, content: wikiContent } = matter(wikiRaw);

  // Read all signals
  const allSignals = await reader.readAllSignals();

  // Cited signals (from wiki frontmatter.signals)
  const citedIds = new Set<string>(
    Array.isArray(wikiFrontmatter.signals) ? wikiFrontmatter.signals : [],
  );
  const citedSignals = allSignals.filter((s) => citedIds.has(s.frontmatter.id));

  // Related signals — same entities, up to 10 extra (not already cited)
  const wikiEntities = new Set<string>(
    (Array.isArray(wikiFrontmatter.tags) ? wikiFrontmatter.tags : []).map((t: string) =>
      t.toLowerCase(),
    ),
  );
  const relatedSignals: Signal[] = [];
  for (const signal of allSignals) {
    if (citedIds.has(signal.frontmatter.id)) continue;
    const hasOverlap = signal.frontmatter.entities.some((e) => wikiEntities.has(e.toLowerCase()));
    if (hasOverlap) {
      relatedSignals.push(signal);
      if (relatedSignals.length >= 10) break;
    }
  }

  const relevantSignals = [...citedSignals, ...relatedSignals];

  // 2. Draft (LLM)
  const draftPrompt = buildDraftPostPrompt({
    wikiContent: wikiContent.trim(),
    signals: relevantSignals.map((s) => ({
      id: s.frontmatter.id,
      claim: s.frontmatter.claim,
    })),
    angle,
  });

  const draft = await llm.complete({
    system: draftPrompt.system,
    user: draftPrompt.user,
    schema: BlogDraftSchema,
  });

  // 3. Enrich (LLM)
  const enrichPrompt = buildEnrichPostPrompt({
    title: draft.title,
    content: draft.body,
  });

  const enrichment = await llm.complete({
    system: enrichPrompt.system,
    user: enrichPrompt.user,
    schema: EnrichmentSchema,
  });

  // 4. Build frontmatter
  const slug = slugify(draft.title);
  const wordCount = draft.body.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const publishDate = new Date().toISOString();

  const frontmatter: Record<string, unknown> = {
    post_type: 'blog_post',
    title: draft.title,
    slug,
    description: enrichment.description,
    publish_date: publishDate,
    author,
    tags: enrichment.tags,
    reading_time: readingTime,
  };

  // Add FAQ if non-empty
  if (enrichment.faq && enrichment.faq.length > 0) {
    frontmatter.faq = enrichment.faq;
  }

  // 5. Write
  const today = new Date().toISOString().split('T')[0];
  const relativePath = `content/blog/${today}-${slug}.md`;
  const content = matter.stringify(draft.body, frontmatter);

  await writer.writeContent(relativePath, content);

  // Log
  await writer.appendLog(
    'publish',
    wikiPagePath,
    `blog draft created: ${draft.title}`,
    [relativePath],
  );

  return { path: relativePath, slug };
}
