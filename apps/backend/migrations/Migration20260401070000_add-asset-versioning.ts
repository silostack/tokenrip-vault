import { Migration } from '@mikro-orm/migrations';

export class Migration20260401070000 extends Migration {

  override async up(): Promise<void> {
    // 1. Create asset_version table
    this.addSql(`
      create table "asset_version" (
        "id" uuid not null,
        "asset_id" uuid not null,
        "version" int not null,
        "label" varchar(255) null,
        "storage_key" varchar(255) not null,
        "size_bytes" bigint null,
        "mime_type" varchar(255) null,
        "creator_context" text null,
        "created_at" timestamptz not null default now(),
        constraint "asset_version_pkey" primary key ("id"),
        constraint "asset_version_asset_id_foreign" foreign key ("asset_id") references "asset" ("id") on delete cascade
      );
    `);

    this.addSql(`
      create unique index "asset_version_asset_id_version_unique"
        on "asset_version" ("asset_id", "version");
    `);

    // 2. Add versioning columns to asset
    this.addSql(`alter table "asset" add column "current_version_id" uuid null;`);
    this.addSql(`alter table "asset" add column "version_count" int not null default 1;`);

    // 3. Backfill: create a v1 AssetVersion for every existing asset
    this.addSql(`
      insert into "asset_version" ("id", "asset_id", "version", "storage_key", "size_bytes", "mime_type", "creator_context", "created_at")
      select gen_random_uuid(), "id", 1, "storage_key", "size_bytes", "mime_type", "creator_context", "created_at"
      from "asset";
    `);

    // 4. Point each asset's current_version_id to its backfilled v1 row
    this.addSql(`
      update "asset" set "current_version_id" = (
        select "av"."id" from "asset_version" "av"
        where "av"."asset_id" = "asset"."id" and "av"."version" = 1
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "asset" drop column if exists "current_version_id";`);
    this.addSql(`alter table "asset" drop column if exists "version_count";`);
    this.addSql(`drop table if exists "asset_version";`);
  }

}
