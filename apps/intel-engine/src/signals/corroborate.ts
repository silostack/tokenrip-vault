import type { Signal } from '../types';

export interface CorroborationMatch {
  existingSignalId: string;
  type: 'supporting' | 'contradicting';
  sharedEntities: string[];
  sharedProblems: string[];
}

function tokenize(text: string): Set<string> {
  return new Set(
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter((w) => w.length > 2),
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function findCorroborations(
  newSignal: Signal,
  existingSignals: Signal[],
  similarityThreshold: number = 0.25,
): CorroborationMatch[] {
  const matches: CorroborationMatch[] = [];
  const newTokens = tokenize(newSignal.frontmatter.claim);

  for (const existing of existingSignals) {
    if (existing.frontmatter.id === newSignal.frontmatter.id) continue;

    const setExisting = new Set(existing.frontmatter.entities);
    const sharedEntities = newSignal.frontmatter.entities.filter((e) => setExisting.has(e));

    const setProblems = new Set(existing.frontmatter.problems);
    const sharedProblems = newSignal.frontmatter.problems.filter((p) => setProblems.has(p));

    if (sharedEntities.length === 0 && sharedProblems.length === 0) continue;

    const similarity = jaccardSimilarity(newTokens, tokenize(existing.frontmatter.claim));
    if (similarity >= similarityThreshold) {
      matches.push({
        existingSignalId: existing.frontmatter.id,
        type: 'supporting',
        sharedEntities,
        sharedProblems,
      });
    }
  }

  return matches;
}
