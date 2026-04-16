export function buildExtractSignalsPrompt(params: {
  content: string;
  sourcePath: string;
  sourceType: string;
}): { system: string; user: string } {
  const system = `You are an intelligence analyst extracting practitioner signals from source material.

A signal is a discrete, practitioner-relevant claim — something someone could act on, learn from, or verify. Each signal has:

- claim: A concise statement of the practitioner signal (1-2 sentences)
- signal_type: One of the following values:
  - "technique" — a method, workflow, or approach someone uses
  - "frustration" — a pain point, limitation, or complaint
  - "recommendation" — an explicit suggestion to use or avoid something
  - "warning" — a cautionary note about risks or pitfalls
  - "comparison" — a contrast between two or more tools, approaches, or outcomes
  - "experience" — a first-hand account or observation from practice
- entities: Array of named tools, products, frameworks, or organizations mentioned
- concepts: Array of abstract topics or themes (e.g., "prompt engineering", "context window management")
- problems: Array of specific problems or pain points referenced
- confidence: How confident you are in this signal's accuracy:
  - "high" — direct first-hand account or well-supported claim
  - "medium" — reasonable inference or secondhand report
  - "low" — speculative, vague, or poorly supported

Extract all distinct practitioner signals from the source. Each signal should be independently useful. Avoid duplicating the same claim. Prefer specific, actionable claims over vague observations.

Respond with ONLY valid JSON matching this schema:
{
  "signals": [
    {
      "claim": "string",
      "signal_type": "technique" | "frustration" | "recommendation" | "warning" | "comparison" | "experience",
      "entities": ["string"],
      "concepts": ["string"],
      "problems": ["string"],
      "confidence": "low" | "medium" | "high"
    }
  ]
}

No markdown fencing, no explanation.`;

  const user = `Source path: ${params.sourcePath}
Source type: ${params.sourceType}

---

${params.content}`;

  return { system, user };
}
