"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Sparkles, Heart, Clock, Gift, Star, Sun, Crown, TreePine, Cake, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CountdownToNextHoliday } from "@/components/countdown-to-next-holiday"
import { DateConverter } from "@/components/date-converter"
import { GoogleCalendarButton } from "@/components/google-calendar-button"
import { holidayAPI, type Holiday, type Country } from "@/lib/holidays-api"

interface CountryHolidaysViewProps {
  country: Country
}

const holidayIcons = {
  "new year": Gift,
  christmas: TreePine,
  easter: Sun,
  independence: Flag,
  national: Crown,
  birthday: Cake,
  labor: Star,
  memorial: Heart,
  thanksgiving: Heart,
  valentine: Heart,
  default: Calendar,
}

const getHolidayIcon = (holidayName: string) => {
  const name = holidayName.toLowerCase()
  for (const [key, icon] of Object.entries(holidayIcons)) {
    if (name.includes(key)) {
      return icon
    }
  }
  return holidayIcons.default
}

const getHolidayDescription = (holiday: Holiday): string => {
  if (holiday.description && holiday.description.length > 10) {
    return holiday.description
  }

  // Generate descriptions based on holiday name and type
  const name = holiday.name.toLowerCase()

  if (name.includes("new year")) {
    return "Celebrate the beginning of a new year with festivities, resolutions, and fresh starts. A time for reflection and new beginnings."
  }
  if (name.includes("christmas")) {
    return "A Christian holiday celebrating the birth of Jesus Christ, marked by gift-giving, family gatherings, and festive traditions."
  }
  if (name.includes("easter")) {
    return "Christian celebration of the resurrection of Jesus Christ, often marked by egg hunts, family meals, and spring festivities."
  }
  if (name.includes("independence")) {
    return "Commemorating the nation's independence and freedom, celebrated with parades, fireworks, and patriotic displays."
  }
  if (name.includes("labor") || name.includes("worker")) {
    return "Honoring the contributions of workers and the labor movement, often marked by parades and workers' rights advocacy."
  }
  if (name.includes("memorial")) {
    return "A day to remember and honor those who have served and sacrificed for their country, marked by ceremonies and remembrance."
  }
  if (name.includes("thanksgiving")) {
    return "A time for gratitude and family gatherings, celebrating harvest and blessings with traditional meals and reflection."
  }

  // Default descriptions based on type
  switch (holiday.type) {
    case "public":
      return `A public holiday in ${holiday.country}, providing a day off for citizens to celebrate and observe this important occasion.`
    case "religious":
      return `A religious observance celebrated by communities, marked by special prayers, ceremonies, and cultural traditions.`
    case "national":
      return `A national celebration honoring the country's heritage, culture, and significant historical events or figures.`
    default:
      return `An important observance in ${holiday.country}, celebrated with various cultural traditions and community activities.`
  }
}

export function CountryHolidaysView({ country }: CountryHolidaysViewProps) {
  const router = useRouter()
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    loadHolidays()
  }, [country.code, selectedYear])

  const loadHolidays = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await holidayAPI.getHolidaysByCountry(country.code, { year: selectedYear })
      setHolidays(response.data)
    } catch (error) {
      console.error("Failed to load holidays:", error)
      setError("Failed to load holidays for this country. This might be due to limited data availability.")
    } finally {
      setLoading(false)
    }
  }

  const typeColors = {
    public: "from-green-500 to-emerald-500",
    religious: "from-blue-500 to-indigo-500",
    observance: "from-purple-500 to-violet-500",
    national: "from-red-500 to-rose-500",
  }

  const typeBadgeColors = {
    public: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    religious: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    observance: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    national: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => router.back()} className="mb-8 hover:bg-white/20 backdrop-blur-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>

            {/* Country Header */}
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <span className="text-6xl">{country.flag}</span>
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold font-poppins bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {country.name}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">Public Holidays {selectedYear}</p>
                </div>
              </div>

              {/* Year Selector */}
              <div className="flex justify-center space-x-2">
                {[2024, 2025, 2026].map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear(year)}
                    className={
                      selectedYear === year
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900 bg-white/80 backdrop-blur-sm"
                    }
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Holidays Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading holidays...</p>
              </div>
            ) : error ? (
              <Card className="bg-white/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Limited Holiday Data</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">{error}</p>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Try these alternatives:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push("/")}>
                        Browse Other Countries
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedYear(2024)}>
                        Try Different Year
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : holidays.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Holidays Found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No holiday data available for {country.name} in {selectedYear}.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {holidays.map((holiday, index) => {
                  const HolidayIcon = getHolidayIcon(holiday.name)
                  const description = getHolidayDescription(holiday)

                  return (
                    <Card
                      key={`${holiday.id}-${index}`}
                      className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                      {/* Gradient Border */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${typeColors[holiday.type]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      >
                        <div className="absolute inset-[1px] bg-white dark:bg-gray-900 rounded-lg"></div>
                      </div>

                      <CardContent className="relative p-6 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${typeColors[holiday.type]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                          >
                            <HolidayIcon className="h-6 w-6 text-white" />
                          </div>
                          <Badge className={typeBadgeColors[holiday.type]}>{holiday.type}</Badge>
                        </div>

                        {/* Holiday Name */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                            {holiday.name}
                          </h3>
                          {holiday.localName && holiday.localName !== holiday.name && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">"{holiday.localName}"</p>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                          {description}
                        </p>

                        {/* Date */}
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(holiday.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Additional Info */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex items-center space-x-2">
                            {holiday.global && (
                              <Badge variant="outline" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Global
                              </Badge>
                            )}
                            {holiday.fixed === false && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Variable
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Micro Tools Section */}
      {holidays.length > 0 && (
        <section className="py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-poppins bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Useful Tools
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Additional tools to help you with dates and calendar planning
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CountdownToNextHoliday holidays={holidays} />
                <DateConverter />
                <GoogleCalendarButton holidays={holidays} country={country} />
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
