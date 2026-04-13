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

export async function surface(params: SurfaceParams): Promise<SurfaceResult> {
  const { repoPath, llm } = params;
  const reader = new RepoReader(repoPath);
  const writer = new RepoWriter(repoPath);

  const signals = await reader.readAllSignals();
  const wikiPages = await reader.readAllWikiPages();

  const signalSummaries = computeSignalSummaries(signals);
  const stalePages = findStalePages(wikiPages);
  const signalStarvedPages = wikiPages.filter(
    (p) => !p.frontmatter.signals || p.frontmatter.signals.length === 0,
  );
  const orphanPages = findOrphanPages(wikiPages);
  const coverageGaps = findCoverageGaps(signals, wikiPages);

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

  const today = new Date().toISOString().split('T')[0];
  const briefPath = `content/briefs/${today}-brief.md`;
  const metrics: SurfaceResult['metrics'] = {
    totalSignals: signals.length,
    totalWikiPages: wikiPages.length,
    stalePages: stalePages.length,
    signalStarvedPages: signalStarvedPages.length,
    orphanPages: orphanPages.length,
    coverageGaps: coverageGaps.length,
  };

  await writer.writeContent(briefPath, formatBrief(brief, metrics, today));
  await writer.appendLog(
    'surface',
    'all signals + wiki',
    `brief generated with ${brief.candidates.length} story candidates`,
    [briefPath],
  );

  return { briefPath, metrics };
}

function computeSignalSummaries(signals: Signal[]): Array<{ entity: string; count: number; topClaims: string[] }> {
  const byEntity = new Map<string, Signal[]>();
  for (const signal of signals) {
    for (const entity of signal.frontmatter.entities) {
      const key = entity.toLowerCase();
      const group = byEntity.get(key);
      if (group) {
        group.push(signal);
      } else {
        byEntity.set(key, [signal]);
      }
    }
  }

  return [...byEntity.entries()]
    .map(([entity, entitySignals]) => ({
      entity,
      count: entitySignals.length,
      topClaims: [...entitySignals]
        .sort((a, b) => b.frontmatter.corroboration.count - a.frontmatter.corroboration.count)
        .slice(0, 5)
        .map((s) => s.frontmatter.claim),
    }))
    .sort((a, b) => b.count - a.count);
}

function findStalePages(pages: WikiPage[]): WikiPage[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);
  return pages.filter((p) => new Date(p.frontmatter.updated) < cutoff);
}

function findOrphanPages(pages: WikiPage[]): WikiPage[] {
  const referencedByOthers = new Map<string, Set<string>>();
  for (const page of pages) {
    for (const link of extractWikiLinks(page.body)) {
      const key = link.toLowerCase();
      const set = referencedByOthers.get(key);
      if (set) {
        set.add(page.filePath);
      } else {
        referencedByOthers.set(key, new Set([page.filePath]));
      }
    }
  }

  return pages.filter((page) => {
    const title = page.frontmatter.title.toLowerCase();
    const referrers = referencedByOthers.get(title);
    if (!referrers) return true;
    // Exclude self-references
    for (const referrer of referrers) {
      if (referrer !== page.filePath) return false;
    }
    return true;
  });
}

function findCoverageGaps(signals: Signal[], pages: WikiPage[]): string[] {
  const knownPages = new Set<string>();
  for (const page of pages) {
    knownPages.add(page.frontmatter.title.toLowerCase());
    const filename = page.filePath.split('/').pop()?.replace(/\.md$/, '') ?? '';
    knownPages.add(filename.toLowerCase());
  }

  const entityNames = new Set<string>();
  for (const signal of signals) {
    for (const entity of signal.frontmatter.entities) {
      entityNames.add(entity.toLowerCase());
    }
  }

  return [...entityNames].filter((e) => !knownPages.has(e)).sort();
}

function formatBrief(
  brief: { candidates: Array<{ title: string; angle: string; signal_ids: string[]; entities: string[] }>; trends: string[]; gaps: string[] },
  metrics: SurfaceResult['metrics'],
  today: string,
): string {
  let md = `# Editorial Brief — ${today}\n\n## Story Candidates\n\n`;

  for (const c of brief.candidates) {
    md += `### ${c.title}\n\n**Angle:** ${c.angle}\n\n`;
    if (c.entities.length > 0) md += `**Entities:** ${c.entities.join(', ')}\n\n`;
    md += `**Supporting signals:** ${c.signal_ids.join(', ')}\n\n`;
  }

  md += '## Trends\n\n';
  md += brief.trends.length > 0
    ? brief.trends.map((t) => `- ${t}`).join('\n')
    : '(none identified)';

  md += '\n\n## Gaps\n\n';
  md += brief.gaps.length > 0
    ? brief.gaps.map((g) => `- ${g}`).join('\n')
    : '(none identified)';

  md += `\n\n## Wiki Health

| Metric | Count |
|---|---|
| Total signals | ${metrics.totalSignals} |
| Total wiki pages | ${metrics.totalWikiPages} |
| Stale pages (>14 days) | ${metrics.stalePages} |
| Signal-starved pages | ${metrics.signalStarvedPages} |
| Orphan pages | ${metrics.orphanPages} |
| Coverage gaps | ${metrics.coverageGaps} |
`;

  return md;
}
