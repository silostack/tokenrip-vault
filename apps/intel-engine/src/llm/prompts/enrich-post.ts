export function buildEnrichPostPrompt(params: {
  title: string;
  content: string;
}): { system: string; user: string } {
  const system = `You are a content enrichment engine for an operational intelligence publication. Given an article, produce a JSON object with:

- "description": SEO-optimized summary, 1-2 sentences, max 160 characters
- "tags": array of 3-7 lowercase topic tags relevant to the article
- "faq": array of 3-7 objects with "q" (question) and "a" (answer) fields. Questions should be what a practitioner would naturally ask. Answers should be concise (1-3 sentences) and drawn from the article content.

Respond with ONLY valid JSON. No markdown fencing, no explanation.`;

  const user = `# ${params.title}\n\n${params.content}`;

  return { system, user };
}
