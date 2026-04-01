import fs from 'node:fs';
import path from 'node:path';
import { loadConfig, getApiUrl, getApiKey } from '../config.js';
import { createHttpClient } from '../client.js';
import { CliError } from '../errors.js';
import { outputSuccess } from '../output.js';

const VALID_TYPES = ['markdown', 'html', 'chart', 'code', 'text'] as const;
type ContentType = (typeof VALID_TYPES)[number];

export async function publish(
  filePath: string,
  options: { type: string; title?: string; parent?: string; context?: string; refs?: string },
): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);
  if (!apiKey) {
    throw new CliError('NO_API_KEY', 'No API key configured. Run `tokenrip config set-key <key>`');
  }

  if (!VALID_TYPES.includes(options.type as ContentType)) {
    throw new CliError('INVALID_TYPE', `Type must be one of: ${VALID_TYPES.join(', ')}`);
  }

  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    throw new CliError('FILE_NOT_FOUND', `File not found: ${absPath}`);
  }

  const content = fs.readFileSync(absPath, 'utf-8');
  const client = createHttpClient({ baseUrl: getApiUrl(config), apiKey });

  const body: Record<string, unknown> = {
    type: options.type,
    content,
    title: options.title || path.basename(absPath),
  };
  if (options.parent) body.parentAssetId = options.parent;
  if (options.context) body.creatorContext = options.context;
  if (options.refs) body.inputReferences = options.refs.split(',').map((r) => r.trim());

  const { data } = await client.post('/v0/assets', body);

  const url = data.data.url || `${getApiUrl(config).replace(/:\d+$/, ':8000')}/s/${data.data.id}`;
  outputSuccess({
    id: data.data.id,
    url,
    title: data.data.title,
    type: data.data.type,
  });
}
