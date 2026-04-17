import { tmpdir } from 'os';
import { join } from 'path';

// Preloaded before every test file — sets baseline env vars
// Individual test files override DATABASE_NAME with their own unique DB
process.env.DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
process.env.DATABASE_PORT = process.env.DATABASE_PORT || '5432';
// Use OS username for local Postgres (peer/trust auth)
process.env.DATABASE_USER = process.env.DATABASE_USER || process.env.USER || '';
process.env.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
process.env.NODE_ENV = 'test';
// Backend reads FRONTEND_URL / API_URL at module-load time (ref.service.ts); provide defaults
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3333';
process.env.API_URL = process.env.API_URL || 'http://localhost:3434';
// CLI tests call command functions directly inside Bun's TTY — force JSON output
process.env.TOKENRIP_OUTPUT = 'json';
// Isolate CLI config from user's local ~/.config/tokenrip so disk config never leaks into tests
process.env.TOKENRIP_CONFIG_DIR = join(tmpdir(), 'tokenrip-test-config-isolated');
