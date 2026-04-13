import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { loadConfig } from '../../apps/intel-engine/src/config';

describe('loadConfig', () => {
  let savedEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    savedEnv = { ...process.env };
    // Set required vars
    process.env.INTELIWIKI_PATH = '/tmp/test-wiki';
    process.env.ANTHROPIC_API_KEY = 'sk-test-key-123';
    // Clear optional
    delete process.env.ANTHROPIC_MODEL;
  });

  afterEach(() => {
    process.env = savedEnv;
  });

  test('returns config from env vars', () => {
    const config = loadConfig();
    expect(config.inteliwikiPath).toBe('/tmp/test-wiki');
    expect(config.anthropicApiKey).toBe('sk-test-key-123');
  });

  test('throws if INTELIWIKI_PATH is missing', () => {
    delete process.env.INTELIWIKI_PATH;
    expect(() => loadConfig()).toThrow('INTELIWIKI_PATH');
  });

  test('throws if ANTHROPIC_API_KEY is missing', () => {
    delete process.env.ANTHROPIC_API_KEY;
    expect(() => loadConfig()).toThrow('ANTHROPIC_API_KEY');
  });

  test('defaults model to claude-haiku-4-5-20251001', () => {
    const config = loadConfig();
    expect(config.anthropicModel).toBe('claude-haiku-4-5-20251001');
  });

  test('custom ANTHROPIC_MODEL override works', () => {
    process.env.ANTHROPIC_MODEL = 'claude-opus-4-20250514';
    const config = loadConfig();
    expect(config.anthropicModel).toBe('claude-opus-4-20250514');
  });
});
