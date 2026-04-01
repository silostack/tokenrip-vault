import { Migration } from '@mikro-orm/migrations';

export class Migration20260401044542_rename_artifact_to_asset extends Migration {

  override async up(): Promise<void> {
    // Add missing columns first (were in migration 1 SQL but not yet applied to DB)
    this.addSql(`alter table "artifact" add column if not exists "parent_artifact_id" uuid null;`);
    this.addSql(`alter table "artifact" add column if not exists "creator_context" text null;`);
    this.addSql(`alter table "artifact" add column if not exists "input_references" jsonb null;`);
    // Rename table and column
    this.addSql(`alter table "artifact" rename to "asset";`);
    this.addSql(`alter table "asset" rename column "parent_artifact_id" to "parent_asset_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "asset" rename column "parent_asset_id" to "parent_artifact_id";`);
    this.addSql(`alter table "asset" rename to "artifact";`);
    this.addSql(`alter table "artifact" drop column if exists "parent_artifact_id";`);
    this.addSql(`alter table "artifact" drop column if exists "creator_context";`);
    this.addSql(`alter table "artifact" drop column if exists "input_references";`);
  }

}
