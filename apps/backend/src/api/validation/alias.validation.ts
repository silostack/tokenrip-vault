const ALIAS_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 128;

const RESERVED_WORDS = new Set([
  'assets',
  'status',
  'register',
  'api',
  'blog',
  'admin',
  'auth',
  'v0',
  'health',
  's',
  'agents',
  'threads',
  'messages',
  'inbox',
  'operator',
  'operators',
]);

export function validateAlias(alias: string): string | null {
  if (alias.length < MIN_LENGTH) {
    return `Alias must be at least ${MIN_LENGTH} characters`;
  }

  if (alias.length > MAX_LENGTH) {
    return `Alias must be at most ${MAX_LENGTH} characters`;
  }

  if (!ALIAS_REGEX.test(alias)) {
    return 'Alias must contain only lowercase alphanumeric characters and hyphens, and must start and end with an alphanumeric character';
  }

  if (RESERVED_WORDS.has(alias)) {
    return `Alias "${alias}" is reserved`;
  }

  return null;
}
