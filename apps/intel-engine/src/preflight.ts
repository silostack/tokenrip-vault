import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export const REQUIRED_DIRS = [
  'signals/by-entity',
  'signals/by-problem',
  'content/blog',
  'content/briefs',
  'sources/inbox/processed',
  'sources/inbox/failed',
  'sources/articles',
];

export async function preflight(repoPath: string): Promise<void> {
  for (const dir of REQUIRED_DIRS) {
    await mkdir(join(repoPath, dir), { recursive: true });
  }
}
