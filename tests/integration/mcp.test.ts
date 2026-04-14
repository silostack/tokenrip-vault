import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';

let backend: TestBackend;
let agent: TestAgent;
let sessionId: string;
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

/** Send a JSON-RPC request to the MCP endpoint */
async function mcpRequest(method: string, params: Record<string, unknown> = {}, headers: Record<string, string> = {}) {
  const hdrs: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
    Authorization: `Bearer ${agent.apiKey}`,
    ...headers,
  };
  if (sessionId) hdrs['mcp-session-id'] = sessionId;

  const res = await fetch(`${backend.url}/mcp`, {
    method: 'POST',
    headers: hdrs,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Math.floor(Math.random() * 100000),
      method,
      params,
    }),
  });
  return res;
}

/** Parse SSE response body and extract JSON-RPC result */
async function parseSSEResponse(res: Response): Promise<any> {
  const text = await res.text();
  // SSE format: data: {json}\n\n — extract the JSON-RPC response
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      try {
        return JSON.parse(line.slice(6));
      } catch {
        continue;
      }
    }
  }
  // Might be plain JSON response
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Could not parse MCP response: ${text.slice(0, 200)}`);
  }
}

/** Call an MCP tool and return the parsed result */
async function callTool(name: string, args: Record<string, unknown> = {}): Promise<any> {
  const res = await mcpRequest('tools/call', { name, arguments: args });
  expect(res.status).toBe(200);
  const json = await parseSSEResponse(res);
  if (json.error) throw new Error(`MCP error: ${JSON.stringify(json.error)}`);
  return json.result;
}

describe('mcp', () => {
  describe('session', () => {
    test('initialize creates a session', async () => {
      const res = await mcpRequest('initialize', {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' },
      });
      expect(res.status).toBe(200);

      // Capture session ID from response header
      const sid = res.headers.get('mcp-session-id');
      expect(sid).toBeTruthy();
      sessionId = sid!;

      const json = await parseSSEResponse(res);
      expect(json.result.serverInfo.name).toBe('tokenrip');

      // Send initialized notification (required by MCP protocol before making requests)
      await mcpRequest('notifications/initialized', {});
    });

    test('request without auth returns 401', async () => {
      const res = await fetch(`${backend.url}/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2025-03-26',
            capabilities: {},
            clientInfo: { name: 'test', version: '1.0' },
          },
        }),
      });
      expect(res.status).toBe(401);
    });

    test('request with invalid session returns 404', async () => {
      const res = await fetch(`${backend.url}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${agent.apiKey}`,
          'mcp-session-id': 'nonexistent-session-id',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
          params: {},
        }),
      });
      expect(res.status).toBe(404);
    });
  });

  describe('tools/list', () => {
    test('lists all 17 tools', async () => {
      const res = await mcpRequest('tools/list', {});
      expect(res.status).toBe(200);
      const text = await res.text();
      // Parse all JSON-RPC responses from SSE stream
      const responses: any[] = [];
      for (const line of text.split('\n')) {
        if (line.startsWith('data: ')) {
          try { responses.push(JSON.parse(line.slice(6))); } catch {}
        }
      }
      // Find the response that contains tools
      const toolsResponse = responses.find((r) => r.result?.tools);
      expect(toolsResponse).toBeTruthy();
      const tools = toolsResponse.result.tools;
      expect(tools.length).toBe(17);

      const toolNames = tools.map((t: any) => t.name).sort();
      expect(toolNames).toEqual([
        'asset_delete',
        'asset_list',
        'asset_publish',
        'asset_share',
        'asset_stats',
        'asset_update',
        'asset_upload',
        'asset_version_delete',
        'contact_list',
        'contact_remove',
        'contact_save',
        'inbox',
        'msg_list',
        'msg_send',
        'thread_create',
        'thread_share',
        'whoami',
      ]);
    });
  });

  describe('identity', () => {
    test('whoami returns agent profile', async () => {
      const result = await callTool('whoami');
      const data = JSON.parse(result.content[0].text);
      expect(data.id).toBe(agent.agentId);
    });
  });

  describe('asset lifecycle', () => {
    let publishedId: string;

    test('asset_publish creates a markdown asset', async () => {
      const result = await callTool('asset_publish', {
        content: '# Hello from MCP\n\nThis is a test.',
        type: 'markdown',
        title: 'MCP Test Asset',
      });
      expect(result.isError).toBeUndefined();
      const data = JSON.parse(result.content[0].text);
      expect(data.id).toBeTruthy();
      expect(data.url).toContain('/s/');
      expect(data.type).toBe('markdown');
      publishedId = data.id;
    });

    test('asset_list includes the published asset', async () => {
      const result = await callTool('asset_list', {});
      const data = JSON.parse(result.content[0].text);
      expect(data.length).toBeGreaterThanOrEqual(1);
      const found = data.find((a: any) => a.id === publishedId);
      expect(found).toBeTruthy();
      expect(found.title).toBe('MCP Test Asset');
    });

    test('asset_update creates a new version', async () => {
      const result = await callTool('asset_update', {
        publicId: publishedId,
        content: '# Updated content\n\nVersion 2.',
        type: 'markdown',
        label: 'v2',
      });
      expect(result.isError).toBeUndefined();
      const data = JSON.parse(result.content[0].text);
      expect(data.version).toBe(2);
      expect(data.label).toBe('v2');
    });

    test('asset_stats returns storage info', async () => {
      const result = await callTool('asset_stats');
      const data = JSON.parse(result.content[0].text);
      expect(data.assetCount).toBeDefined();
      expect(data.totalBytes).toBeDefined();
    });

    test('asset_share generates a share link', async () => {
      const result = await callTool('asset_share', {
        publicId: publishedId,
        expiresIn: '7d',
        label: 'test share',
      });
      expect(result.isError).toBeUndefined();
      const data = JSON.parse(result.content[0].text);
      expect(data.shareUrl).toContain(publishedId);
      expect(data.token).toMatch(/^st_/);
    });

    test('asset_upload handles base64 file', async () => {
      const content = Buffer.from('Hello from base64 upload').toString('base64');
      const result = await callTool('asset_upload', {
        base64Content: content,
        filename: 'test.txt',
        mimeType: 'text/plain',
        title: 'Uploaded via MCP',
      });
      expect(result.isError).toBeUndefined();
      const data = JSON.parse(result.content[0].text);
      expect(data.id).toBeTruthy();
      expect(data.type).toBe('file');
    });

    test('asset_delete destroys the asset', async () => {
      const result = await callTool('asset_delete', { publicId: publishedId });
      expect(result.isError).toBeUndefined();
      const data = JSON.parse(result.content[0].text);
      expect(data.ok).toBe(true);

      // Verify it's gone (410)
      const metaRes = await fetch(`${backend.url}/v0/assets/${publishedId}`);
      expect(metaRes.status).toBe(410);
    });
  });

  describe('messaging', () => {
    let threadId: string;

    test('thread_create creates a thread', async () => {
      const result = await callTool('thread_create', {
        message: { body: 'Hello from MCP thread', intent: 'inform' },
      });
      expect(result.isError).toBeUndefined();
      const data = JSON.parse(result.content[0].text);
      expect(data.id).toBeTruthy();
      expect(data.createdBy).toBe(agent.agentId);
      threadId = data.id;
    });

    test('msg_send posts to existing thread', async () => {
      const result = await callTool('msg_send', {
        body: 'Follow-up message via MCP',
        threadId,
        intent: 'inform',
      });
      expect(result.isError).toBeUndefined();
      const data = JSON.parse(result.content[0].text);
      expect(data.threadId).toBe(threadId);
      expect(data.sequence).toBe(2); // first was the initial message
    });

    test('msg_list returns thread messages', async () => {
      const result = await callTool('msg_list', { threadId });
      expect(result.isError).toBeUndefined();
      const data = JSON.parse(result.content[0].text);
      expect(data.length).toBe(2);
      expect(data[0].body).toBe('Hello from MCP thread');
      expect(data[1].body).toBe('Follow-up message via MCP');
    });
  });

  describe('inbox', () => {
    test('inbox returns recent activity', async () => {
      const since = new Date(Date.now() - 60_000).toISOString();
      const result = await callTool('inbox', { since });
      expect(result.isError).toBeUndefined();
      const data = JSON.parse(result.content[0].text);
      // Should have at least the thread we created
      expect(data).toBeTruthy();
    });
  });

  describe('error handling', () => {
    test('asset_delete with non-existent ID returns error', async () => {
      const result = await callTool('asset_delete', { publicId: '00000000-0000-0000-0000-000000000000' });
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error');
    });

    test('asset_update on non-owned asset returns error', async () => {
      // Create another agent and publish an asset
      const other = await createTestAgent(backend.url);
      const publishRes = await fetch(`${backend.url}/v0/assets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${other.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'markdown', content: '# Other agent', title: 'Other' }),
      });
      const publishJson = (await publishRes.json()) as any;
      const otherId = publishJson.data.id;

      // Try to update it as our agent
      const result = await callTool('asset_update', {
        publicId: otherId,
        content: 'hacked',
        type: 'markdown',
      });
      expect(result.isError).toBe(true);
    });
  });
});
