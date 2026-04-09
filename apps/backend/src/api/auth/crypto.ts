import { bech32 } from 'bech32';
import { createHash, createPublicKey, verify } from 'crypto';

const AGENT_HRP = 'trip';
const BECH32_LIMIT = 90;

// ASN.1 DER prefix for Ed25519 SPKI public key (prepend to 32-byte raw key)
const SPKI_ED25519_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}


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

export interface CapabilityPayload {
  /** Typed subject: `type:id` (e.g., `asset:uuid`, `thread:uuid`) */
  sub: string;
  iss: string;
  perm: string[];
  exp?: number;
  aud?: string;
}

export function parseCapSub(sub: string): { type: string; id: string } | null {
  const colon = sub.indexOf(':');
  if (colon === -1) return null;
  return { type: sub.slice(0, colon), id: sub.slice(colon + 1) };
}

export function verifyEd25519(payload: Buffer, signature: Buffer, rawPublicKey: Buffer): boolean {
  const derKey = Buffer.concat([SPKI_ED25519_PREFIX, rawPublicKey]);
  const keyObj = createPublicKey({ key: derKey, format: 'der', type: 'spki' });
  return verify(null, payload, keyObj, signature);
}

export function parseAndVerifyCapabilityToken(token: string): CapabilityPayload | null {
  const dot = token.indexOf('.');
  if (dot === -1) return null;

  try {
    const payloadB64 = token.slice(0, dot);
    const signatureB64 = token.slice(dot + 1);
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString()) as CapabilityPayload;
    const signature = Buffer.from(signatureB64, 'base64url');

    if (!payload.sub || !payload.iss || !Array.isArray(payload.perm)) return null;
    if (!parseCapSub(payload.sub)) return null;

    // Check expiry
    if (payload.exp != null && payload.exp < Math.floor(Date.now() / 1000)) return null;

    // Recover public key from issuer agent ID and verify signature
    const publicKey = agentIdToPublicKey(payload.iss);
    if (!verifyEd25519(Buffer.from(payloadB64), signature, publicKey)) return null;

    return payload;
  } catch {
    return null;
  }
}
