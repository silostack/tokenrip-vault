import { bech32 } from 'bech32';

const AGENT_HRP = 'trip';
const BECH32_LIMIT = 90;

export function publicKeyToAgentId(publicKeyHex: string): string {
  const bytes = Buffer.from(publicKeyHex, 'hex');
  if (bytes.length !== 32) {
    throw new Error('Ed25519 public key must be 32 bytes');
  }
  const words = bech32.toWords(bytes);
  return bech32.encode(AGENT_HRP, words, BECH32_LIMIT);
}

export function agentIdToPublicKey(agentId: string): Buffer {
  const { prefix, words } = bech32.decode(agentId, BECH32_LIMIT);
  if (prefix !== AGENT_HRP) {
    throw new Error(`Invalid agent ID prefix: expected "${AGENT_HRP}", got "${prefix}"`);
  }
  return Buffer.from(bech32.fromWords(words));
}
