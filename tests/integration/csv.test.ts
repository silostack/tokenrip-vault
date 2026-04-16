import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';

let backend: TestBackend;
let agent: TestAgent;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  agent = await createTestAgent(backend.url);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

function authed(headers: Record<string, string> = {}) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${agent.apiKey}`, ...headers };
}

const SAMPLE_CSV = 'name,revenue\nAcme,1000\nBeta,2500\n';
const SAMPLE_CSV_3COL = 'name,revenue,tier\nAcme,1000,gold\nBeta,2500,silver\nGamma,500,bronze\n';

async function publishJson(body: Record<string, unknown>) {
  const res = await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: authed(),
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

async function publishMultipart(form: Record<string, string>, file: { name: string; content: string; type: string }) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(form)) fd.set(k, v);
  fd.set('file', new Blob([file.content], { type: file.type }), file.name);
  const res = await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${agent.apiKey}` },
    body: fd,
  });
  return { status: res.status, body: await res.json() };
}

async function getContent(publicId: string) {
  const res = await fetch(`${backend.url}/v0/assets/${publicId}/content`);
  return { status: res.status, mimeType: res.headers.get('content-type'), text: await res.text() };
}

async function getAsset(publicId: string) {
  const res = await fetch(`${backend.url}/v0/assets/${publicId}`);
  return { status: res.status, body: await res.json() };
}

async function getRows(publicId: string) {
  const res = await fetch(`${backend.url}/v0/assets/${publicId}/rows`);
  return { status: res.status, body: await res.json() };
}

