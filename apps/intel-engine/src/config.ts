export interface IntelEngineConfig {
  inteliwikiPath: string;
  anthropicApiKey: string;
  anthropicModel: string;
}

export function loadConfig(): IntelEngineConfig {
  const inteliwikiPath = process.env.INTELIWIKI_PATH;
  if (!inteliwikiPath) {
    throw new Error('INTELIWIKI_PATH environment variable is required');
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  const anthropicModel = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

  return { inteliwikiPath, anthropicApiKey, anthropicModel };
}
