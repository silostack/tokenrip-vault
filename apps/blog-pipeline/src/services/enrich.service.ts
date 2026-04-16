import Anthropic from '@anthropic-ai/sdk';

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

export async function enrichContent(
  title: string,
  content: string,
  apiKey: string,
  model: string,
): Promise<EnrichmentResult> {
  const client = new Anthropic({ apiKey });
  const { system, user } = buildEnrichPrompt(title, content);

  const response = await client.messages.create({
    model,
    max_tokens: 2048,
    system,
    messages: [{ role: 'user', content: user }],
  });

  const text = response.content[0].type === 'text'
    ? response.content[0].text
    : '';

  return JSON.parse(text);
}
