import fs from 'node:fs';
import path from 'node:path';
import FormData from 'form-data';
import mime from 'mime-types';
import { loadConfig, getApiUrl, getApiKey } from '../config.js';
import { createHttpClient } from '../client.js';
import { CliError } from '../errors.js';
import { outputSuccess } from '../output.js';

export async function upload(filePath: string, options: { title?: string }): Promise<void> {
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

  const { data } = await client.post('/v0/artifacts', form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  const baseUrl = getApiUrl(config).replace(/:\d+$/, ':8000');
  outputSuccess({
    id: data.data.id,
    url: `${baseUrl}/s/${data.data.id}`,
    title: data.data.title,
    type: data.data.type,
    mimeType: data.data.mimeType,
  });
}
