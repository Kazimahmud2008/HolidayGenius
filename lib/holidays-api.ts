import { API_CONFIGS, FALLBACK_PROVIDERS, type APIProvider } from "./api-config"
import { rateLimiter } from "./rate-limiter"
import { cache } from "./cache"
import { APIAdapter } from "./api-adapters"
import { nagerAPI, type NagerHoliday, type NagerCountry } from "./nager-api"

export interface Holiday {
  id: string
  name: string
  date: string
  country: string
  countryCode: string
  type: "public" | "religious" | "observance" | "national"
  description?: string
  localName?: string
  global: boolean
  fixed?: boolean
  launchYear?: number | null
  counties?: string[] | null
}

export interface Country {
  code: string
  name: string
  flag: string
}

export interface APIResponse<T> {
  data: T
  provider: string
  cached: boolean
  rateLimit?: {
    remaining: number
    resetTime: number | null
  }
}

export interface HolidaySearchOptions {
  year?: number
  month?: number
  type?: Holiday["type"]
  limit?: number
}

export interface LongWeekend {
  startDate: string
  endDate: string
  dayCount: number
  needBridgeDay: boolean
  country: string
  countryCode: string
}

class HolidayAPIService {
  private async makeRequest(url: string, provider: APIProvider, options: RequestInit = {}): Promise<Response> {
    const config = API_CONFIGS[provider]

    // Check rate limit
    if (!rateLimiter.canMakeRequest(provider, config.rateLimit.requests, config.rateLimit.period)) {
      throw new Error(`Rate limit exceeded for ${config.name}. Try again later.`)
    }

    // Add API key to headers or query params based on provider
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "GlobeHoliday.ai/1.0",
      ...options.headers,
    }

