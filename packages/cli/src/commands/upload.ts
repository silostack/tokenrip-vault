import fs from 'node:fs';
import path from 'node:path';
import FormData from 'form-data';
import mime from 'mime-types';
import { loadConfig, getApiUrl, getApiKey } from '../config.js';
import { createHttpClient } from '../client.js';
import { CliError } from '../errors.js';
import { outputSuccess } from '../output.js';

export async function upload(filePath: string, options: { title?: string; parent?: string; context?: string; refs?: string }): Promise<void> {
  const config = loadConfig();
  const apiKey = getApiKey(config);
  if (!apiKey) {
    throw new CliError('NO_API_KEY', 'No API key configured. Run `tokenrip config set-key <key>`');
  }

  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    throw new CliError('FILE_NOT_FOUND', `File not found: ${absPath}`);
  }

  const client = createHttpClient({ baseUrl: getApiUrl(config), apiKey });

  const form = new FormData();
  form.append('file', fs.createReadStream(absPath));
  form.append('type', 'file');

  const mimeType = mime.lookup(absPath) || 'application/octet-stream';
  form.append('mimeType', mimeType);

  if (options.title) {
    form.append('title', options.title);
  } else {
    form.append('title', path.basename(absPath));
  }

  if (options.parent) form.append('parentArtifactId', options.parent);
  if (options.context) form.append('creatorContext', options.context);
  if (options.refs) form.append('inputReferences', JSON.stringify(options.refs.split(',').map((r) => r.trim())));

  const { data } = await client.post('/v0/artifacts', form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  const url = data.data.url || `${getApiUrl(config).replace(/:\d+$/, ':8000')}/s/${data.data.id}`;
  outputSuccess({
    id: data.data.id,
    url,
    title: data.data.title,
    type: data.data.type,
    mimeType: data.data.mimeType,
  });
}
