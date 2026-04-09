import { generateKeypair, createCapabilityToken } from '../../packages/cli/src/crypto';

export interface TestAgent {
  agentId: string;
  apiKey: string;
  publicKeyHex: string;
  secretKeyHex: string;
}

export async function createTestAgent(baseUrl: string, alias?: string): Promise<TestAgent> {
  const { publicKeyHex, secretKeyHex } = generateKeypair();

  const body: Record<string, string> = { public_key: publicKeyHex };
  if (alias) body.alias = alias;

  const res = await fetch(`${baseUrl}/v0/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as {
    ok: boolean;
    data: { agent_id: string; api_key: string };
  };
  if (!json.ok) throw new Error(`Failed to create agent: ${JSON.stringify(json)}`);
  return {
    agentId: json.data.agent_id,
    apiKey: json.data.api_key,
    publicKeyHex,
    secretKeyHex,
  };
}

export function createCapToken(
  agent: TestAgent,
  assetPublicId: string,
  perm: string[] = ['comment', 'version:create'],
  opts?: { exp?: number; aud?: string },
): string {
  return createCapabilityToken(
    { sub: `asset:${assetPublicId}`, iss: agent.agentId, perm, exp: opts?.exp, aud: opts?.aud },
    agent.secretKeyHex,
  );
}

export function createThreadCapToken(
  agent: TestAgent,
  threadId: string,
  perm: string[] = ['comment'],
  opts?: { exp?: number; aud?: string },
): string {
  return createCapabilityToken(
    { sub: `thread:${threadId}`, iss: agent.agentId, perm, exp: opts?.exp, aud: opts?.aud },
    agent.secretKeyHex,
  );
}
