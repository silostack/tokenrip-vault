import { loadConfig } from './config';
import { preflight } from './preflight';
import { createLLMClient } from './llm/client';
import { RepoReader } from './repo/reader';
import { ingest } from './pipelines/ingest';
import { surface } from './pipelines/surface';
import { publish } from './pipelines/publish';

const USAGE = `Usage:
  bun run src/cli.ts ingest <source-path>       Extract signals from a source, update wiki
  bun run src/cli.ts ingest --inbox              Process all files in sources/inbox/
  bun run src/cli.ts surface                     Generate editorial brief from signals + wiki
  bun run src/cli.ts publish <wiki-page> [--angle "..."]  Draft blog post from wiki page`;

const command = process.argv[2];

if (!command || !['ingest', 'surface', 'publish'].includes(command)) {
  console.error(USAGE);
  process.exit(1);
}

const config = loadConfig();
await preflight(config.inteliwikiPath);
const llm = createLLMClient(config.anthropicApiKey, config.anthropicModel);

if (command === 'ingest') {
  const isInbox = process.argv.includes('--inbox');

  if (isInbox) {
    const reader = new RepoReader(config.inteliwikiPath);
    const files = await reader.readInbox();

    if (files.length === 0) {
      console.log('No files in inbox.');
      process.exit(0);
    }

    for (const file of files) {
      const result = await ingest({
        sourcePath: file,
        repoPath: config.inteliwikiPath,
        llm,
      });
      console.log(
        `${file}: ${result.signals.length} signals, ${result.wikiUpdates.length} wiki updates, moved to ${result.sourceMovedTo}`,
      );
    }
  } else {
    const sourcePath = process.argv[3];
    if (!sourcePath) {
      console.error('Error: source path required for ingest');
      console.error(USAGE);
      process.exit(1);
    }

    const result = await ingest({
      sourcePath,
      repoPath: config.inteliwikiPath,
      llm,
    });

    console.log(`Signals: ${result.signals.length}`);
    console.log(`Wiki updates: ${result.wikiUpdates.length}`);
    console.log(`Source moved to: ${result.sourceMovedTo}`);
  }
} else if (command === 'surface') {
  const result = await surface({
    repoPath: config.inteliwikiPath,
    llm,
  });

  console.log(`Brief: ${result.briefPath}`);
  console.log(`Signals: ${result.metrics.totalSignals}`);
  console.log(`Wiki pages: ${result.metrics.totalWikiPages}`);
  console.log(`Stale pages: ${result.metrics.stalePages}`);
  console.log(`Coverage gaps: ${result.metrics.coverageGaps}`);
} else if (command === 'publish') {
  const wikiPagePath = process.argv[3];
  if (!wikiPagePath) {
    console.error('Error: wiki page path required for publish');
    console.error(USAGE);
    process.exit(1);
  }

  const angleIdx = process.argv.indexOf('--angle');
  const angle = angleIdx !== -1 ? process.argv[angleIdx + 1] : undefined;

  const result = await publish({
    wikiPagePath,
    repoPath: config.inteliwikiPath,
    llm,
    angle,
  });

  console.log(`Draft: ${result.path}`);
  console.log(`Slug: ${result.slug}`);
  console.log(
    `Publish with: bun run apps/blog-pipeline/src/cli.ts ${config.inteliwikiPath}/${result.path}`,
  );
}
