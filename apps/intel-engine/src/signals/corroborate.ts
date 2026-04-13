import type { Signal } from '../types';

export interface CorroborationMatch {
  existingSignalId: string;
  type: 'supporting' | 'contradicting';
  sharedEntities: string[];
  sharedProblems: string[];
}

function intersect(a: string[], b: string[]): string[] {
  const setB = new Set(b);
  return a.filter((item) => setB.has(item));
}

function tokenize(text: string): Set<string> {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '');
  const words = cleaned.split(/\s+/).filter((w) => w.length > 2);
  return new Set(words);
}

function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;

  let intersectionSize = 0;
  for (const item of setA) {
    if (setB.has(item)) intersectionSize++;
  }

  const unionSize = setA.size + setB.size - intersectionSize;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
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

    const sharedEntities = intersect(
      newSignal.frontmatter.entities,
      existing.frontmatter.entities,
    );
    const sharedProblems = intersect(
      newSignal.frontmatter.problems,
      existing.frontmatter.problems,
    );

    if (sharedEntities.length === 0 && sharedProblems.length === 0) continue;

    const existingTokens = tokenize(existing.frontmatter.claim);
    const similarity = jaccardSimilarity(newTokens, existingTokens);

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
