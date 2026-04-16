import { describe, test, expect, beforeAll, afterAll, spyOn } from 'bun:test';
import path from 'path';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent } from '../setup/agent';

let backend: TestBackend;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

describe('full flow', () => {
  test('register agent → upload → fetch → publish → fetch → revoke → fail', async () => {
    // 1. Register an agent
    const agent = await createTestAgent(backend.url);
    const apiKey = agent.apiKey;
    expect(apiKey).toMatch(/^tr_/);
    expect(agent.agentId).toMatch(/^rip1/);

    // 2. Set env vars for CLI
    process.env.TOKENRIP_API_URL = backend.url;
    process.env.TOKENRIP_API_KEY = apiKey;

    // 3. Upload a file via fetch (form-data npm package has Bun stream issues)
    const pngFile = Bun.file('tests/fixtures/sample.png');
    const uploadForm = new FormData();
    uploadForm.append('file', pngFile);
    uploadForm.append('type', 'file');
    uploadForm.append('title', 'Flow Test Image');

    const uploadRes = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: uploadForm,
    });
    const uploadJson = (await uploadRes.json()) as { ok: boolean; data: Record<string, any> };
    expect(uploadJson.ok).toBe(true);
    const uploadId = uploadJson.data.id;

    // 4. Fetch metadata
    const metaRes = await fetch(`${backend.url}/v0/assets/${uploadId}`);
    const metaJson = (await metaRes.json()) as { ok: boolean; data: Record<string, any> };
    expect(metaJson.ok).toBe(true);
    expect(metaJson.data.title).toBe('Flow Test Image');
    expect(metaJson.data.type).toBe('file');
    expect(metaJson.data.mimeType).toBe('image/png');

    // 5. Fetch content and verify binary match
    const contentRes = await fetch(`${backend.url}/v0/assets/${uploadId}/content`);
    const downloadedBytes = Buffer.from(await contentRes.arrayBuffer());
    const originalBytes = Buffer.from(await pngFile.arrayBuffer());
    expect(downloadedBytes).toEqual(originalBytes);

    // 6. Publish markdown via CLI (JSON POST works fine with axios in Bun)
    const consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
    const { publish } = await import('../../packages/cli/src/commands/publish');
    await publish(path.resolve('tests/fixtures/sample.md'), {
      type: 'markdown',
      title: 'Flow Test Markdown',
    });

    const output = JSON.parse(
      consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1][0] as string,
    );
    expect(output.ok).toBe(true);
    const publishId = output.data.id;
    consoleSpy.mockRestore();

    // 7. Fetch published content and verify text match
    const mdRes = await fetch(`${backend.url}/v0/assets/${publishId}/content`);
    const mdContent = await mdRes.text();
    const originalMd = await Bun.file('tests/fixtures/sample.md').text();
    expect(mdContent).toBe(originalMd);

    // 8. Revoke the API key via agent endpoint
    const revokeRes = await fetch(`${backend.url}/v0/agents/revoke-key`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(revokeRes.status).toBe(201);

    // 9. Attempt upload with revoked key — should fail with 401
    const failForm = new FormData();
    failForm.append('file', Bun.file('tests/fixtures/sample.png'));
    failForm.append('type', 'file');
    failForm.append('title', 'Should Fail');

    const failRes = await fetch(`${backend.url}/v0/assets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: failForm,
    });
    expect(failRes.status).toBe(401);
  });
});
