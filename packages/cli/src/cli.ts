#!/usr/bin/env node
import { createRequire } from 'node:module';
import { Command } from 'commander';
import { configSetKey, configSetUrl, configShow } from './commands/config.js';
import { authCreateKey } from './commands/auth.js';
import { upload } from './commands/upload.js';
import { publish } from './commands/publish.js';
import { status } from './commands/status.js';
import { wrapCommand } from './output.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const program = new Command();
program
  .name('tokenrip')
  .description('Tokenrip — Asset sharing for AI agents')
  .version(version)
  .addHelpText('after', `
QUICK START:
  1. Create an API key (auto-saved):
     $ tokenrip auth create-key

  2. Start sharing assets:
     $ tokenrip publish examples/report.md --type markdown
     $ tokenrip upload image.png --title "Screenshot"

EXAMPLES:
  Publish markdown with metadata:
    tokenrip publish file.md --type markdown --title "My Report" \\
      --context "Claude Agent 1" --refs "https://example.com"

  Upload a file:
    tokenrip upload document.pdf --title "Analysis"

  Check asset status:
    tokenrip status --since 2026-03-30T00:00:00Z
`);

// config commands
const config = program.command('config').description('Manage CLI configuration');
config
  .command('show')
  .description('Show current configuration')
  .addHelpText('after', `
Shows the API URL and whether an API key is configured.
`)
  .action(wrapCommand(configShow));
config
  .command('set-key')
  .argument('<key>', 'API key from /v0/auth/keys')
  .description('Save your API key for authentication')
  .addHelpText('after', `
HOW TO GET AN API KEY:
  1. Run this command:
     curl -X POST http://localhost:3434/v0/auth/keys \\
       -H "Content-Type: application/json" \\
       -d '{"name":"your-agent-name"}'

  2. Extract the key from the response and save it:
     tokenrip config set-key <key>

  ENVIRONMENT VARIABLE:
    You can also set TOKENRIP_API_KEY instead of using this command.
`)
  .action(wrapCommand(configSetKey));
config
  .command('set-url')
  .argument('<url>', 'e.g., http://localhost:3434')
  .description('Set the Tokenrip API server URL')
  .addHelpText('after', `
EXAMPLES:
  Local development:
    tokenrip config set-url http://localhost:3434

  Production:
    tokenrip config set-url https://api.tokenrip.com

  ENVIRONMENT VARIABLE:
    You can also set TOKENRIP_API_URL instead of using this command.
`)
  .action(wrapCommand(configSetUrl));

// auth command
const auth = program.command('auth').description('Manage API keys and authentication');

auth
  .command('create-key')
  .option('--name <name>', 'Friendly name for this key (default: tokenrip-<hostname>)')
  .option('--no-save', 'Create key but do not auto-save to config')
  .description('Create a new API key')
  .addHelpText('after', `
EXAMPLES:
  Create a key with a default name (auto-saved):
    $ tokenrip auth create-key

  Create a key with a custom name:
    $ tokenrip auth create-key --name "My Agent"

  Create a key without auto-saving:
    $ tokenrip auth create-key --no-save

The API key is sensitive — treat it like a password.
`)
  .action(wrapCommand(authCreateKey));

// upload command
program
  .command('upload')
  .argument('<file>', 'File path to upload (PDF, image, document, etc.)')
  .option('--title <title>', 'Display title for the asset')
  .option('--parent <uuid>', 'Parent asset ID for lineage tracking')
  .option('--context <text>', 'Creator context (your agent name, task, etc.)')
  .option('--refs <urls>', 'Comma-separated input reference URLs')
  .description('Upload a file and get a shareable UUID link')
  .addHelpText('after', `
EXAMPLES:
  $ tokenrip upload report.pdf --title "Agent Analysis"
  $ tokenrip upload chart.png --context "Claude Agent 1" \\
    --refs "https://source.example.com,https://another.com"
`)
  .action(wrapCommand(upload));

// publish command
program
  .command('publish')
  .argument('<file>', 'File containing the content to publish')
  .requiredOption('--type <type>', 'Content type: markdown, html, chart, code, or text')
  .option('--title <title>', 'Display title for the asset')
  .option('--parent <uuid>', 'Parent asset ID for lineage tracking')
  .option('--context <text>', 'Creator context (your agent name, task, etc.)')
  .option('--refs <urls>', 'Comma-separated input reference URLs')
  .description('Publish structured content with rich rendering support')
  .addHelpText('after', `
CONTENT TYPES:
  markdown   - Rendered markdown with formatting
  html       - Custom HTML rendering
  chart      - JSON chart/visualization data
  code       - Code snippets with syntax highlighting
  text       - Plain text

EXAMPLES:
  $ tokenrip publish analysis.md --type markdown --title "Summary"
  $ tokenrip publish data.json --type chart \\
    --context "Data viz agent" --refs "https://api.example.com"
`)
  .action(wrapCommand(publish));

// status command
program
  .command('status')
  .option('--since <iso-date>', 'Only show assets modified after this timestamp (ISO 8601)')
  .description('List all your published assets and their metadata')
  .addHelpText('after', `
EXAMPLES:
  $ tokenrip status
  $ tokenrip status --since 2026-03-30T00:00:00Z
`)
  .action(wrapCommand(status));

program.parse();
