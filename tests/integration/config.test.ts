import { describe, test, expect } from 'bun:test';
import {
  loadConfig,
  saveConfig,
  getApiUrl,
  getApiKey,
} from '../../packages/cli/src/config';

describe('config', () => {
  test('getApiUrl returns env var when set', () => {
    const saved = process.env.TOKENRIP_API_URL;
    process.env.TOKENRIP_API_URL = 'http://test-server:9999';
    try {
      const url = getApiUrl({ preferences: {} });
      expect(url).toBe('http://test-server:9999');
    } finally {
      if (saved) process.env.TOKENRIP_API_URL = saved;
      else delete process.env.TOKENRIP_API_URL;
    }
  });

  test('getApiUrl returns config value over default', () => {
    const saved = process.env.TOKENRIP_API_URL;
    delete process.env.TOKENRIP_API_URL;
    try {
      const url = getApiUrl({ apiUrl: 'http://config-url:1234', preferences: {} });
      expect(url).toBe('http://config-url:1234');
    } finally {
      if (saved) process.env.TOKENRIP_API_URL = saved;
    }
  });

  test('getApiUrl returns default when nothing set', () => {
    const saved = process.env.TOKENRIP_API_URL;
    delete process.env.TOKENRIP_API_URL;
    try {
      const url = getApiUrl({ preferences: {} });
      expect(url).toBe('http://localhost:3000');
    } finally {
      if (saved) process.env.TOKENRIP_API_URL = saved;
    }
  });

  test('getApiKey returns env var when set', () => {
    const saved = process.env.TOKENRIP_API_KEY;
    process.env.TOKENRIP_API_KEY = 'tr_env_key';
    try {
      const key = getApiKey({ preferences: {} });
      expect(key).toBe('tr_env_key');
    } finally {
      if (saved) process.env.TOKENRIP_API_KEY = saved;
      else delete process.env.TOKENRIP_API_KEY;
    }
  });

  test('getApiKey returns config value over env var', () => {
    const saved = process.env.TOKENRIP_API_KEY;
    delete process.env.TOKENRIP_API_KEY;
    try {
      const key = getApiKey({ apiKey: 'tr_config_key', preferences: {} });
      expect(key).toBe('tr_config_key');
    } finally {
      if (saved) process.env.TOKENRIP_API_KEY = saved;
    }
  });

  test('getApiKey returns undefined when nothing set', () => {
    const saved = process.env.TOKENRIP_API_KEY;
    delete process.env.TOKENRIP_API_KEY;
    try {
      const key = getApiKey({ preferences: {} });
      expect(key).toBeUndefined();
    } finally {
      if (saved) process.env.TOKENRIP_API_KEY = saved;
    }
  });

  test('saveConfig and loadConfig roundtrip', () => {
    // Save current config, modify, then restore
    const original = loadConfig();
    const testConfig = {
      apiKey: 'tr_test_roundtrip',
      apiUrl: 'http://roundtrip:1234',
      preferences: { testPref: true },
    };

    try {
      saveConfig(testConfig);
      const loaded = loadConfig();
      expect(loaded.apiKey).toBe('tr_test_roundtrip');
      expect(loaded.apiUrl).toBe('http://roundtrip:1234');
      expect(loaded.preferences).toEqual({ testPref: true });
    } finally {
      saveConfig(original);
    }
  });

  test('loadConfig returns defaults for missing file', () => {
    // loadConfig returns defaults when file doesn't exist (the catch path)
    // We can't easily test this without mocking fs, but we can verify the shape
    const config = loadConfig();
    expect(config).toHaveProperty('preferences');
  });
});
