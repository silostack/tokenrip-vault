import { CliError, toCliError } from './errors.js';

export function outputSuccess(data: Record<string, unknown>): void {
  console.log(JSON.stringify({ ok: true, data }));
}

export function outputError(err: CliError): never {
  console.log(JSON.stringify({ ok: false, error: err.code, message: err.message }));
  process.exit(1);
}

export function wrapCommand<T extends (...args: any[]) => Promise<void>>(fn: T): T {
  const wrapped = async (...args: any[]) => {
    try {
      await fn(...args);
    } catch (err) {
      outputError(toCliError(err));
    }
  };
  return wrapped as unknown as T;
}
