import { describe, expect, test } from 'bun:test';
import { getFrontendUrl, TokenripConfig } from '../config.js';

describe('getFrontendUrl', () => {
  test('prefers explicit frontendUrl config', () => {
    const config: TokenripConfig = {
      preferences: {},
      apiUrl: 'https://api.example.com',
      frontendUrl: 'https://app.example.com',
    };
    expect(getFrontendUrl(config)).toBe('https://app.example.com');
  });

  test('derives the frontend host from api.<host>', () => {
    const config: TokenripConfig = {
      preferences: {},
      apiUrl: 'https://api.staging.tokenrip.com',
    };
    expect(getFrontendUrl(config)).toBe('https://staging.tokenrip.com');
  });

  test('keeps production mapped to tokenrip.com', () => {
    const config: TokenripConfig = {
      preferences: {},
      apiUrl: 'https://api.tokenrip.com',
    };
    expect(getFrontendUrl(config)).toBe('https://tokenrip.com');
  });
});
