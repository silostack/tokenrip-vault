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

async function createCollection(schema: unknown[], title = 'Test Collection') {
  const res = await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: authed(),
    body: JSON.stringify({ type: 'collection', title, schema }),
  });
  const json = await res.json();
  return { status: res.status, body: json };
}

async function appendRows(publicId: string, rows: Record<string, unknown>[]) {
  const res = await fetch(`${backend.url}/v0/assets/${publicId}/rows`, {
    method: 'POST',
    headers: authed(),
    body: JSON.stringify({ rows }),
  });
  const json = await res.json();
  return { status: res.status, body: json };
}

async function getRows(publicId: string, params: Record<string, string> = {}) {
  const url = new URL(`${backend.url}/v0/assets/${publicId}/rows`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  const json = await res.json();
  return { status: res.status, body: json };
}

describe('collections', () => {
  let collectionId: string;

  describe('create', () => {
    test('creates a collection asset', async () => {
      const schema = [
        { name: 'company', type: 'text' },
        { name: 'relevance', type: 'enum', values: ['high', 'medium', 'low'] },
        { name: 'source', type: 'url' },
      ];
      const { status, body } = await createCollection(schema, 'Research Findings');
      expect(status).toBe(201);
      expect(body.ok).toBe(true);
      expect(body.data.type).toBe('collection');
      expect(body.data.id).toBeDefined();
      expect(body.data.url).toContain(body.data.id);
      collectionId = body.data.id;
    });

    test('collection metadata includes schema', async () => {
      const res = await fetch(`${backend.url}/v0/assets/${collectionId}`);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.type).toBe('collection');
      expect(json.data.metadata.schema).toHaveLength(3);
      expect(json.data.metadata.schema[0].name).toBe('company');
      expect(json.data.metadata.schema[1].type).toBe('enum');
      expect(json.data.metadata.schema[1].values).toEqual(['high', 'medium', 'low']);
    });

    test('collection has no versioning', async () => {
      const res = await fetch(`${backend.url}/v0/assets/${collectionId}`);
      const json = await res.json();
      expect(json.data.versionCount).toBe(0);
      expect(json.data.currentVersionId).toBeNull();
    });

    test('collection content endpoint returns error', async () => {
      const res = await fetch(`${backend.url}/v0/assets/${collectionId}/content`);
      expect(res.status).toBe(400);
    });

    test('rejects collection without schema', async () => {
      const res = await fetch(`${backend.url}/v0/assets`, {
        method: 'POST',
        headers: authed(),
        body: JSON.stringify({ type: 'collection', title: 'No schema' }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe('append rows', () => {
    test('appends a single row', async () => {
      const { status, body } = await appendRows(collectionId, [
        { company: 'Acme', relevance: 'high', source: 'https://acme.com' },
      ]);
      expect(status).toBe(201);
      expect(body.ok).toBe(true);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].id).toBeDefined();
    });

    test('appends multiple rows', async () => {
      const { status, body } = await appendRows(collectionId, [
        { company: 'Beta', relevance: 'medium', source: 'https://beta.io' },
        { company: 'Gamma', relevance: 'low', source: 'https://gamma.dev' },
      ]);
      expect(status).toBe(201);
      expect(body.data).toHaveLength(2);
    });

    test('rejects empty rows array', async () => {
      const res = await fetch(`${backend.url}/v0/assets/${collectionId}/rows`, {
        method: 'POST',
        headers: authed(),
        body: JSON.stringify({ rows: [] }),
      });
      expect(res.status).toBe(400);
    });

    test('rejects append on non-collection asset', async () => {
      // Create a markdown asset
      const mdRes = await fetch(`${backend.url}/v0/assets`, {
        method: 'POST',
        headers: authed(),
        body: JSON.stringify({ type: 'markdown', content: '# Hello', title: 'Not a collection' }),
      });
      const mdJson = await mdRes.json();
      const mdId = mdJson.data.id;

      const res = await fetch(`${backend.url}/v0/assets/${mdId}/rows`, {
        method: 'POST',
        headers: authed(),
        body: JSON.stringify({ rows: [{ foo: 'bar' }] }),
      });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('NOT_COLLECTION');
    });

    test('requires authentication', async () => {
      const res = await fetch(`${backend.url}/v0/assets/${collectionId}/rows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: [{ company: 'Unauthed' }] }),
      });
      expect(res.status).toBe(401);
    });
  });

  describe('get rows', () => {
    test('returns all rows (public, no auth)', async () => {
      const { status, body } = await getRows(collectionId);
      expect(status).toBe(200);
      expect(body.ok).toBe(true);
      expect(body.data.rows.length).toBeGreaterThanOrEqual(3);
      expect(body.data.rows[0].data.company).toBeDefined();
      expect(body.data.rows[0].createdBy).toBe(agent.agentId);
    });

    test('respects limit', async () => {
      const { body } = await getRows(collectionId, { limit: '2' });
      expect(body.data.rows).toHaveLength(2);
      expect(body.data.nextCursor).toBeDefined();
    });

    test('pagination with cursor', async () => {
      const page1 = await getRows(collectionId, { limit: '2' });
      expect(page1.body.data.rows).toHaveLength(2);
      const cursor = page1.body.data.nextCursor;
      expect(cursor).toBeTruthy();

      const page2 = await getRows(collectionId, { limit: '2', after: cursor });
      expect(page2.body.data.rows.length).toBeGreaterThanOrEqual(1);
      // No overlap between pages
      const page1Ids = new Set(page1.body.data.rows.map((r: any) => r.id));
      for (const row of page2.body.data.rows) {
        expect(page1Ids.has(row.id)).toBe(false);
      }
    });
  });

  describe('sort and filter', () => {
    let sortCollectionId: string;

    beforeAll(async () => {
      const schema = [
        { name: 'company', type: 'text' },
        { name: 'revenue', type: 'number' },
        { name: 'discovered', type: 'date' },
        { name: 'active', type: 'boolean' },
        { name: 'tier', type: 'enum', values: ['gold', 'silver', 'bronze'] },
      ];
      const { body } = await createCollection(schema, 'Sort Test');
      sortCollectionId = body.data.id;

      await appendRows(sortCollectionId, [
        { company: 'Alpha', revenue: '100', discovered: '2025-01-15', active: 'true', tier: 'gold' },
        { company: 'Charlie', revenue: '50', discovered: '2025-03-01', active: 'false', tier: 'bronze' },
        { company: 'Bravo', revenue: '200', discovered: '2025-02-10', active: 'true', tier: 'silver' },
        { company: 'Delta', revenue: '10', discovered: '2025-04-05', active: 'false', tier: 'gold' },
        { company: 'Echo', revenue: '75', discovered: '2025-01-30', active: 'true', tier: 'bronze' },
      ]);
    });

    test('sort by text column ascending', async () => {
      const { body } = await getRows(sortCollectionId, { sort_by: 'company', sort_order: 'asc' });
      const names = body.data.rows.map((r: any) => r.data.company);
      expect(names).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo']);
    });

    test('sort by text column descending', async () => {
      const { body } = await getRows(sortCollectionId, { sort_by: 'company', sort_order: 'desc' });
      const names = body.data.rows.map((r: any) => r.data.company);
      expect(names).toEqual(['Echo', 'Delta', 'Charlie', 'Bravo', 'Alpha']);
    });

    test('sort by number column (numeric, not lexicographic)', async () => {
      const { body } = await getRows(sortCollectionId, { sort_by: 'revenue', sort_order: 'asc' });
      const revenues = body.data.rows.map((r: any) => r.data.revenue);
      expect(revenues).toEqual(['10', '50', '75', '100', '200']);
    });

    test('sort by date column (chronological)', async () => {
      const { body } = await getRows(sortCollectionId, { sort_by: 'discovered', sort_order: 'asc' });
      const dates = body.data.rows.map((r: any) => r.data.discovered);
      expect(dates).toEqual(['2025-01-15', '2025-01-30', '2025-02-10', '2025-03-01', '2025-04-05']);
    });

    test('filter by equality', async () => {
      const { body } = await getRows(sortCollectionId, { 'filter.tier': 'gold' });
      expect(body.data.rows).toHaveLength(2);
      for (const row of body.data.rows) {
        expect(row.data.tier).toBe('gold');
      }
    });

    test('multiple filters ANDed', async () => {
      const { body } = await getRows(sortCollectionId, { 'filter.tier': 'gold', 'filter.active': 'true' });
      expect(body.data.rows).toHaveLength(1);
      expect(body.data.rows[0].data.company).toBe('Alpha');
    });

    test('filter + sort combined', async () => {
      const { body } = await getRows(sortCollectionId, { 'filter.active': 'true', sort_by: 'company', sort_order: 'desc' });
      const names = body.data.rows.map((r: any) => r.data.company);
      expect(names).toEqual(['Echo', 'Bravo', 'Alpha']);
    });

    test('pagination with custom sort', async () => {
      const page1 = await getRows(sortCollectionId, { sort_by: 'company', sort_order: 'asc', limit: '3' });
      expect(page1.body.data.rows).toHaveLength(3);
      const names1 = page1.body.data.rows.map((r: any) => r.data.company);
      expect(names1).toEqual(['Alpha', 'Bravo', 'Charlie']);
      expect(page1.body.data.nextCursor).toBeTruthy();

      const page2 = await getRows(sortCollectionId, { sort_by: 'company', sort_order: 'asc', limit: '3', after: page1.body.data.nextCursor });
      expect(page2.body.data.rows).toHaveLength(2);
      const names2 = page2.body.data.rows.map((r: any) => r.data.company);
      expect(names2).toEqual(['Delta', 'Echo']);
    });

    test('filter with no matches returns empty', async () => {
      const { body } = await getRows(sortCollectionId, { 'filter.company': 'NonExistent' });
      expect(body.data.rows).toHaveLength(0);
      expect(body.data.nextCursor).toBeNull();
    });

    test('boolean filter', async () => {
      const { body } = await getRows(sortCollectionId, { 'filter.active': 'false' });
      expect(body.data.rows).toHaveLength(2);
      for (const row of body.data.rows) {
        expect(row.data.active).toBe('false');
      }
    });
  });

  describe('update row', () => {
    let rowId: string;

    beforeAll(async () => {
      const { body } = await getRows(collectionId, { limit: '1' });
      rowId = body.data.rows[0].id;
    });

    test('partial update merges with existing data', async () => {
      const res = await fetch(`${backend.url}/v0/assets/${collectionId}/rows/${rowId}`, {
        method: 'PUT',
        headers: authed(),
        body: JSON.stringify({ data: { relevance: 'low' } }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.data.data.relevance).toBe('low');
      // Original fields preserved
      expect(json.data.data.company).toBeDefined();
    });

    test('returns 404 for non-existent row', async () => {
      const res = await fetch(`${backend.url}/v0/assets/${collectionId}/rows/00000000-0000-0000-0000-000000000000`, {
        method: 'PUT',
        headers: authed(),
        body: JSON.stringify({ data: { foo: 'bar' } }),
      });
      expect(res.status).toBe(404);
    });
  });

  describe('schema expansion', () => {
    test('auto-expands schema for unknown keys', async () => {
      await appendRows(collectionId, [
        { company: 'Delta', relevance: 'high', new_field: 'surprise' },
      ]);

      // Check schema was updated
      const metaRes = await fetch(`${backend.url}/v0/assets/${collectionId}`);
      const metaJson = await metaRes.json();
      const schema = metaJson.data.metadata.schema;
      const newCol = schema.find((c: any) => c.name === 'new_field');
      expect(newCol).toBeTruthy();
      expect(newCol.type).toBe('text');
    });
  });

  describe('delete rows', () => {
    test('bulk deletes rows', async () => {
      // Get current rows
      const { body: before } = await getRows(collectionId);
      const idsToDelete = before.data.rows.slice(0, 2).map((r: any) => r.id);
      const countBefore = before.data.rows.length;

      const res = await fetch(`${backend.url}/v0/assets/${collectionId}/rows`, {
        method: 'DELETE',
        headers: authed(),
        body: JSON.stringify({ row_ids: idsToDelete }),
      });
      expect(res.status).toBe(204);

      // Verify rows are gone
      const { body: after } = await getRows(collectionId);
      expect(after.data.rows.length).toBe(countBefore - 2);
      const remainingIds = new Set(after.data.rows.map((r: any) => r.id));
      for (const id of idsToDelete) {
        expect(remainingIds.has(id)).toBe(false);
      }
    });

    test('rejects invalid row IDs', async () => {
      const res = await fetch(`${backend.url}/v0/assets/${collectionId}/rows`, {
        method: 'DELETE',
        headers: authed(),
        body: JSON.stringify({ row_ids: ['not-a-uuid'] }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe('asset lifecycle', () => {
    test('deleting collection cascades to rows', async () => {
      // Create a new collection with rows
      const { body: col } = await createCollection([{ name: 'x', type: 'text' }], 'Temp');
      const tempId = col.data.id;
      await appendRows(tempId, [{ x: '1' }, { x: '2' }]);

      // Delete the collection
      const delRes = await fetch(`${backend.url}/v0/assets/${tempId}`, {
        method: 'DELETE',
        headers: authed(),
      });
      expect(delRes.status).toBe(204);

      // Rows endpoint returns 410 (destroyed asset)
      const rowsRes = await fetch(`${backend.url}/v0/assets/${tempId}/rows`);
      expect(rowsRes.status).toBe(410);
    });
  });
});
