import matter from 'gray-matter';
import type { LLMClient } from '../llm/client';
import { BlogDraftSchema, EnrichmentSchema } from '../llm/schemas';
import { buildDraftPostPrompt } from '../llm/prompts/draft-post';
import { buildEnrichPostPrompt } from '../llm/prompts/enrich-post';
import { RepoReader } from '../repo/reader';
import { RepoWriter } from '../repo/writer';
import type { PublishResult, Signal } from '../types';

export interface PublishParams {
  wikiPagePath: string;
  repoPath: string;
  llm: LLMClient;
  angle?: string;
  author?: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function publish(params: PublishParams): Promise<PublishResult> {
  const { wikiPagePath, repoPath, llm, angle, author = 'Tokenrip' } = params;
  const reader = new RepoReader(repoPath);
  const writer = new RepoWriter(repoPath);

  // Gather wiki page and signals
  const wikiRaw = await reader.readFile(wikiPagePath);
  const { data: wikiFrontmatter, content: wikiContent } = matter(wikiRaw);
  const allSignals = await reader.readAllSignals();

  const citedIds = new Set<string>(
    Array.isArray(wikiFrontmatter.signals) ? wikiFrontmatter.signals : [],
  );
  const citedSignals = allSignals.filter((s) => citedIds.has(s.frontmatter.id));

  const wikiEntities = new Set<string>(
    (Array.isArray(wikiFrontmatter.tags) ? wikiFrontmatter.tags : []).map((t: string) =>
      t.toLowerCase(),
    ),
  );
  const relatedSignals: Signal[] = [];
  for (const signal of allSignals) {
    if (citedIds.has(signal.frontmatter.id)) continue;
    if (signal.frontmatter.entities.some((e) => wikiEntities.has(e.toLowerCase()))) {
      relatedSignals.push(signal);
      if (relatedSignals.length >= 10) break;
    }
  }

  const relevantSignals = [...citedSignals, ...relatedSignals];

  // Draft via LLM
  const draftPrompt = buildDraftPostPrompt({
    wikiContent: wikiContent.trim(),
    signals: relevantSignals.map((s) => ({ id: s.frontmatter.id, claim: s.frontmatter.claim })),
    angle,
  });
  const draft = await llm.complete({
    system: draftPrompt.system,
    user: draftPrompt.user,
    schema: BlogDraftSchema,
  });

  // Enrich via LLM
  const enrichPrompt = buildEnrichPostPrompt({ title: draft.title, content: draft.body });
  const enrichment = await llm.complete({
    system: enrichPrompt.system,
    user: enrichPrompt.user,
    schema: EnrichmentSchema,
  });

  // Build frontmatter and write
  const slug = slugify(draft.title);
  const wordCount = draft.body.split(/\s+/).length;
  const frontmatter: Record<string, unknown> = {
    post_type: 'blog_post',
    title: draft.title,
    slug,
    description: enrichment.description,
    publish_date: new Date().toISOString(),
    author,
    tags: enrichment.tags,
    reading_time: Math.max(1, Math.ceil(wordCount / 200)),
  };
  if (enrichment.faq && enrichment.faq.length > 0) {
    frontmatter.faq = enrichment.faq;
  }

  const today = new Date().toISOString().split('T')[0];
  const relativePath = `content/blog/${today}-${slug}.md`;
  await writer.writeContent(relativePath, matter.stringify(draft.body, frontmatter));
  await writer.appendLog('publish', wikiPagePath, `blog draft created: ${draft.title}`, [relativePath]);

  return { path: relativePath, slug };
}
