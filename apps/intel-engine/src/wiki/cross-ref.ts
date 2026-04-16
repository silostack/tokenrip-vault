export interface PageIndex {
  entities: string[];
  tags: string[];
}

export function extractWikiLinks(content: string): string[] {
  return [...new Set(Array.from(content.matchAll(/\[\[([^\]]+)\]\]/g), (m) => m[1]))];
}

export function findAffectedPages(
  names: string[],
  wikiIndex: Map<string, PageIndex>,
): string[] {
  const affected: string[] = [];
  const nameSet = new Set(names.map((n) => n.toLowerCase()));

  for (const [path, index] of wikiIndex) {
    const hasEntityOverlap = index.entities.some((e) =>
      nameSet.has(e.toLowerCase()),
    );
    const hasTagOverlap = index.tags.some((t) =>
      nameSet.has(t.toLowerCase()),
    );

    if (hasEntityOverlap || hasTagOverlap) {
      affected.push(path);
    }
  }

  return affected;
}
