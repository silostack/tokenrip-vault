import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// Override config dir before importing
const testDir = path.join(os.tmpdir(), `tokenrip-contacts-test-${Date.now()}`);
process.env.TOKENRIP_CONFIG_DIR = testDir;

const { loadContacts, saveContacts, addContact, removeContact, resolveRecipient } = await import('../packages/cli/src/contacts.js');

beforeEach(() => {
  fs.mkdirSync(testDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

describe('contacts', () => {
  test('loadContacts returns empty object when no file', () => {
    expect(loadContacts()).toEqual({});
  });

  test('addContact stores contact with metadata', () => {
    addContact('alice', 'trip1abc123def456', { alias: 'alice.ai', notes: 'PDF agent' });
    const contacts = loadContacts();
    expect(contacts.alice).toEqual({
      agent_id: 'trip1abc123def456',
      alias: 'alice.ai',
      notes: 'PDF agent',
    });
  });

  test('addContact overwrites existing entry', () => {
    addContact('alice', 'trip1old');
    addContact('alice', 'trip1new', { alias: 'alice.ai' });
    expect(loadContacts().alice.agent_id).toBe('trip1new');
  });

  test('removeContact deletes entry', () => {
    addContact('alice', 'trip1abc');
    removeContact('alice');
    expect(loadContacts().alice).toBeUndefined();
  });

  test('removeContact throws for non-existent', () => {
    expect(() => removeContact('ghost')).toThrow();
  });

  test('resolveRecipient with trip1 ID returns as-is', () => {
    expect(resolveRecipient('trip1abc123')).toBe('trip1abc123');
  });

  test('resolveRecipient with contact name returns agent_id', () => {
    addContact('alice', 'trip1resolved');
    expect(resolveRecipient('alice')).toBe('trip1resolved');
  });

  test('resolveRecipient with unknown name passes through', () => {
    expect(resolveRecipient('bob.ai')).toBe('bob.ai');
  });
});
