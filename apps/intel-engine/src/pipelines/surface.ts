import type { LLMClient } from '../llm/client';
import { EditorialBriefSchema } from '../llm/schemas';
import { buildEditorialBriefPrompt } from '../llm/prompts/editorial-brief';
import { RepoReader } from '../repo/reader';
import { RepoWriter } from '../repo/writer';
import { extractWikiLinks } from '../wiki/cross-ref';
import type { Signal, WikiPage, SurfaceResult } from '../types';

export interface SurfaceParams {
  repoPath: string;
  llm: LLMClient;
}

interface SignalSummary {
  entity: string;
  count: number;
  topClaims: string[];
}

/**
 * Surface pipeline: signals + wiki -> editorial brief.
 *
 * Steps:
 * 1. Scan — read all signals and wiki pages
 * 2. Analyze — compute summaries and health metrics
 * 3. Editorial brief — LLM generates story candidates
 * 4. Write — format brief as markdown and write to content/briefs/
 */
export async function surface(params: SurfaceParams): Promise<SurfaceResult> {
  const { repoPath, llm } = params;
  const reader = new RepoReader(repoPath);
  const writer = new RepoWriter(repoPath);

  // 1. Scan
  const signals = await reader.readAllSignals();
  const wikiPages = await reader.readAllWikiPages();

  // 2. Analyze
  const signalSummaries = computeSignalSummaries(signals);
  const stalePages = findStalePages(wikiPages);
  const signalStarvedPages = findSignalStarvedPages(wikiPages);
  const orphanPages = findOrphanPages(wikiPages);
  const coverageGaps = findCoverageGaps(signals, wikiPages);

  // 3. Editorial brief (LLM)
  const prompt = buildEditorialBriefPrompt({
    signalSummaries,
    stalePages: stalePages.map((p) => p.frontmatter.title),
    coverageGaps,
  });

  const brief = await llm.complete({
    system: prompt.system,
    user: prompt.user,
    schema: EditorialBriefSchema,
  });

  // 4. Write
  const today = new Date().toISOString().split('T')[0];
  const briefPath = `content/briefs/${today}-brief.md`;
  const briefMarkdown = formatBrief(brief, {
    totalSignals: signals.length,
    totalWikiPages: wikiPages.length,
    stalePages: stalePages.length,
    signalStarvedPages: signalStarvedPages.length,
    orphanPages: orphanPages.length,
    coverageGaps: coverageGaps.length,
  });

  await writer.writeContent(briefPath, briefMarkdown);

  // Log
  await writer.appendLog(
    'surface',
    'all signals + wiki',
    `brief generated with ${brief.candidates.length} story candidates`,
    [briefPath],
  );

  return {
    briefPath,
    metrics: {
      totalSignals: signals.length,
      totalWikiPages: wikiPages.length,
      stalePages: stalePages.length,
      signalStarvedPages: signalStarvedPages.length,
      orphanPages: orphanPages.length,
      coverageGaps: coverageGaps.length,
    },
  };
}

/**
 * Group signals by entity, count, and extract top claims sorted by corroboration.
 */
function computeSignalSummaries(signals: Signal[]): SignalSummary[] {
  const byEntity = new Map<string, Signal[]>();

  for (const signal of signals) {
    for (const entity of signal.frontmatter.entities) {
      const key = entity.toLowerCase();
      if (!byEntity.has(key)) {
        byEntity.set(key, []);
      }
      byEntity.get(key)!.push(signal);
    }
  }

  const summaries: SignalSummary[] = [];
  for (const [entity, entitySignals] of byEntity) {
    // Sort by corroboration count descending
    const sorted = [...entitySignals].sort(
      (a, b) => b.frontmatter.corroboration.count - a.frontmatter.corroboration.count,
    );
    const topClaims = sorted.slice(0, 5).map((s) => s.frontmatter.claim);

    summaries.push({
      entity,
      count: entitySignals.length,
      topClaims,
    });
  }

  // Sort summaries by signal count descending
  summaries.sort((a, b) => b.count - a.count);

  return summaries;
}

/**
 * Find wiki pages where `updated` is older than 14 days.
 */
function findStalePages(pages: WikiPage[]): WikiPage[] {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  return pages.filter((page) => {
    const updated = new Date(page.frontmatter.updated);
    return updated < fourteenDaysAgo;
  });
}

