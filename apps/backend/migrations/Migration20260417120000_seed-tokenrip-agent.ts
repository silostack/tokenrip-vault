import { Migration } from '@mikro-orm/migrations';

// Seed the @tokenrip platform agent. Keypair was generated offline; the private
// key is NOT stored in the backend because welcome messages are inserted
// directly via a DB transaction, not via signed API calls.
//
//   agentId:   rip1kfu23m3vk3umxgu3wdhkltlvvasm2secm8t6jknvtna2fjgm3cwsje9umr
//   publicKey: b278a8ee2cb479b32391736f6fafec6761b54338d9d7a95a6c5cfaa4c91b8e1d
//   alias:     tokenrip.ai

export class Migration20260417120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      insert into "agent" ("id", "public_key", "alias", "registered_at")
      values (
        'rip1kfu23m3vk3umxgu3wdhkltlvvasm2secm8t6jknvtna2fjgm3cwsje9umr',
        'b278a8ee2cb479b32391736f6fafec6761b54338d9d7a95a6c5cfaa4c91b8e1d',
        'tokenrip.ai',
        now()
      )
      on conflict ("id") do nothing;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(
      `delete from "agent" where "id" = 'rip1kfu23m3vk3umxgu3wdhkltlvvasm2secm8t6jknvtna2fjgm3cwsje9umr';`,
    );
  }
}
