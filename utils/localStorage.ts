export class LocalStorageCache<T = any> {
  private prefix: string;

  constructor(prefix: string = 'swr:') {
    this.prefix = prefix;
  }

  // Internal helper to generate the full localStorage key.
  private _getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Retrieves an item from localStorage.
   * @param key The key for the stored value.
   * @returns The parsed value, or undefined if not found.
   */
  public get(key: string): T | undefined {
    if (typeof window === 'undefined') return undefined; // SSR fallback
    const item = localStorage.getItem(this._getKey(key));
    if (!item) return undefined;
    try {
      return JSON.parse(item) as T;
    } catch (err) {
      // In case parsing fails, return the raw string as a fallback.
      return item as unknown as T;
    }
  }

  /**
   * Stringifies and stores a value in localStorage.
   * @param key The key for the value.
   * @param value The value to store.
   */
  public set(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this._getKey(key), JSON.stringify(value));
  }

  /**
   * Removes an item from localStorage.
   * @param key The key for the value to remove.
   */
  public delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this._getKey(key));
  }

  /**
   * Returns an iterator over the cache keys (without prefix).
   */
  public *keys(): IterableIterator<string> {
    if (typeof window === 'undefined') return;
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey && fullKey.startsWith(this.prefix)) {
        // Yield the key without the prefix.
        yield fullKey.slice(this.prefix.length);
      }
    }
  }

  /**
   * Clears all cached items.
   */
  public clear(): void {
    if (typeof window === 'undefined') return;
    for (const key of this.keys()) {
      localStorage.removeItem(this._getKey(key));
    }
  }
}

export function localStorageProvider() {
  // On the server, localStorage isn’t available.
  if (typeof window === 'undefined') {
    return new Map();
  }
  return new LocalStorageCache('swr:');
}
