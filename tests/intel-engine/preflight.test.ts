import { describe, test, expect, afterEach } from 'bun:test';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { preflight, REQUIRED_DIRS } from '../../apps/intel-engine/src/preflight';

describe('preflight', () => {
  let tempDir: string;

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  test('REQUIRED_DIRS contains expected directories', () => {
    expect(REQUIRED_DIRS).toContain('signals/by-entity');
    expect(REQUIRED_DIRS).toContain('signals/by-problem');
    expect(REQUIRED_DIRS).toContain('content/blog');
    expect(REQUIRED_DIRS).toContain('content/briefs');
    expect(REQUIRED_DIRS).toContain('sources/inbox/processed');
    expect(REQUIRED_DIRS).toContain('sources/inbox/failed');
    expect(REQUIRED_DIRS).toContain('sources/articles');
  });

  test('creates all required directories', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-preflight-'));
    await preflight(tempDir);

    for (const dir of REQUIRED_DIRS) {
      const dirStat = await stat(join(tempDir, dir));
      expect(dirStat.isDirectory()).toBe(true);
    }
  });

  test('running preflight twice is idempotent', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-preflight-'));
    await preflight(tempDir);
    // Should not throw
    await preflight(tempDir);

    for (const dir of REQUIRED_DIRS) {
      const dirStat = await stat(join(tempDir, dir));
      expect(dirStat.isDirectory()).toBe(true);
    }
  });
});
