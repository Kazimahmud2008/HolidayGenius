export interface Holiday {
  id: string
  name: string
  date: string
  country: string
  countryCode: string
  type: "public" | "religious" | "observance"
  description?: string
}

export const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
]

// Mock holiday data - in production, this would come from an API
export const mockHolidays: Holiday[] = [
  // January 2024
  { id: "1", name: "New Year's Day", date: "2024-01-01", country: "United States", countryCode: "US", type: "public" },
  { id: "2", name: "New Year's Day", date: "2024-01-01", country: "United Kingdom", countryCode: "GB", type: "public" },
  { id: "3", name: "New Year's Day", date: "2024-01-01", country: "Canada", countryCode: "CA", type: "public" },
  { id: "4", name: "Australia Day", date: "2024-01-26", country: "Australia", countryCode: "AU", type: "public" },

  // February 2024
  { id: "5", name: "Presidents' Day", date: "2024-02-19", country: "United States", countryCode: "US", type: "public" },
  { id: "6", name: "Family Day", date: "2024-02-19", country: "Canada", countryCode: "CA", type: "public" },

  // March 2024
  { id: "7", name: "Good Friday", date: "2024-03-29", country: "United Kingdom", countryCode: "GB", type: "public" },
  { id: "8", name: "Good Friday", date: "2024-03-29", country: "Australia", countryCode: "AU", type: "public" },

  // April 2024
  { id: "9", name: "Easter Monday", date: "2024-04-01", country: "United Kingdom", countryCode: "GB", type: "public" },
  { id: "10", name: "Easter Monday", date: "2024-04-01", country: "Australia", countryCode: "AU", type: "public" },

  // May 2024
  { id: "11", name: "Memorial Day", date: "2024-05-27", country: "United States", countryCode: "US", type: "public" },
  { id: "12", name: "Victoria Day", date: "2024-05-20", country: "Canada", countryCode: "CA", type: "public" },

  // June 2024
  { id: "13", name: "Juneteenth", date: "2024-06-19", country: "United States", countryCode: "US", type: "public" },

  // July 2024
  {
    id: "14",
    name: "Independence Day",
    date: "2024-07-04",
    country: "United States",
    countryCode: "US",
    type: "public",
  },
  { id: "15", name: "Canada Day", date: "2024-07-01", country: "Canada", countryCode: "CA", type: "public" },

  // December 2024
  { id: "16", name: "Christmas Day", date: "2024-12-25", country: "United States", countryCode: "US", type: "public" },
  { id: "17", name: "Christmas Day", date: "2024-12-25", country: "United Kingdom", countryCode: "GB", type: "public" },
  { id: "18", name: "Christmas Day", date: "2024-12-25", country: "Canada", countryCode: "CA", type: "public" },
  { id: "19", name: "Christmas Day", date: "2024-12-25", country: "Australia", countryCode: "AU", type: "public" },
  { id: "20", name: "Boxing Day", date: "2024-12-26", country: "United Kingdom", countryCode: "GB", type: "public" },
  { id: "21", name: "Boxing Day", date: "2024-12-26", country: "Canada", countryCode: "CA", type: "public" },
  { id: "22", name: "Boxing Day", date: "2024-12-26", country: "Australia", countryCode: "AU", type: "public" },
]

export function getHolidaysForMonth(year: number, month: number, countryCode?: string): Holiday[] {
  return mockHolidays.filter((holiday) => {
    const holidayDate = new Date(holiday.date)
    const matchesDate = holidayDate.getFullYear() === year && holidayDate.getMonth() === month - 1
    const matchesCountry = !countryCode || holiday.countryCode === countryCode
    return matchesDate && matchesCountry
  })
}

export function searchHolidays(query: string, countryCode?: string): Holiday[] {
  const filtered = mockHolidays.filter((holiday) => {
    const matchesQuery =
      holiday.name.toLowerCase().includes(query.toLowerCase()) ||
      holiday.country.toLowerCase().includes(query.toLowerCase())
    const matchesCountry = !countryCode || holiday.countryCode === countryCode
    return matchesQuery && matchesCountry
  })
  return filtered
}
