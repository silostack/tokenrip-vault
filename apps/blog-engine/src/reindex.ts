import 'dotenv/config';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { getConfig } from './config';
import { LocalStorage } from './storage/local-storage';
import { ArticleIndex } from './db';
import { ArticleService } from './services/article.service';

async function main() {
  const config = getConfig();

  fs.mkdirSync(config.storagePath, { recursive: true });
  fs.mkdirSync(path.dirname(config.sqlitePath), { recursive: true });

  const storage = new LocalStorage(config.storagePath);
  const index = new ArticleIndex(config.sqlitePath);
  const service = new ArticleService(storage, index);

  console.log(`Reindexing from ${config.storagePath}...`);
  const count = await service.reindex();
  console.log(`Indexed ${count} article(s).`);

  service.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
