import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';

const TOKENRIP_AGENT_ID = 'rip1kfu23m3vk3umxgu3wdhkltlvvasm2secm8t6jknvtna2fjgm3cwsje9umr';

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

async function parseSSEResponse(res: Response): Promise<any> {
  const text = await res.text();
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
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Could not parse MCP response: ${text.slice(0, 200)}`);
  }
}

async function callTool(name: string, args: Record<string, unknown> = {}): Promise<any> {
  const res = await mcpRequest('tools/call', { name, arguments: args });
  expect(res.status).toBe(200);
  const json = await parseSSEResponse(res);
  if (json.error) throw new Error(`MCP error: ${JSON.stringify(json.error)}`);
  return json.result;
}

describe('mcp tour', () => {
  test('initialize session', async () => {
    const res = await mcpRequest('initialize', {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'tour-test', version: '1.0.0' },
    });
    expect(res.status).toBe(200);
    const sid = res.headers.get('mcp-session-id');
    expect(sid).toBeTruthy();
    sessionId = sid!;
    await parseSSEResponse(res);
    await mcpRequest('notifications/initialized', {});
  });

  test('tour tool returns the MCP tour script', async () => {
    const result = await callTool('tour');
    expect(result.isError).toBeUndefined();
    const text = result.content[0].text;
    expect(text).toContain('whoami');
    expect(text).toContain('asset_publish');
    expect(text).toContain('thread_create');
    expect(text).toContain('tourWelcome');
    expect(text).toContain('inbox');
  });

  test('thread_create with tourWelcome=true and @tokenrip posts welcome message', async () => {
    const result = await callTool('thread_create', {
      participants: ['tokenrip'],
      tourWelcome: true,
    });
    expect(result.isError).toBeUndefined();
    const thread = JSON.parse(result.content[0].text);
    expect(thread.id).toBeTruthy();
    expect(thread.participants.some((p: any) => p.agentId === TOKENRIP_AGENT_ID)).toBe(true);

    const msgResult = await callTool('msg_list', { threadId: thread.id });
    const messages = JSON.parse(msgResult.content[0].text);
    expect(messages.length).toBe(1);
    expect(messages[0].body).toMatch(/welcome/i);
    // sender should be @tokenrip
    const senderAgentId = messages[0].senderAgentId ?? messages[0].sender?.agent_id ?? messages[0].sender?.agentId;
    expect(senderAgentId).toBe(TOKENRIP_AGENT_ID);
  });

  test('thread_create without tourWelcome posts no welcome', async () => {
    const result = await callTool('thread_create', {
      participants: ['tokenrip'],
    });
    const thread = JSON.parse(result.content[0].text);

    const msgResult = await callTool('msg_list', { threadId: thread.id });
    const messages = JSON.parse(msgResult.content[0].text);
    expect(messages.length).toBe(0);
  });

  test('tourWelcome=true without @tokenrip participant is a no-op', async () => {
    const result = await callTool('thread_create', {
      tourWelcome: true,
    });
    const thread = JSON.parse(result.content[0].text);

    const msgResult = await callTool('msg_list', { threadId: thread.id });
    const messages = JSON.parse(msgResult.content[0].text);
    expect(messages.length).toBe(0);
  });
});
