#!/usr/bin/env node
import { createRequire } from 'node:module';
import { Command } from 'commander';
import { configSetKey, configSetUrl } from './commands/config.js';
import { upload } from './commands/upload.js';
import { publish } from './commands/publish.js';
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
  .description('Upload a file (PDF, image, etc.) and get a shareable link')
  .action(wrapCommand(upload));

// publish command
program
  .command('publish')
  .argument('<file>', 'Content file to publish')
  .requiredOption('--type <type>', 'Content type: markdown, html, or chart')
  .option('--title <title>', 'Artifact title')
  .description('Publish structured content (markdown, HTML, chart) for rich rendering')
  .action(wrapCommand(publish));

program.parse();
