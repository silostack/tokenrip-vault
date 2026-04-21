import { describe, test, expect, beforeAll, afterAll, spyOn } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';

let backend: TestBackend;
let agentA: TestAgent;
let agentB: TestAgent;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  agentA = await createTestAgent(backend.url, 'sender');
  agentB = await createTestAgent(backend.url, 'receiver');
  process.env.TOKENRIP_API_URL = backend.url;
  process.env.TOKENRIP_API_KEY = agentA.apiKey;
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

describe('msg send', () => {
  test('send to agent ID creates thread + message', async () => {
    const consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
    const { msgSend } = await import('../../packages/cli/src/commands/msg.js');
    await msgSend('Hello there', { to: agentB.agentId });
    const output = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    consoleSpy.mockRestore();
    expect(output.ok).toBe(true);
    expect(output.data.message_id).toBeDefined();
    expect(output.data.thread_id).toBeDefined();
  });

  test('send to unknown agent ID returns 404 not 500', async () => {
    const res = await fetch(`${backend.url}/v0/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: ['rip1fakeagentidthatdoesnotexist123456789'], body: 'hello' }),
    });
    const json = await res.json();
    expect(res.status).toBe(404);
    expect(json.ok).toBe(false);
    expect(json.error).toBe('AGENT_NOT_FOUND');
  });

  test('reply to thread via --thread flag', async () => {
    // Create a thread first
    const createRes = await fetch(`${backend.url}/v0/threads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const thread = await createRes.json();
    const threadId = thread.data.id;

    const consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
    const { msgSend } = await import('../../packages/cli/src/commands/msg.js');
    await msgSend('Thread reply', { thread: threadId });
    const output = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    consoleSpy.mockRestore();
    expect(output.ok).toBe(true);
    expect(output.data.id).toBeDefined();
    expect(output.data.sequence).toBeDefined();
  });
});

describe('msg list', () => {
  test('lists messages in thread', async () => {
    // Create thread + message via API
    const createRes = await fetch(`${backend.url}/v0/threads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${agentA.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: { body: 'Test message' } }),
    });
    const thread = await createRes.json();

    const consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
    const { msgList } = await import('../../packages/cli/src/commands/msg.js');
    await msgList({ thread: thread.data.id });
    const output = JSON.parse(consoleSpy.mock.calls[0][0] as string);
    consoleSpy.mockRestore();
    expect(output.ok).toBe(true);
    expect(Array.isArray(output.data)).toBe(true);
    expect(output.data.length).toBeGreaterThanOrEqual(1);
    expect(output.data[0].body).toBe('Test message');
  });
});
