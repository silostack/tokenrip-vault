import matter from 'gray-matter';
import { SignalFrontmatterSchema, type Signal } from '../types';

function coerceDates(data: Record<string, unknown>): void {
  for (const key of Object.keys(data)) {
    if (data[key] instanceof Date) {
      data[key] = (data[key] as Date).toISOString().split('T')[0];
    }
  }
}

export function parseSignal(raw: string, filePath: string): Signal {
  const { data, content } = matter(raw);
  coerceDates(data);
  const frontmatter = SignalFrontmatterSchema.parse(data);
  return { frontmatter, body: content.trim(), filePath };
}

export function serializeSignal(signal: Signal): string {
  return matter.stringify(signal.body, signal.frontmatter);
}
