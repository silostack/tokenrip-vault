import { randomBytes } from 'crypto';

export function generateTestDbName(): string {
  return `tokenrip_test_${randomBytes(4).toString('hex')}`;
}

export async function createTestDatabase(name: string): Promise<void> {
  const proc = Bun.spawn(['createdb', name], { stderr: 'pipe' });
  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    const stderr = await new Response(proc.stderr).text();
    throw new Error(`createdb failed (exit ${exitCode}): ${stderr}`);
  }
}

export async function dropTestDatabase(name: string): Promise<void> {
  const proc = Bun.spawn(['dropdb', '--if-exists', '--force', name], { stderr: 'pipe' });
  await proc.exited;
}
