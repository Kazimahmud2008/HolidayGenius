import type { Holiday, Country } from "./holidays-api"

// Calendarific API Response Types
interface CalendarificHoliday {
  name: string
  description: string
  country: {
    id: string
    name: string
  }
  date: {
    iso: string
    datetime: {
      year: number
      month: number
      day: number
    }
  }
  type: string[]
  primary_type: string
  canonical_url: string
  urlid: string
  locations: string
  states: string
}

interface CalendarificResponse {
  meta: {
    code: number
  }
  response: {
    holidays: CalendarificHoliday[]
  }
}

interface CalendarificCountry {
  country_name: string
  iso_3166: string
  total_holidays: number
  supported_languages: number
  uuid: string
}

interface CalendarificCountriesResponse {
  meta: {
    code: number
  }
  response: {
    countries: CalendarificCountry[]
  }
}

// Abstract API Response Types
interface AbstractHoliday {
  name: string
  name_local: string
  language: string
  description: string
  country: string
  location: string
  type: string
  date: string
  date_year: string
  date_month: string
  date_day: string
  week_day: string
}

// Holidays API (Nager.Date) Response Types
interface NagerHoliday {
  date: string
  localName: string
  name: string
  countryCode: string
  fixed: boolean
  global: boolean
  counties: string[] | null
  launchYear: number | null
  types: string[]
}

interface NagerCountry {
  countryCode: string
  name: string
}

export class APIAdapter {
  static adaptCalendarificHolidays(response: CalendarificResponse, countryCode: string): Holiday[] {
    if (response.meta.code !== 200 || !response.response?.holidays) {
      return []
    }

    return response.response.holidays.map((holiday, index) => ({
      id: `cal_${holiday.urlid || index}`,
      name: holiday.name,
      date: holiday.date.iso,
      country: holiday.country.name,
      countryCode: holiday.country.id.toUpperCase(),
      type: this.mapCalendarificType(holiday.primary_type),
      description: holiday.description,
      localName: holiday.name,
      global: holiday.type.includes("National holiday"),
    }))
  }

  static adaptCalendarificCountries(response: CalendarificCountriesResponse): Country[] {
    if (response.meta.code !== 200 || !response.response?.countries) {
      return []
    }

    return response.response.countries.map((country) => ({
      code: country.iso_3166,
      name: country.country_name,
      flag: this.getCountryFlag(country.iso_3166),
    }))
  }

  static adaptAbstractHolidays(holidays: AbstractHoliday[], countryCode: string): Holiday[] {
    return holidays.map((holiday, index) => ({
      id: `abs_${countryCode}_${holiday.date}_${index}`,
      name: holiday.name,
      date: holiday.date,
      country: holiday.country,
      countryCode: countryCode.toUpperCase(),
      type: this.mapAbstractType(holiday.type),
      description: holiday.description,
      localName: holiday.name_local || holiday.name,
      global: holiday.type === "National",
    }))
  }

  static adaptNagerHolidays(holidays: NagerHoliday[], countryCode: string): Holiday[] {
    return holidays.map((holiday, index) => ({
      id: `nager_${holiday.countryCode}_${holiday.date}_${index}`,
      name: holiday.name,
      date: holiday.date,
      country: this.getCountryName(holiday.countryCode),
      countryCode: holiday.countryCode,
      type: this.mapNagerType(holiday.types),
      description: `${holiday.name} is a ${holiday.global ? "national" : "regional"} holiday in ${this.getCountryName(holiday.countryCode)}.`,
      localName: holiday.localName,
      global: holiday.global,
    }))
  }

  static adaptNagerCountries(countries: NagerCountry[]): Country[] {
    return countries.map((country) => ({
      code: country.countryCode,
      name: country.name,
      flag: this.getCountryFlag(country.countryCode),
    }))
  }

  private static mapCalendarificType(type: string): Holiday["type"] {
    const typeMap: Record<string, Holiday["type"]> = {
      "National holiday": "public",
      "Public holiday": "public",
      "Religious holiday": "religious",
      Observance: "observance",
      Season: "observance",
      "Local holiday": "public",
    }
    return typeMap[type] || "observance"
  }

  private static mapAbstractType(type: string): Holiday["type"] {
    const typeMap: Record<string, Holiday["type"]> = {
      National: "national",
      Public: "public",
      Religious: "religious",
      Observance: "observance",
    }
    return typeMap[type] || "observance"
  }

  private static mapNagerType(types: string[]): Holiday["type"] {
    if (types.includes("Public")) return "public"
    if (types.includes("National")) return "national"
    if (types.includes("Religious")) return "religious"
    return "observance"
  }

  private static getCountryFlag(countryCode: string): string {
    // Simple flag emoji mapping - in production, use a comprehensive library
    const flagMap: Record<string, string> = {
      US: "🇺🇸",
      GB: "🇬🇧",
      CA: "🇨🇦",
      AU: "🇦🇺",
      DE: "🇩🇪",
      FR: "🇫🇷",
      JP: "🇯🇵",
      IN: "🇮🇳",
      BR: "🇧🇷",
      MX: "🇲🇽",
      IT: "🇮🇹",
      ES: "🇪🇸",
      CN: "🇨🇳",
      RU: "🇷🇺",
      KR: "🇰🇷",
      NL: "🇳🇱",
      SE: "🇸🇪",
      NO: "🇳🇴",
      DK: "🇩🇰",
      FI: "🇫🇮",
    }
    return flagMap[countryCode.toUpperCase()] || "🏳️"
  }

  private static getCountryName(countryCode: string): string {
    // Simple country name mapping
    const countryMap: Record<string, string> = {
      US: "United States",
      GB: "United Kingdom",
      CA: "Canada",
      AU: "Australia",
      DE: "Germany",
      FR: "France",
      JP: "Japan",
      IN: "India",
      BR: "Brazil",
      MX: "Mexico",
      IT: "Italy",
      ES: "Spain",
      CN: "China",
      RU: "Russia",
      KR: "South Korea",
    }
    return countryMap[countryCode.toUpperCase()] || countryCode
  }
}
