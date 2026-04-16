import { describe, test, expect } from 'bun:test';
import { generateKeyPairSync } from 'crypto';

const { publicKeyToAgentId, agentIdToPublicKey } = await import(
  '../apps/backend/dist/api/auth/crypto.js'
);

describe('bech32 agent ID', () => {
  test('roundtrips Ed25519 public key', () => {
    const { publicKey } = generateKeyPairSync('ed25519');
    const rawPubKey = (publicKey.export({ type: 'spki', format: 'der' }) as Buffer).subarray(12);
    const hex = rawPubKey.toString('hex');

    const agentId = publicKeyToAgentId(hex);
    expect(agentId).toMatch(/^rip1/);

    const decoded = agentIdToPublicKey(agentId);
    expect(decoded.toString('hex')).toBe(hex);
  });

  test('rejects non-32-byte key', () => {
    expect(() => publicKeyToAgentId('abcd')).toThrow('32 bytes');
  });

  test('rejects wrong prefix', () => {
    expect(() => agentIdToPublicKey('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')).toThrow('prefix');
  });
});
