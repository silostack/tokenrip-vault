import { describe, test, expect } from 'bun:test';

const { loadIdentity, saveIdentity } = await import('../packages/cli/dist/identity.js');
const { generateKeypair, publicKeyToAgentId } = await import('../packages/cli/dist/crypto.js');

describe('identity management', () => {
  test('generateKeypair returns valid hex keys', () => {
    const kp = generateKeypair();
    expect(kp.publicKeyHex).toMatch(/^[0-9a-f]{64}$/);
    expect(kp.secretKeyHex).toMatch(/^[0-9a-f]{64}$/);
  });

  test('publicKeyToAgentId produces trip1 prefix', () => {
    const kp = generateKeypair();
    const id = publicKeyToAgentId(kp.publicKeyHex);
    expect(id).toMatch(/^trip1/);
  });

  test('saveIdentity + loadIdentity roundtrips', () => {
    const kp = generateKeypair();
    const id = publicKeyToAgentId(kp.publicKeyHex);
    const identity = { agentId: id, publicKey: kp.publicKeyHex, secretKey: kp.secretKeyHex };

    saveIdentity(identity);
    const loaded = loadIdentity();
    expect(loaded).toEqual(identity);
  });
});
