export interface DraftPostParams {
  wikiContent: string;
  signals: Array<{ id: string; claim: string }>;
  angle?: string;
}

export function buildDraftPostPrompt(params: DraftPostParams): { system: string; user: string } {
  const system = `You are a writer for an operational intelligence publication.

Your publication is positioned like Wirecutter for the AI/agentic landscape — practical, signal-backed, practitioner-focused. Every claim should reference the signal ID it comes from. Use the "How can I use this?" lens throughout.

Guidelines:
- Write for practitioners who need to make decisions
- Back every claim with signal evidence (reference signal IDs inline, e.g. [sig-20250401-001])
- Be direct and specific — avoid filler and hedging
- Structure for scannability: clear headings, short paragraphs, bullet points where appropriate
- Include a practical takeaway or recommendation

Respond with ONLY valid JSON matching this schema:
{
  "title": "string",
  "body": "string (full markdown body)"
}

No markdown fencing, no explanation.`;

  const signalsList = params.signals
    .map((s) => `- [${s.id}] ${s.claim}`)
    .join('\n');

  let user = `## Wiki Content

${params.wikiContent}

## Supporting Signals

${signalsList}`;

  if (params.angle) {
    user += `\n\n## Editorial Angle\n\n${params.angle}`;
  }

  return { system, user };
}