    if (config.apiKey) {
      if (provider === "calendarific") {
        // Calendarific uses query parameter
        const separator = url.includes("?") ? "&" : "?"
        url += `${separator}api_key=${config.apiKey}`
      } else if (provider === "abstract") {
        // Abstract API uses query parameter
        const separator = url.includes("?") ? "&" : "?"
        url += `${separator}api_key=${config.apiKey}`
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response
  }

  async getHolidaysByCountry(countryCode: string, options: HolidaySearchOptions = {}): Promise<APIResponse<Holiday[]>> {
    const { year = new Date().getFullYear() } = options
    const cacheKey = `holidays_${countryCode}_${year}_${JSON.stringify(options)}`

    // Check cache first
    const cachedData = cache.get<Holiday[]>(cacheKey)
    if (cachedData) {
      return {
        data: cachedData,
        provider: "cache",
        cached: true,
      }
    }

    // Try Nager.Date first (it's free and reliable)
    try {
      const nagerHolidays = await nagerAPI.getPublicHolidays(countryCode, year)
      const holidays = this.adaptNagerHolidays(nagerHolidays, countryCode)

      // Filter by month if specified
      let filteredHolidays = holidays
      if (options.month) {
        filteredHolidays = holidays.filter((holiday) => {
          const holidayDate = new Date(holiday.date)
          return holidayDate.getMonth() === options.month! - 1
        })
      }

      // Filter by type if specified
      if (options.type) {
        filteredHolidays = filteredHolidays.filter((holiday) => holiday.type === options.type)
      }

      // Apply limit if specified
      if (options.limit) {
        filteredHolidays = filteredHolidays.slice(0, options.limit)
      }

      // Cache successful response
      cache.set(cacheKey, filteredHolidays, 24 * 60 * 60 * 1000) // 24 hours

      return {
        data: filteredHolidays,
        provider: "Nager.Date",
        cached: false,
        rateLimit: {
          remaining: 999999, // Nager.Date has no strict rate limits
          resetTime: null,
        },
      }
    } catch (error) {
      console.warn("Nager.Date failed, trying fallback providers:", error)

      // Try other providers as fallback
      for (const provider of FALLBACK_PROVIDERS.filter((p) => p !== "holidays-api")) {
        try {
          const holidays = await this.fetchHolidaysFromProvider(provider, countryCode, options)
          cache.set(cacheKey, holidays, 24 * 60 * 60 * 1000)

          return {
            data: holidays,
            provider: API_CONFIGS[provider].name,
            cached: false,
            rateLimit: {
              remaining: rateLimiter.getRemainingRequests(provider, API_CONFIGS[provider].rateLimit.requests),
              resetTime: rateLimiter.getResetTime(provider),
            },
          }
        } catch (error) {
          console.warn(`Failed to fetch from ${provider}:`, error)
          continue
        }
      }
    }

    throw new Error("All API providers failed. Please try again later.")
  }

  private adaptNagerHolidays(nagerHolidays: NagerHoliday[], countryCode: string): Holiday[] {
    return nagerHolidays.map((holiday, index) => ({
      id: `nager_${holiday.countryCode}_${holiday.date}_${index}`,
      name: holiday.name,
      date: holiday.date,
      country: this.getCountryName(holiday.countryCode),
      countryCode: holiday.countryCode,
      type: this.mapNagerType(holiday.types),
      description: `${holiday.name} is a ${holiday.global ? "national" : "regional"} holiday in ${this.getCountryName(holiday.countryCode)}.`,
      localName: holiday.localName,
      global: holiday.global,
      fixed: holiday.fixed,
      launchYear: holiday.launchYear,
      counties: holiday.counties,
    }))
  }

  private fetchHolidaysFromProvider(
    provider: APIProvider,
    countryCode: string,
    options: HolidaySearchOptions,
  ): Promise<Holiday[]> {
    const config = API_CONFIGS[provider]
    const { year = new Date().getFullYear() } = options

    switch (provider) {
      case "calendarific":
        return this.fetchFromCalendarific(countryCode, year)

      case "abstract":
        return this.fetchFromAbstract(countryCode, year)

      case "holidays-api":
        // This is handled by the main Nager.Date integration above
        throw new Error("Nager.Date should be handled separately")

      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }

  private async fetchFromCalendarific(countryCode: string, year: number): Promise<Holiday[]> {
    const config = API_CONFIGS.calendarific
    const url = `${config.baseUrl}${config.endpoints.holidays}?country=${countryCode}&year=${year}`

    const response = await this.makeRequest(url, "calendarific")
    const data = await response.json()

    return APIAdapter.adaptCalendarificHolidays(data, countryCode)
  }

  private async fetchFromAbstract(countryCode: string, year: number): Promise<Holiday[]> {
    const config = API_CONFIGS.abstract
    const url = `${config.baseUrl}${config.endpoints.holidays}?country=${countryCode}&year=${year}`

    const response = await this.makeRequest(url, "abstract")
    const data = await response.json()

    return APIAdapter.adaptAbstractHolidays(Array.isArray(data) ? data : [data], countryCode)
  }

  async getAvailableCountries(): Promise<APIResponse<Country[]>> {
    const cacheKey = "available_countries"

    // Check cache first
    const cachedData = cache.get<Country[]>(cacheKey)
    if (cachedData) {
      return {
        data: cachedData,
        provider: "cache",
        cached: true,
      }
    }

    try {
      const nagerCountries = await nagerAPI.getAvailableCountries()
      const countries = this.adaptNagerCountries(nagerCountries)

      // Cache for 7 days
      cache.set(cacheKey, countries, 7 * 24 * 60 * 60 * 1000)

      return {
        data: countries,
        provider: "Nager.Date",
        cached: false,
        rateLimit: {
          remaining: 999999,
          resetTime: null,
        },
      }
    } catch (error) {
      console.warn("Failed to fetch countries from Nager.Date, using fallback")

      // Fallback to hardcoded list
      const fallbackCountries: Country[] = [
        { code: "AD", name: "Andorra", flag: "🇦🇩" },
        { code: "AL", name: "Albania", flag: "🇦🇱" },
        { code: "AM", name: "Armenia", flag: "🇦🇲" },
        { code: "AR", name: "Argentina", flag: "🇦🇷" },
        { code: "AT", name: "Austria", flag: "🇦🇹" },
        { code: "AU", name: "Australia", flag: "🇦🇺" },
        { code: "BE", name: "Belgium", flag: "🇧🇪" },
        { code: "BW", name: "Botswana", flag: "🇧🇼" },
        { code: "BR", name: "Brazil", flag: "🇧🇷" },
        { code: "CA", name: "Canada", flag: "🇨🇦" },
        { code: "CN", name: "China", flag: "🇨🇳" },
        { code: "CO", name: "Colombia", flag: "🇨🇴" },
        { code: "DK", name: "Denmark", flag: "🇩🇰" },
        { code: "FI", name: "Finland", flag: "🇫🇮" },
        { code: "FR", name: "France", flag: "🇫🇷" },
        { code: "DE", name: "Germany", flag: "🇩🇪" },
        { code: "IN", name: "India", flag: "🇮🇳" },
        { code: "IT", name: "Italy", flag: "🇮🇹" },
        { code: "JP", name: "Japan", flag: "🇯🇵" },
        { code: "LS", name: "Lesotho", flag: "🇱🇸" },
        { code: "MX", name: "Mexico", flag: "🇲🇽" },
        { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
        { code: "NL", name: "Netherlands", flag: "🇳🇱" },
        { code: "NO", name: "Norway", flag: "🇳🇴" },
        { code: "ES", name: "Spain", flag: "🇪🇸" },
        { code: "SE", name: "Sweden", flag: "🇸🇪" },
        { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
        { code: "US", name: "United States", flag: "🇺🇸" },
        { code: "UY", name: "Uruguay", flag: "🇺🇾" },
        { code: "VE", name: "Venezuela", flag: "🇻🇪" },
      ]

      return {
        data: fallbackCountries,
        provider: "fallback",
        cached: false,
      }
    }
  }

  private adaptNagerCountries(countries: NagerCountry[]): Country[] {
    return countries.map((country) => ({
      code: country.countryCode,
      name: country.name,
      flag: this.getCountryFlag(country.countryCode),
    }))
  }

  // New method: Get next public holidays worldwide
  async getNextPublicHolidaysWorldwide(): Promise<APIResponse<Holiday[]>> {
    const cacheKey = "next_holidays_worldwide"

    const cachedData = cache.get<Holiday[]>(cacheKey)
    if (cachedData) {
      return {
        data: cachedData,
        provider: "cache",
        cached: true,
      }
    }

    try {
      const nagerHolidays = await nagerAPI.getNextPublicHolidaysWorldwide()
      const holidays = this.adaptNagerHolidays(nagerHolidays, "")

      // Cache for 1 hour (these change frequently)
      cache.set(cacheKey, holidays, 60 * 60 * 1000)

      return {
        data: holidays,
        provider: "Nager.Date",
        cached: false,
      }
    } catch (error) {
      console.error("Failed to fetch next worldwide holidays:", error)
      return {
        data: [],
        provider: "error",
        cached: false,
      }
    }
  }

  // New method: Get long weekends
  async getLongWeekends(
    countryCode: string,
    year: number = new Date().getFullYear(),
  ): Promise<APIResponse<LongWeekend[]>> {
    const cacheKey = `long_weekends_${countryCode}_${year}`

    const cachedData = cache.get<LongWeekend[]>(cacheKey)
    if (cachedData) {
      return {
        data: cachedData,
        provider: "cache",
        cached: true,
      }
    }

    try {
      const nagerLongWeekends = await nagerAPI.getLongWeekends(countryCode, year)
      const longWeekends: LongWeekend[] = nagerLongWeekends.map((lw) => ({
        ...lw,
        country: this.getCountryName(countryCode),
        countryCode,
      }))

      // Cache for 24 hours
      cache.set(cacheKey, longWeekends, 24 * 60 * 60 * 1000)

      return {
        data: longWeekends,
        provider: "Nager.Date",
        cached: false,
      }
    } catch (error) {
      console.error("Failed to fetch long weekends:", error)
      return {
        data: [],
        provider: "error",
        cached: false,
      }
    }
  }

  // New method: Check if date is public holiday
  async isPublicHoliday(date: string, countryCode: string): Promise<boolean> {
    try {
      return await nagerAPI.isPublicHoliday(date, countryCode)
    } catch (error) {
      console.error("Failed to check if date is public holiday:", error)
      return false
    }
  }

  async searchHolidays(query: string, countryCode?: string): Promise<APIResponse<Holiday[]>> {
    const cacheKey = `search_${query}_${countryCode || "all"}`

    // Check cache first
    const cachedData = cache.get<Holiday[]>(cacheKey)
    if (cachedData) {
      return {
        data: cachedData,
        provider: "cache",
        cached: true,
      }
    }

    // For search, we'll get holidays from multiple countries and filter
    const searchResults: Holiday[] = []
    const currentYear = new Date().getFullYear()

    if (countryCode) {
      // Search in specific country
      try {
        const response = await this.getHolidaysByCountry(countryCode, { year: currentYear })
        const filtered = response.data.filter(
          (holiday) =>
            holiday.name.toLowerCase().includes(query.toLowerCase()) ||
            holiday.description?.toLowerCase().includes(query.toLowerCase()) ||
            holiday.localName?.toLowerCase().includes(query.toLowerCase()),
        )
        searchResults.push(...filtered)
      } catch (error) {
        console.warn(`Search failed for country ${countryCode}:`, error)
      }
    } else {
      // Search across popular countries
      const popularCountries = ["US", "GB", "CA", "AU", "DE", "FR", "JP", "IN", "BR", "MX", "IT", "ES"]

      for (const country of popularCountries) {
        try {
          const response = await this.getHolidaysByCountry(country, { year: currentYear })
          const filtered = response.data.filter(
            (holiday) =>
              holiday.name.toLowerCase().includes(query.toLowerCase()) ||
              holiday.description?.toLowerCase().includes(query.toLowerCase()) ||
              holiday.localName?.toLowerCase().includes(query.toLowerCase()),
          )
          searchResults.push(...filtered)
        } catch (error) {
          console.warn(`Search failed for country ${country}:`, error)
          continue
        }
      }
    }

    // Remove duplicates and sort by relevance
    const uniqueResults = searchResults.filter(
      (holiday, index, self) => index === self.findIndex((h) => h.name === holiday.name && h.date === holiday.date),
    )

    // Sort by relevance (exact matches first, then partial matches)
    uniqueResults.sort((a, b) => {
      const aExact = a.name.toLowerCase() === query.toLowerCase()
      const bExact = b.name.toLowerCase() === query.toLowerCase()

      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1

      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

    // Cache results for 1 hour
    cache.set(cacheKey, uniqueResults, 60 * 60 * 1000)

    return {
      data: uniqueResults,
      provider: "search",
      cached: false,
    }
  }

  getNextGlobalHoliday(): Holiday | null {
    // This would need to be implemented with cached data or a specific API call
    // For now, return null and let the component handle it
    return null
  }

  private mapNagerType(types: string[]): Holiday["type"] {
    if (types.includes("Public")) return "public"
    if (types.includes("National")) return "national"
    if (types.includes("Religious")) return "religious"
    return "observance"
  }

  private getCountryFlag(countryCode: string): string {
    // Simple flag emoji mapping - in production, use a comprehensive library
    const flagMap: Record<string, string> = {
      AD: "🇦🇩",
      AL: "🇦🇱",
      AM: "🇦🇲",
      AR: "🇦🇷",
      AT: "🇦🇹",
      AU: "🇦🇺",
      BE: "🇧🇪",
      BW: "🇧🇼",
      BR: "🇧🇷",
      CA: "🇨🇦",
      CN: "🇨🇳",
      CO: "🇨🇴",
      DK: "🇩🇰",
      FI: "🇫🇮",
      FR: "🇫🇷",
      DE: "🇩🇪",
      IN: "🇮🇳",
      IT: "🇮🇹",
      JP: "🇯🇵",
      LS: "🇱🇸",
      MX: "🇲🇽",
      NI: "🇳🇮",
      NL: "🇳🇱",
      NO: "🇳🇴",
      ES: "🇪🇸",
      SE: "🇸🇪",
      GB: "🇬🇧",
      US: "🇺🇸",
      UY: "🇺🇾",
      VE: "🇻🇪",
    }
    return flagMap[countryCode.toUpperCase()] || "🏳️"
  }

  private getCountryName(countryCode: string): string {
    // Simple country name mapping
    const countryMap: Record<string, string> = {
      AD: "Andorra",
      AL: "Albania",
      AM: "Armenia",
      AR: "Argentina",
      AT: "Austria",
      AU: "Australia",
      BE: "Belgium",
      BW: "Botswana",
      BR: "Brazil",
      CA: "Canada",
      CN: "China",
      CO: "Colombia",
      DK: "Denmark",
      FI: "Finland",
      FR: "France",
      DE: "Germany",
      IN: "India",
      IT: "Italy",
      JP: "Japan",
      LS: "Lesotho",
      MX: "Mexico",
      NI: "Nicaragua",
      NL: "Netherlands",
      NO: "Norway",
      ES: "Spain",
      SE: "Sweden",
      GB: "United Kingdom",
      US: "United States",
      UY: "Uruguay",
      VE: "Venezuela",
    }
    return countryMap[countryCode.toUpperCase()] || countryCode
  }

  // Utility methods
  getCacheStats() {
    return cache.getStats()
  }

  clearCache() {
    cache.clear()
  }

  getRateLimitStatus(provider: APIProvider) {
    const config = API_CONFIGS[provider]
    return {
      remaining: rateLimiter.getRemainingRequests(provider, config.rateLimit.requests),
      resetTime: rateLimiter.getResetTime(provider),
      maxRequests: config.rateLimit.requests,
    }
  }
}

// Export singleton instance
export const holidayAPI = new HolidayAPIService()

// Export individual functions for backward compatibility
export async function getHolidaysByCountry(
  countryCode: string,
  year: number = new Date().getFullYear(),
): Promise<Holiday[]> {
  const response = await holidayAPI.getHolidaysByCountry(countryCode, { year })
  return response.data
}

export async function searchHolidays(query: string): Promise<Holiday[]> {
  const response = await holidayAPI.searchHolidays(query)
  return response.data
}

export async function getAvailableCountries(): Promise<Country[]> {
  const response = await holidayAPI.getAvailableCountries()
  return response.data
}

export function getNextGlobalHoliday(): Holiday | null {
  return holidayAPI.getNextGlobalHoliday()
}

// New exports for Nager.Date specific features
export async function getNextPublicHolidaysWorldwide(): Promise<Holiday[]> {
  const response = await holidayAPI.getNextPublicHolidaysWorldwide()
  return response.data
}

export async function getLongWeekends(countryCode: string, year?: number): Promise<LongWeekend[]> {
  const response = await holidayAPI.getLongWeekends(countryCode, year)
  return response.data
}

export async function isPublicHoliday(date: string, countryCode: string): Promise<boolean> {
  return holidayAPI.isPublicHoliday(date, countryCode)
}

// Re-export types
export type { Holiday, Country, APIResponse, HolidaySearchOptions, LongWeekend }
