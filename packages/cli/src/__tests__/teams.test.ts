import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokenrip-teams-'));
  process.env.TOKENRIP_CONFIG_DIR = tmpDir;
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  delete process.env.TOKENRIP_CONFIG_DIR;
});

describe('loadTeams', () => {
  test('returns empty object when file does not exist', async () => {
    const { loadTeams } = await import('../teams.js');
    expect(loadTeams()).toEqual({});
  });

  test('loads teams from file', async () => {
    const teams = { rebelfi: { id: 'uuid-1', name: 'RebelFi', slug: 'rebelfi', role: 'owner' as const, syncedAt: '2026-04-20T00:00:00Z' } };
    fs.writeFileSync(path.join(tmpDir, 'teams.json'), JSON.stringify(teams));
    const { loadTeams } = await import('../teams.js');
    expect(loadTeams()).toEqual(teams);
  });
});

describe('saveTeams', () => {
  test('creates directory and writes file', async () => {
    const nestedDir = path.join(tmpDir, 'nested');
    process.env.TOKENRIP_CONFIG_DIR = nestedDir;
    const { saveTeams } = await import('../teams.js');
    saveTeams({ rebelfi: { id: 'uuid-1', name: 'RebelFi', slug: 'rebelfi', role: 'owner', syncedAt: '2026-04-20T00:00:00Z' } });
    const raw = fs.readFileSync(path.join(nestedDir, 'teams.json'), 'utf-8');
    expect(JSON.parse(raw).rebelfi.slug).toBe('rebelfi');
  });
});

describe('resolveTeam', () => {
  test('returns slug when input matches a slug key', async () => {
    const teams = {
      rebelfi: { id: 'uuid-1', name: 'RebelFi', slug: 'rebelfi', role: 'owner' as const, syncedAt: '2026-04-20T00:00:00Z' },
    };
    fs.writeFileSync(path.join(tmpDir, 'teams.json'), JSON.stringify(teams));
    const { resolveTeam } = await import('../teams.js');
    expect(resolveTeam('rebelfi')).toBe('rebelfi');
  });

  test('resolves alias to slug', async () => {
    const teams = {
      rebelfi: { id: 'uuid-1', name: 'RebelFi', slug: 'rebelfi', alias: 'rf', role: 'owner' as const, syncedAt: '2026-04-20T00:00:00Z' },
    };
    fs.writeFileSync(path.join(tmpDir, 'teams.json'), JSON.stringify(teams));
    const { resolveTeam } = await import('../teams.js');
    expect(resolveTeam('rf')).toBe('rebelfi');
  });

  test('passes through unknown value unchanged', async () => {
    const { resolveTeam } = await import('../teams.js');
    expect(resolveTeam('unknown-team')).toBe('unknown-team');
  });
});

describe('resolveTeams', () => {
  test('resolves array of mixed aliases and slugs', async () => {
    const teams = {
      rebelfi: { id: 'uuid-1', name: 'RebelFi', slug: 'rebelfi', alias: 'rf', role: 'owner' as const, syncedAt: '2026-04-20T00:00:00Z' },
      'simon-agents': { id: 'uuid-2', name: "Simon's Agents", slug: 'simon-agents', alias: 'sa', role: 'member' as const, syncedAt: '2026-04-20T00:00:00Z' },
    };
    fs.writeFileSync(path.join(tmpDir, 'teams.json'), JSON.stringify(teams));
    const { resolveTeams } = await import('../teams.js');
    expect(resolveTeams(['rf', 'simon-agents', 'unknown'])).toEqual(['rebelfi', 'simon-agents', 'unknown']);
  });
});

describe('setAlias', () => {
  test('sets alias on existing team', async () => {
    const teams = {
      rebelfi: { id: 'uuid-1', name: 'RebelFi', slug: 'rebelfi', role: 'owner' as const, syncedAt: '2026-04-20T00:00:00Z' },
    };
    fs.writeFileSync(path.join(tmpDir, 'teams.json'), JSON.stringify(teams));
    const { setAlias, loadTeams } = await import('../teams.js');
    setAlias('rebelfi', 'rf');
    expect(loadTeams().rebelfi.alias).toBe('rf');
  });

  test('throws when team slug not found locally', async () => {
    const { setAlias } = await import('../teams.js');
    expect(() => setAlias('nonexistent', 'x')).toThrow();
  });
});

describe('removeAlias', () => {
  test('removes alias from team', async () => {
    const teams = {
      rebelfi: { id: 'uuid-1', name: 'RebelFi', slug: 'rebelfi', alias: 'rf', role: 'owner' as const, syncedAt: '2026-04-20T00:00:00Z' },
    };
    fs.writeFileSync(path.join(tmpDir, 'teams.json'), JSON.stringify(teams));
    const { removeAlias, loadTeams } = await import('../teams.js');
    removeAlias('rebelfi');
    expect(loadTeams().rebelfi.alias).toBeUndefined();
  });
});

describe('syncTeamsFromResponse', () => {
  test('populates teams from server response', async () => {
    const { syncTeamsFromResponse, loadTeams } = await import('../teams.js');
    const serverTeams = [
      { id: 'uuid-1', name: 'RebelFi', slug: 'rebelfi', role: 'owner' },
      { id: 'uuid-2', name: "Simon's Agents", slug: 'simon-agents', role: 'member' },
    ];
    syncTeamsFromResponse(serverTeams);
    const teams = loadTeams();
    expect(Object.keys(teams)).toEqual(['rebelfi', 'simon-agents']);
    expect(teams.rebelfi.id).toBe('uuid-1');
    expect(teams['simon-agents'].role).toBe('member');
  });

  test('preserves existing aliases on sync', async () => {
    const existing = {
      rebelfi: { id: 'uuid-1', name: 'RebelFi', slug: 'rebelfi', alias: 'rf', role: 'owner' as const, syncedAt: '2026-04-19T00:00:00Z' },
    };
    fs.writeFileSync(path.join(tmpDir, 'teams.json'), JSON.stringify(existing));
    const { syncTeamsFromResponse, loadTeams } = await import('../teams.js');
    syncTeamsFromResponse([{ id: 'uuid-1', name: 'RebelFi Updated', slug: 'rebelfi', role: 'owner' }]);
    const teams = loadTeams();
    expect(teams.rebelfi.alias).toBe('rf');
    expect(teams.rebelfi.name).toBe('RebelFi Updated');
  });

  test('removes teams no longer on server', async () => {
    const existing = {
      rebelfi: { id: 'uuid-1', name: 'RebelFi', slug: 'rebelfi', role: 'owner' as const, syncedAt: '2026-04-19T00:00:00Z' },
      'old-team': { id: 'uuid-old', name: 'Old', slug: 'old-team', role: 'member' as const, syncedAt: '2026-04-19T00:00:00Z' },
    };
    fs.writeFileSync(path.join(tmpDir, 'teams.json'), JSON.stringify(existing));
    const { syncTeamsFromResponse, loadTeams } = await import('../teams.js');
    syncTeamsFromResponse([{ id: 'uuid-1', name: 'RebelFi', slug: 'rebelfi', role: 'owner' }]);
    const teams = loadTeams();
    expect(Object.keys(teams)).toEqual(['rebelfi']);
  });
});
