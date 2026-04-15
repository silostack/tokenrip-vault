export function getConfig() {
  return {
    tokenripUrl: process.env.TOKENRIP_API_URL || 'http://localhost:3434',
    tokenripApiKey: process.env.TOKENRIP_API_KEY || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6-20250627',
    blogAuthorName: process.env.BLOG_AUTHOR_NAME || 'Tokenrip',
    blogAuthorType: process.env.BLOG_AUTHOR_TYPE || 'Organization',
  };
}
