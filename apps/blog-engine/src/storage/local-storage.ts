import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { StorageService } from './storage.interface';

export class LocalStorage implements StorageService {
  constructor(private readonly basePath: string) {}

  private resolve(key: string): string {
    return path.join(this.basePath, key);
  }

  async save(key: string, data: Buffer): Promise<void> {
    const filePath = this.resolve(key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data);
  }

  async read(key: string): Promise<Buffer> {
    return fs.readFile(this.resolve(key));
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.resolve(key));
      return true;
    } catch {
      return false;
    }
  }

  async delete(key: string): Promise<void> {
    await fs.unlink(this.resolve(key));
  }

  async list(): Promise<string[]> {
    const entries = await fs.readdir(this.basePath);
    return entries.filter((f) => f.endsWith('.md'));
  }
}