/**
 * Find wiki pages with empty signals array.
 */
function findSignalStarvedPages(pages: WikiPage[]): WikiPage[] {
  return pages.filter(
    (page) => !page.frontmatter.signals || page.frontmatter.signals.length === 0,
  );
}

/**
 * Find pages not referenced via [[link]] in any other page's body.
 */
function findOrphanPages(pages: WikiPage[]): WikiPage[] {
  // Collect all wiki links from all pages
  const referencedTitles = new Set<string>();
  for (const page of pages) {
    const links = extractWikiLinks(page.body);
    for (const link of links) {
      referencedTitles.add(link.toLowerCase());
    }
  }

  // A page is orphan if its title is not referenced by any OTHER page
  // We need to exclude self-references
  return pages.filter((page) => {
    const title = page.frontmatter.title.toLowerCase();
    // Check if any OTHER page references this page
    for (const otherPage of pages) {
      if (otherPage.filePath === page.filePath) continue;
      const otherLinks = extractWikiLinks(otherPage.body);
      if (otherLinks.some((link) => link.toLowerCase() === title)) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Find entity names from signals that don't have a matching wiki page.
 * Matches by filename (without extension) or title.
 */
function findCoverageGaps(signals: Signal[], pages: WikiPage[]): string[] {
  // Collect all entity names from signals
  const entityNames = new Set<string>();
  for (const signal of signals) {
    for (const entity of signal.frontmatter.entities) {
      entityNames.add(entity.toLowerCase());
    }
  }

  // Build set of known page identifiers (title and filename slug)
  const knownPages = new Set<string>();
  for (const page of pages) {
    knownPages.add(page.frontmatter.title.toLowerCase());
    // Extract filename without extension
    const filename = page.filePath.split('/').pop()?.replace(/\.md$/, '') ?? '';
    knownPages.add(filename.toLowerCase());
  }

  // Find entities without a matching page
  const gaps: string[] = [];
  for (const entity of entityNames) {
    if (!knownPages.has(entity)) {
      gaps.push(entity);
    }
  }

  return gaps.sort();
}

/**
 * Format the editorial brief as markdown.
 */
function formatBrief(
  brief: { candidates: Array<{ title: string; angle: string; signal_ids: string[]; entities: string[] }>; trends: string[]; gaps: string[] },
  metrics: SurfaceResult['metrics'],
): string {
  const today = new Date().toISOString().split('T')[0];
  const lines: string[] = [];

  lines.push(`# Editorial Brief — ${today}`);
  lines.push('');

  // Story Candidates
  lines.push('## Story Candidates');
  lines.push('');
  for (const candidate of brief.candidates) {
    lines.push(`### ${candidate.title}`);
    lines.push('');
    lines.push(`**Angle:** ${candidate.angle}`);
    lines.push('');
    if (candidate.entities.length > 0) {
      lines.push(`**Entities:** ${candidate.entities.join(', ')}`);
      lines.push('');
    }
    lines.push(`**Supporting signals:** ${candidate.signal_ids.join(', ')}`);
    lines.push('');
  }

  // Trends
  lines.push('## Trends');
  lines.push('');
  if (brief.trends.length > 0) {
    for (const trend of brief.trends) {
      lines.push(`- ${trend}`);
    }
  } else {
    lines.push('(none identified)');
  }
  lines.push('');

  // Gaps
  lines.push('## Gaps');
  lines.push('');
  if (brief.gaps.length > 0) {
    for (const gap of brief.gaps) {
      lines.push(`- ${gap}`);
    }
  } else {
    lines.push('(none identified)');
  }
  lines.push('');

  // Wiki Health
  lines.push('## Wiki Health');
  lines.push('');
  lines.push(`| Metric | Count |`);
  lines.push(`|---|---|`);
  lines.push(`| Total signals | ${metrics.totalSignals} |`);
  lines.push(`| Total wiki pages | ${metrics.totalWikiPages} |`);
  lines.push(`| Stale pages (>14 days) | ${metrics.stalePages} |`);
  lines.push(`| Signal-starved pages | ${metrics.signalStarvedPages} |`);
  lines.push(`| Orphan pages | ${metrics.orphanPages} |`);
  lines.push(`| Coverage gaps | ${metrics.coverageGaps} |`);
  lines.push('');

  return lines.join('\n');
}
