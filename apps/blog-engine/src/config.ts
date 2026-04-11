export function getConfig() {
  return {
    port: parseInt(process.env.PORT || '3500', 10),
    storagePath: process.env.STORAGE_PATH || './articles',
    sqlitePath: process.env.SQLITE_PATH || './data/blog.sqlite',
    storageProvider: process.env.STORAGE_PROVIDER || 'local',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250514',
    blogAuthorName: process.env.BLOG_AUTHOR_NAME || 'Tokenrip',
    blogAuthorType: process.env.BLOG_AUTHOR_TYPE || 'Organization',
  };
}
