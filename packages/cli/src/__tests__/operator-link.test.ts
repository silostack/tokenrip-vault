import { afterEach, beforeAll, describe, expect, mock, test } from 'bun:test';
import { CliError } from '../errors.js';

const clientFactoryCalls: Array<Record<string, unknown>> = [];
const postMock = mock(async () => ({ data: { data: { api_key: 'recovered-key' } } }));
const loadConfigMock = mock(() => ({ preferences: {}, apiUrl: 'https://api.example.com' }));
const saveConfigMock = mock(() => {
  throw new Error('EACCES');
});

mock.module('../client.ts', () => ({
  createHttpClient: (config: Record<string, unknown> = {}) => {
    clientFactoryCalls.push(config);
    return {
      config,
      post: postMock,
    };
  },
}));

mock.module('../config.ts', () => ({
  getFrontendUrl: () => 'https://app.example.com',
  loadConfig: loadConfigMock,
  saveConfig: saveConfigMock,
}));

mock.module('../crypto.ts', () => ({
  createCapabilityToken: () => 'cap-token',
  signPayload: () => 'signed-token',
}));

let operatorLinkModule: typeof import('../commands/operator-link.js');

beforeAll(async () => {
  operatorLinkModule = await import('../commands/operator-link.js');
});

afterEach(() => {
  clientFactoryCalls.length = 0;
  postMock.mockClear();
  loadConfigMock.mockClear();
  saveConfigMock.mockClear();
});

describe('operator-link recovery helpers', () => {
  test('only retries link-code auth failures for UNAUTHORIZED errors', () => {
    expect(operatorLinkModule.shouldRecoverLinkCodeError(
      new CliError('UNAUTHORIZED', 'bad key'),
    )).toBe(true);
    expect(operatorLinkModule.shouldRecoverLinkCodeError(
      new CliError('NETWORK_ERROR', 'offline'),
    )).toBe(false);
  });

  test('surfaces a warning when a recovered key cannot be persisted', async () => {
    const result = await operatorLinkModule.recoverAuthClient(
      'rip1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq4d7d9',
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      'https://api.example.com',
    );

    expect(postMock).toHaveBeenCalledTimes(1);
    expect(result.warning).toEqual({
      code: 'KEY_SAVE_FAILED',
      message: 'Recovered a replacement API key but could not save it locally (EACCES).',
    });
    expect(result.client.config).toEqual({
      baseUrl: 'https://api.example.com',
      apiKey: 'recovered-key',
    });
  });
});
