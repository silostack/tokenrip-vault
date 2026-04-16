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
    addContact('alice', 'rip1abc123def456', { alias: 'alice', notes: 'PDF agent' });
    const contacts = loadContacts();
    expect(contacts.alice).toEqual({
      agent_id: 'rip1abc123def456',
      alias: 'alice',
      notes: 'PDF agent',
    });
  });

  test('addContact overwrites existing entry', () => {
    addContact('alice', 'rip1old');
    addContact('alice', 'rip1new', { alias: 'alice' });
    expect(loadContacts().alice.agent_id).toBe('rip1new');
  });

  test('removeContact deletes entry', () => {
    addContact('alice', 'rip1abc');
    removeContact('alice');
    expect(loadContacts().alice).toBeUndefined();
  });

  test('removeContact throws for non-existent', () => {
    expect(() => removeContact('ghost')).toThrow();
  });

  test('resolveRecipient with rip1 ID returns as-is', () => {
    expect(resolveRecipient('rip1abc123')).toBe('rip1abc123');
  });

  test('resolveRecipient with contact name returns agent_id', () => {
    addContact('alice', 'rip1resolved');
    expect(resolveRecipient('alice')).toBe('rip1resolved');
  });

  test('resolveRecipient with unknown name passes through', () => {
    expect(resolveRecipient('bob')).toBe('bob');
  });
});