describe('csv asset type', () => {
  test('publishes a CSV asset via JSON content', async () => {
    const { status, body } = await publishJson({ type: 'csv', content: SAMPLE_CSV, title: 'Q1 leads' });
    expect(status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.data.type).toBe('csv');
    expect(body.data.id).toBeDefined();

    const content = await getContent(body.data.id);
    expect(content.status).toBe(200);
    expect(content.mimeType).toContain('text/csv');
    expect(content.text).toBe(SAMPLE_CSV);
  });

  test('publishes a CSV asset via multipart upload', async () => {
    const { status, body } = await publishMultipart(
      { type: 'csv', title: 'uploaded' },
      { name: 'data.csv', content: SAMPLE_CSV, type: 'text/csv' },
    );
    expect(status).toBe(201);
    expect(body.data.type).toBe('csv');

    const content = await getContent(body.data.id);
    expect(content.text).toBe(SAMPLE_CSV);
  });

  test('CSV asset gets a new version on asset update (re-publish)', async () => {
    const created = await publishJson({ type: 'csv', content: SAMPLE_CSV, title: 'v-test' });
    const id = created.body.data.id;

    const newCsv = 'name,revenue\nAcme,9999\n';
    const res = await fetch(`${backend.url}/v0/assets/${id}/versions`, {
      method: 'POST',
      headers: authed(),
      body: JSON.stringify({ type: 'csv', content: newCsv }),
    });
    expect(res.status).toBe(201);

    const versionsRes = await fetch(`${backend.url}/v0/assets/${id}/versions`);
    const versions = await versionsRes.json();
    expect(versions.data.length).toBe(2);

    const latest = await getContent(id);
    expect(latest.text).toBe(newCsv);
  });

  test('row endpoints reject CSV assets', async () => {
    const created = await publishJson({ type: 'csv', content: SAMPLE_CSV });
    const id = created.body.data.id;

    const res = await fetch(`${backend.url}/v0/assets/${id}/rows`, {
      method: 'POST',
      headers: authed(),
      body: JSON.stringify({ rows: [{ x: 1 }] }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('NOT_COLLECTION');
  });
});

describe('csv → collection import', () => {
  test('headers=true derives schema from first row', async () => {
    const { status, body } = await publishJson({
      type: 'collection',
      from_csv: true,
      content: SAMPLE_CSV,
      headers: true,
      title: 'from csv w/ headers',
    });
    expect(status).toBe(201);
    expect(body.data.type).toBe('collection');
    const id = body.data.id;

    const asset = await getAsset(id);
    const schema = asset.body.data.metadata.schema;
    expect(schema).toHaveLength(2);
    expect(schema.map((c: any) => c.name)).toEqual(['name', 'revenue']);
    expect(schema.every((c: any) => c.type === 'text')).toBe(true);

    const rows = await getRows(id);
    expect(rows.body.data.rows).toHaveLength(2);
    expect(rows.body.data.rows[0].data).toEqual({ name: 'Acme', revenue: '1000' });
    expect(rows.body.data.rows[1].data).toEqual({ name: 'Beta', revenue: '2500' });
  });

  test('explicit schema types columns; all rows are data', async () => {
    const schema = [
      { name: 'n', type: 'text' },
      { name: 'r', type: 'number' },
    ];
    const { status, body } = await publishJson({
      type: 'collection',
      from_csv: true,
      content: 'Acme,1000\nBeta,2500\n',
      schema,
      title: 'typed import',
    });
    expect(status).toBe(201);
    const id = body.data.id;

    const asset = await getAsset(id);
    expect(asset.body.data.metadata.schema).toHaveLength(2);
    expect(asset.body.data.metadata.schema[1].type).toBe('number');

    const rows = await getRows(id);
    expect(rows.body.data.rows).toHaveLength(2);
    expect(rows.body.data.rows[0].data).toEqual({ n: 'Acme', r: '1000' });
  });

  test('neither headers nor schema: columns auto-named col_N', async () => {
    const { status, body } = await publishJson({
      type: 'collection',
      from_csv: true,
      content: 'a,b\nc,d\n',
      title: 'auto cols',
    });
    expect(status).toBe(201);
    const id = body.data.id;

    const asset = await getAsset(id);
    expect(asset.body.data.metadata.schema.map((c: any) => c.name)).toEqual(['col_1', 'col_2']);

    const rows = await getRows(id);
    expect(rows.body.data.rows).toHaveLength(2);
    expect(rows.body.data.rows[0].data).toEqual({ col_1: 'a', col_2: 'b' });
  });

  test('both schema and headers returns 400', async () => {
    const { status, body } = await publishJson({
      type: 'collection',
      from_csv: true,
      content: SAMPLE_CSV,
      headers: true,
      schema: [{ name: 'x', type: 'text' }],
    });
    expect(status).toBe(400);
    expect(body.error).toBe('SCHEMA_AND_HEADERS_CONFLICT');
  });

  test('multipart upload route: CSV file + type=collection + from_csv=true', async () => {
    const { status, body } = await publishMultipart(
      { type: 'collection', from_csv: 'true', headers: 'true', title: 'mp-import' },
      { name: 'data.csv', content: SAMPLE_CSV_3COL, type: 'text/csv' },
    );
    expect(status).toBe(201);
    expect(body.data.type).toBe('collection');

    const rows = await getRows(body.data.id);
    expect(rows.body.data.rows).toHaveLength(3);
    expect(rows.body.data.rows[0].data.tier).toBe('gold');
  });

  test('preserves provenance fields on import', async () => {
    const { body } = await publishJson({
      type: 'collection',
      from_csv: true,
      content: SAMPLE_CSV,
      headers: true,
      parentAssetId: '00000000-0000-0000-0000-000000000001',
      creatorContext: 'test-ctx',
      inputReferences: ['https://example.com/source.csv'],
    });
    const asset = await getAsset(body.data.id);
    expect(asset.body.data.parentAssetId).toBe('00000000-0000-0000-0000-000000000001');
    expect(asset.body.data.creatorContext).toBe('test-ctx');
    expect(asset.body.data.inputReferences).toEqual(['https://example.com/source.csv']);
  });

  test('still supports schema-only (non-CSV) collection creation', async () => {
    const { status, body } = await publishJson({
      type: 'collection',
      title: 'schema-only',
      schema: [{ name: 'company', type: 'text' }],
    });
    expect(status).toBe(201);
    expect(body.data.type).toBe('collection');

    const rows = await getRows(body.data.id);
    expect(rows.body.data.rows).toHaveLength(0);
  });
});
