// Pipeline exports
export { ingest } from './pipelines/ingest';
export { surface } from './pipelines/surface';
export { publish } from './pipelines/publish';

// Infrastructure exports
export { preflight } from './preflight';
export { loadConfig } from './config';
export { createLLMClient } from './llm/client';
export type { LLMClient } from './llm/client';

// Type exports
export type {
  Signal,
  SignalFrontmatter,
  WikiPage,
  WikiFrontmatter,
  IngestResult,
  SurfaceResult,
  PublishResult,
} from './types';
