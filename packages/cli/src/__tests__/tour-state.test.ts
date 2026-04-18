import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { loadTourState, saveTourState, clearTourState, TOUR_FILE } from '../tour/state.js';

let tmpDir: string;
const origEnv = process.env.TOKENRIP_CONFIG_DIR;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tour-state-'));
  process.env.TOKENRIP_CONFIG_DIR = tmpDir;
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  if (origEnv === undefined) delete process.env.TOKENRIP_CONFIG_DIR;
  else process.env.TOKENRIP_CONFIG_DIR = origEnv;
});

describe('tour state', () => {
  test('loadTourState returns null when file does not exist', () => {
    expect(loadTourState()).toBeNull();
  });

  test('saveTourState then loadTourState roundtrips', () => {
    saveTourState({ step: 2, assetId: 'abc123', threadId: null, startedAt: '2026-04-17T00:00:00Z' });
    const loaded = loadTourState();
    expect(loaded).toEqual({ step: 2, assetId: 'abc123', threadId: null, startedAt: '2026-04-17T00:00:00Z' });
  });

  test('clearTourState removes the file', () => {
    saveTourState({ step: 1, assetId: null, threadId: null, startedAt: '2026-04-17T00:00:00Z' });
    clearTourState();
    expect(loadTourState()).toBeNull();
  });

  test('TOUR_FILE respects TOKENRIP_CONFIG_DIR override', () => {
    expect(TOUR_FILE()).toBe(path.join(tmpDir, 'tour.json'));
  });
});
