import { getConfig } from './config';
import { publishBlogPost } from './pipeline';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: bun run src/cli.ts <path-to-markdown-file>');
  process.exit(1);
}

const config = getConfig();

if (!config.tokenripApiKey) {
  console.error('TOKENRIP_API_KEY is required');
  process.exit(1);
}

const content = await Bun.file(filePath).text();

const result = await publishBlogPost(content, {
  tokenripUrl: config.tokenripUrl,
  tokenripApiKey: config.tokenripApiKey,
  anthropicApiKey: config.anthropicApiKey,
  anthropicModel: config.anthropicModel,
  author: {
    authorName: config.blogAuthorName,
    authorType: config.blogAuthorType,
  },
});

console.log(
  result.updated
    ? `Updated: ${result.slug} (${result.publicId})`
    : `Published: ${result.slug} (${result.publicId})`,
);
