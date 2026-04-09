import { describe, test, expect } from 'bun:test';
import { generateKeypair, createCapabilityToken, publicKeyToAgentId } from '../packages/cli/src/crypto';
import { parseAndVerifyCapabilityToken } from '../apps/backend/src/api/auth/crypto';

describe('capability token crypto', () => {
  test('round-trip: sign and verify', () => {
    const { publicKeyHex, secretKeyHex } = generateKeypair();
    const agentId = publicKeyToAgentId(publicKeyHex);

    const token = createCapabilityToken(
      { sub: 'asset:test-123', iss: agentId, perm: ['comment', 'version:create'] },
      secretKeyHex,
    );

    const payload = parseAndVerifyCapabilityToken(token);
    expect(payload).not.toBeNull();
    expect(payload!.sub).toBe('asset:test-123');
    expect(payload!.iss).toBe(agentId);
    expect(payload!.perm).toEqual(['comment', 'version:create']);
  });

  test('tampered payload is rejected', () => {
    const { publicKeyHex, secretKeyHex } = generateKeypair();
    const agentId = publicKeyToAgentId(publicKeyHex);

    const token = createCapabilityToken(
      { sub: 'asset:test-123', iss: agentId, perm: ['comment'] },
      secretKeyHex,
    );

    // Tamper with payload (replace first char after the dot-split)
    const [payloadB64, sig] = token.split('.');
    const tampered = Buffer.from(JSON.stringify({ sub: 'asset:test-999', iss: agentId, perm: ['comment'] })).toString('base64url');
    const tamperedToken = `${tampered}.${sig}`;

    expect(parseAndVerifyCapabilityToken(tamperedToken)).toBeNull();
  });

  test('wrong key is rejected', () => {
    const keyA = generateKeypair();
    const keyB = generateKeypair();
    const agentIdA = publicKeyToAgentId(keyA.publicKeyHex);

    // Sign with key A's secret but claim issuer is agent A
    const token = createCapabilityToken(
      { sub: 'asset:test-123', iss: agentIdA, perm: ['comment'] },
      keyB.secretKeyHex, // wrong key!
    );

    expect(parseAndVerifyCapabilityToken(token)).toBeNull();
  });

  test('expired token is rejected', () => {
    const { publicKeyHex, secretKeyHex } = generateKeypair();
    const agentId = publicKeyToAgentId(publicKeyHex);

    const token = createCapabilityToken(
      { sub: 'asset:test-123', iss: agentId, perm: ['comment'], exp: Math.floor(Date.now() / 1000) - 60 },
      secretKeyHex,
    );

    expect(parseAndVerifyCapabilityToken(token)).toBeNull();
  });

  test('token with future expiry is accepted', () => {
    const { publicKeyHex, secretKeyHex } = generateKeypair();
    const agentId = publicKeyToAgentId(publicKeyHex);

    const token = createCapabilityToken(
      { sub: 'asset:test-123', iss: agentId, perm: ['comment'], exp: Math.floor(Date.now() / 1000) + 3600 },
      secretKeyHex,
    );

    const payload = parseAndVerifyCapabilityToken(token);
    expect(payload).not.toBeNull();
    expect(payload!.exp).toBeDefined();
  });

  test('untyped sub (no colon) is rejected', () => {
    const { publicKeyHex, secretKeyHex } = generateKeypair();
    const agentId = publicKeyToAgentId(publicKeyHex);

    const token = createCapabilityToken(
      { sub: 'plain-uuid-no-type', iss: agentId, perm: ['comment'] },
      secretKeyHex,
    );

    expect(parseAndVerifyCapabilityToken(token)).toBeNull();
  });

  test('malformed token is rejected', () => {
    expect(parseAndVerifyCapabilityToken('garbage')).toBeNull();
    expect(parseAndVerifyCapabilityToken('a.b.c')).toBeNull();
    expect(parseAndVerifyCapabilityToken('')).toBeNull();
  });
});
