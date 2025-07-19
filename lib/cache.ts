interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class Cache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL = 60 * 60 * 1000 // 1 hour

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl || this.defaultTTL)

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)

    if (!entry) {
      return false
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    // Clean expired entries first
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
    return this.cache.size
  }

  getStats(): { size: number; keys: string[] } {
    const now = Date.now()
    const validKeys: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now <= entry.expiresAt) {
        validKeys.push(key)
      } else {
        this.cache.delete(key)
      }
    }

    return {
      size: validKeys.length,
      keys: validKeys,
    }
  }
}

export const cache = new Cache()
