const MISS = Symbol('cache-miss');

export class TTLCache<T> {
  private store = new Map<string, { data: T; expiry: number }>();

  get(key: string): T | typeof MISS {
    const entry = this.store.get(key);
    if (!entry) return MISS;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return MISS;
    }
    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== MISS;
  }

  set(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiry: Date.now() + ttlMs });
  }

  static isMiss<T>(value: T | typeof MISS): value is typeof MISS {
    return value === MISS;
  }
}
