export function getConfig() {
  return {
    port: parseInt(process.env.PORT || '3500', 10),
    storagePath: process.env.STORAGE_PATH || './articles',
    sqlitePath: process.env.SQLITE_PATH || './data/blog.sqlite',
    storageProvider: process.env.STORAGE_PROVIDER || 'local',
  };
}
