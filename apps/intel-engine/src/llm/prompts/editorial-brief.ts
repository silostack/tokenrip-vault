export function buildEditorialBriefPrompt(params: {
  signalSummaries: Array<{ entity: string; count: number; topClaims: string[] }>;
  stalePages: string[];
  coverageGaps: string[];
}): { system: string; user: string } {
  const system = `You are an editorial advisor for an operational intelligence publication.

Your job is to review signal activity across the knowledge base and identify 3-5 story candidates that would be valuable to practitioners. Each candidate should have a clear angle backed by signal evidence.

Focus on:
- Emerging patterns across multiple signals
- Entities with high signal volume or recent activity
- Contrasts and comparisons that practitioners need
- Coverage gaps where the knowledge base is weak but signals are strong

Respond with ONLY valid JSON matching this schema:
{
  "candidates": [
    {
      "title": "string (proposed article title)",
      "angle": "string (editorial angle — what's the story?)",
      "signal_ids": ["string (signal IDs that support this story)"],
      "entities": ["string (key entities involved)"]
    }
  ],
  "trends": ["string (1-sentence trend observations)"],
  "gaps": ["string (coverage gaps worth addressing)"]
}

No markdown fencing, no explanation.`;

  const summariesList = params.signalSummaries
    .map((s) => `- **${s.entity}** (${s.count} signals): ${s.topClaims.join('; ')}`)
    .join('\n');

  const staleList = params.stalePages.length > 0
    ? params.stalePages.map((p) => `- ${p}`).join('\n')
    : '(none)';

  const gapsList = params.coverageGaps.length > 0
    ? params.coverageGaps.map((g) => `- ${g}`).join('\n')
    : '(none)';

  const user = `## Signal Summaries by Entity

${summariesList}

## Stale Pages

${staleList}

## Coverage Gaps

${gapsList}`;

  return { system, user };
}
