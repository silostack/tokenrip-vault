import { generateKeyPairSync } from 'node:crypto';
import { bech32 } from 'bech32';

const AGENT_HRP = 'trip';
const BECH32_LIMIT = 90;

export interface Keypair {
  publicKeyHex: string;
  secretKeyHex: string;
}

export function generateKeypair(): Keypair {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  const rawPub = (publicKey.export({ type: 'spki', format: 'der' }) as Buffer).subarray(12);
  const rawPriv = (privateKey.export({ type: 'pkcs8', format: 'der' }) as Buffer).subarray(16);
  return {
    publicKeyHex: rawPub.toString('hex'),
    secretKeyHex: rawPriv.toString('hex'),
  };
}

export function publicKeyToAgentId(publicKeyHex: string): string {
  const bytes = Buffer.from(publicKeyHex, 'hex');
  const words = bech32.toWords(bytes);
  return bech32.encode(AGENT_HRP, words, BECH32_LIMIT);
}
