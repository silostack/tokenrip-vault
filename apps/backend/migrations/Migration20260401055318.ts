import { Migration } from '@mikro-orm/migrations';

export class Migration20260401055318 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "asset" add column if not exists "size_bytes" bigint null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "asset" drop column if exists "size_bytes";`);
  }

}
