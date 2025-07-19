// Enhanced Nager.Date API integration
export interface NagerHoliday {
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

export interface NagerCountry {
  countryCode: string
  name: string
}

export interface NagerCountryInfo {
  commonName: string
  officialName: string
  countryCode: string
  region: string
  borders: NagerCountry[] | null
}

export interface NagerLongWeekend {
  startDate: string
  endDate: string
  dayCount: number
  needBridgeDay: boolean
}

class NagerDateAPI {
  private baseUrl = "https://date.nager.at/api/v3"

  // Get public holidays for a specific country and year
  async getPublicHolidays(countryCode: string, year: number): Promise<NagerHoliday[]> {
    const response = await fetch(`${this.baseUrl}/PublicHolidays/${year}/${countryCode}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch holidays: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get available countries
  async getAvailableCountries(): Promise<NagerCountry[]> {
    const response = await fetch(`${this.baseUrl}/AvailableCountries`)

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get country information
  async getCountryInfo(countryCode: string): Promise<NagerCountryInfo> {
    const response = await fetch(`${this.baseUrl}/CountryInfo/${countryCode}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch country info: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Check if a specific date is a public holiday
  async isPublicHoliday(date: string, countryCode: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/IsTodayPublicHoliday/${countryCode}?date=${date}`)
    return response.status === 200
  }

  // Get next public holidays worldwide (next 7 days)
  async getNextPublicHolidaysWorldwide(): Promise<NagerHoliday[]> {
    const response = await fetch(`${this.baseUrl}/NextPublicHolidaysWorldwide`)

    if (!response.ok) {
      throw new Error(`Failed to fetch worldwide holidays: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get next public holidays for a specific country
  async getNextPublicHolidays(countryCode: string): Promise<NagerHoliday[]> {
    const response = await fetch(`${this.baseUrl}/NextPublicHolidays/${countryCode}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch next holidays: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get long weekends for a specific country and year
  async getLongWeekends(countryCode: string, year: number): Promise<NagerLongWeekend[]> {
    const response = await fetch(`${this.baseUrl}/LongWeekend/${year}/${countryCode}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch long weekends: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get public holidays for today worldwide
  async getTodayPublicHolidaysWorldwide(): Promise<NagerHoliday[]> {
    const today = new Date().toISOString().split("T")[0]
    const response = await fetch(`${this.baseUrl}/PublicHolidays/${today}`)

    if (!response.ok) {
      return [] // No holidays today is not an error
    }

    return response.json()
  }
}

export const nagerAPI = new NagerDateAPI()
