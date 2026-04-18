/**
 * One-time migration: re-encode agent IDs from trip1... to rip1...
 *
 * Usage (from apps/backend/):
 *   bun run scripts/migrate-trip1-to-rip1.ts
 *
 * Safe to run multiple times — skips agents already on rip1.
 * Uses a transaction: all updates commit together or not at all.
 */

import { Client } from 'pg';
import { bech32 } from 'bech32';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), process.env.ENV_FILE || '.env') });

function migrateAgentId(id: string): string {
  const { words } = bech32.decode(id, 90);
  const bytes = Buffer.from(bech32.fromWords(words));
  return bech32.encode('rip', bech32.toWords(bytes), 90);
}

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

await client.connect();
await client.query('BEGIN');

try {
  const { rows: agents } = await client.query<{ id: string }>(
    `SELECT id FROM agent WHERE id LIKE 'trip1%'`
  );

  if (agents.length === 0) {
    console.log('No trip1 agents found — already migrated or nothing to do.');
    await client.query('ROLLBACK');
    process.exit(0);
  }

  console.log(`Migrating ${agents.length} agent(s)...`);

  for (const { id: oldId } of agents) {
    const newId = migrateAgentId(oldId);
    console.log(`  ${oldId}`);
    console.log(`  → ${newId}`);

    // Update agent.id — ON UPDATE CASCADE propagates to:
    //   api_key.agent_id, agent_key_pair.agent_id, operator_binding.agent_id,
    //   participant.agent_id, contact.owner_agent_id, contact.contact_agent_id
    await client.query(`UPDATE agent SET id = $1 WHERE id = $2`, [newId, oldId]);

    // Manual updates for columns without FK constraints
    await client.query(`UPDATE asset         SET owner_id   = $1 WHERE owner_id   = $2`, [newId, oldId]);
    await client.query(`UPDATE thread        SET created_by = $1 WHERE created_by = $2`, [newId, oldId]);
    await client.query(`UPDATE thread        SET owner_id   = $1 WHERE owner_id   = $2`, [newId, oldId]);
    await client.query(`UPDATE collection_row SET created_by = $1 WHERE created_by = $2`, [newId, oldId]);
    await client.query(`UPDATE oauth_code    SET agent_id   = $1 WHERE agent_id   = $2`, [newId, oldId]);
    await client.query(`UPDATE link_code     SET agent_id   = $1 WHERE agent_id   = $2`, [newId, oldId]);
    await client.query(`UPDATE share_token   SET agent_id   = $1 WHERE agent_id   = $2`, [newId, oldId]);
  }

  await client.query('COMMIT');
  console.log('Done.');
} catch (err) {
  await client.query('ROLLBACK');
  console.error('Migration failed, rolled back:', err);
  process.exit(1);
} finally {
  await client.end();
}
