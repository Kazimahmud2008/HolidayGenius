export interface APIConfig {
  name: string
  baseUrl: string
  apiKey: string
  rateLimit: {
    requests: number
    period: number // in milliseconds
  }
  endpoints: {
    holidays: string
    countries: string
  }
}

export const API_PROVIDERS = {
  NAGER_DATE: "nager-date",
  CALENDARIFIC: "calendarific",
  ABSTRACT: "abstract",
} as const

export type APIProvider = (typeof API_PROVIDERS)[keyof typeof API_PROVIDERS]

export const API_CONFIGS: Record<APIProvider, APIConfig> = {
  [API_PROVIDERS.NAGER_DATE]: {
    name: "Nager.Date",
    baseUrl: "https://date.nager.at/api/v3",
    apiKey: "", // Free API, no key required
    rateLimit: {
      requests: 100000, // Very generous limits
      period: 24 * 60 * 60 * 1000, // 24 hours
    },
    endpoints: {
      holidays: "/PublicHolidays",
      countries: "/AvailableCountries",
    },
  },
  [API_PROVIDERS.CALENDARIFIC]: {
    name: "Calendarific",
    baseUrl: "https://calendarific.com/api/v2",
    apiKey: process.env.CALENDARIFIC_API_KEY || "",
    rateLimit: {
      requests: 1000,
      period: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    endpoints: {
      holidays: "/holidays",
      countries: "/countries",
    },
  },
  [API_PROVIDERS.ABSTRACT]: {
    name: "Abstract API",
    baseUrl: "https://holidays.abstractapi.com/v1",
    apiKey: process.env.ABSTRACT_API_KEY || "",
    rateLimit: {
      requests: 1000,
      period: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    endpoints: {
      holidays: "",
      countries: "/countries",
    },
  },
}

export const DEFAULT_PROVIDER: APIProvider = API_PROVIDERS.NAGER_DATE
export const FALLBACK_PROVIDERS: APIProvider[] = [
  API_PROVIDERS.NAGER_DATE,
  API_PROVIDERS.CALENDARIFIC,
  API_PROVIDERS.ABSTRACT,
]
