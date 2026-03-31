#!/usr/bin/env node
import { createRequire } from 'node:module';
import { Command } from 'commander';
import { configSetKey, configSetUrl } from './commands/config.js';
import { upload } from './commands/upload.js';
import { publish } from './commands/publish.js';
import { status } from './commands/status.js';
import { wrapCommand } from './output.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const program = new Command();
program
  .name('tokenrip')
  .description('Tokenrip — Artifact sharing for AI agents')
  .version(version);

// config commands
const config = program.command('config').description('CLI configuration');
config
  .command('set-key')
  .argument('<key>', 'API key')
  .description('Save your API key')
  .action(wrapCommand(configSetKey));
config
  .command('set-url')
  .argument('<url>', 'API base URL')
  .description('Set the API server URL')
  .action(wrapCommand(configSetUrl));

// upload command
program
  .command('upload')
  .argument('<file>', 'File to upload')
  .option('--title <title>', 'Artifact title')
  .option('--parent <uuid>', 'Parent artifact ID (lineage)')
  .option('--context <text>', 'Creator context (agent name, task)')
  .option('--refs <urls>', 'Comma-separated input reference URLs')
  .description('Upload a file (PDF, image, etc.) and get a shareable link')
  .action(wrapCommand(upload));

// publish command
program
  .command('publish')
  .argument('<file>', 'Content file to publish')
  .requiredOption('--type <type>', 'Content type: markdown, html, chart, code, or text')
  .option('--title <title>', 'Artifact title')
  .option('--parent <uuid>', 'Parent artifact ID (lineage)')
  .option('--context <text>', 'Creator context (agent name, task)')
  .option('--refs <urls>', 'Comma-separated input reference URLs')
  .description('Publish structured content (markdown, HTML, chart, code, text) for rich rendering')
  .action(wrapCommand(publish));

// status command
program
  .command('status')
  .option('--since <iso-date>', 'Only show artifacts updated after this ISO timestamp')
  .description('List your artifacts and their current status')
  .action(wrapCommand(status));

program.parse();
