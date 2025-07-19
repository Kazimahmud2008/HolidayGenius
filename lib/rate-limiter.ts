interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()

  canMakeRequest(provider: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const key = provider
    const entry = this.limits.get(key)

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    if (entry.count >= maxRequests) {
      return false
    }

    entry.count++
    return true
  }

  getRemainingRequests(provider: string, maxRequests: number): number {
    const entry = this.limits.get(provider)
    if (!entry || Date.now() > entry.resetTime) {
      return maxRequests
    }
    return Math.max(0, maxRequests - entry.count)
  }

  getResetTime(provider: string): number | null {
    const entry = this.limits.get(provider)
    if (!entry || Date.now() > entry.resetTime) {
      return null
    }
    return entry.resetTime
  }
}

export const rateLimiter = new RateLimiter()
