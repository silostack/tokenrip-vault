import { Migration } from '@mikro-orm/migrations';

export class Migration20260331050937 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "api_key" ("id" uuid not null, "key_hash" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz not null, "last_used_at" timestamptz null, "revoked_at" timestamptz null, constraint "api_key_pkey" primary key ("id"));`);
    this.addSql(`alter table "api_key" add constraint "api_key_key_hash_unique" unique ("key_hash");`);

    this.addSql(`create table "artifact" ("id" uuid not null, "title" varchar(255) null, "description" text null, "type" text check ("type" in ('file', 'markdown', 'html', 'chart', 'code', 'text')) not null, "mime_type" varchar(255) null, "storage_key" varchar(255) not null, "metadata" jsonb null, "api_key_id" varchar(255) not null, "parent_artifact_id" uuid null, "creator_context" text null, "input_references" jsonb null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "artifact_pkey" primary key ("id"));`);
  }

}
