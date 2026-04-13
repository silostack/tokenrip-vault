export interface UpdateWikiParams {
  signals: Array<{ id: string; claim: string; entities: string[] }>;
  existingPages: Array<{ path: string; content: string }>;
  indexContent: string;
}

export function buildUpdateWikiPrompt(params: UpdateWikiParams): { system: string; user: string } {
  const system = `You are a wiki maintainer for an operational intelligence knowledge base.

Your job is to decide which wiki pages need to be created or updated based on new signals. The knowledge base serves practitioners who need to make decisions — every page should answer "How can I use this?"

Page types:
- "entity" — A tool, product, framework, or organization. What it does, strengths, weaknesses, practitioner signals.
- "concept" — An abstract topic (e.g., "prompt engineering"). What it is, techniques, tools involved, practitioner signals.
- "comparison" — Two or more entities or approaches contrasted. When to use each, tradeoffs, practitioner signals.
- "synthesis" — A cross-cutting theme or emerging pattern. Connects multiple entities and concepts.

Guidelines:
- Create a new page only if no existing page covers the entity/concept
- Update existing pages by incorporating new signal evidence
- Every claim in a wiki page should reference the signal ID it came from
- Use the "How can I use this?" lens — focus on actionable, practitioner-relevant content
- Keep pages concise and scannable

Respond with ONLY valid JSON matching this schema:
{
  "updates": [
    {
      "path": "string (wiki page path, e.g. wiki/entities/cursor.md)",
      "action": "create" | "update",
      "title": "string",
      "type": "entity" | "concept" | "comparison" | "synthesis",
      "tags": ["string"],
      "body": "string (full markdown body for create, or new section to append for update)"
    }
  ]
}

No markdown fencing, no explanation.`;

  const signalsList = params.signals
    .map((s) => `- [${s.id}] ${s.claim} (entities: ${s.entities.join(', ')})`)
    .join('\n');

  const pagesList = params.existingPages
    .map((p) => `### ${p.path}\n${p.content}`)
    .join('\n\n');

  const user = `## New Signals

${signalsList}

## Existing Affected Pages

${pagesList || '(none)'}

## Current Index

${params.indexContent}`;

  return { system, user };
}
