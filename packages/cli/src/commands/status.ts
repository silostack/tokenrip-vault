import { loadConfig, getApiUrl, getApiKey } from '../config.js';
import { createHttpClient } from '../client.js';
import { CliError } from '../errors.js';
import { outputSuccess } from '../output.js';

export async function status(options: { since?: string }): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);
  if (!apiKey) {
    throw new CliError('NO_API_KEY', 'No API key configured. Run `tokenrip config set-key <key>`');
  }

  const client = createHttpClient({ baseUrl: getApiUrl(config), apiKey });

  const params: Record<string, string> = {};
  if (options.since) params.since = options.since;

  const { data } = await client.get('/v0/assets/status', { params });

  outputSuccess(data.data);
}
