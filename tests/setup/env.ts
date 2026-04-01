// Preloaded before every test file — sets baseline env vars
// Individual test files override DATABASE_NAME with their own unique DB
process.env.DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
process.env.DATABASE_PORT = process.env.DATABASE_PORT || '5432';
// Use OS username for local Postgres (peer/trust auth)
process.env.DATABASE_USER = process.env.DATABASE_USER || process.env.USER || '';
process.env.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
process.env.NODE_ENV = 'test';
// CLI tests call command functions directly inside Bun's TTY — force JSON output
process.env.TOKENRIP_OUTPUT = 'json';
