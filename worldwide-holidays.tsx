"use client"

import { useState, useEffect } from "react"
import { Globe, Calendar, MapPin, Clock, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getNextPublicHolidaysWorldwide, type Holiday } from "@/lib/holidays-api"

export function WorldwideHolidays() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorldwideHolidays()
  }, [])

  const loadWorldwideHolidays = async () => {
    try {
      setLoading(true)
      const worldwideHolidays = await getNextPublicHolidaysWorldwide()
      setHolidays(worldwideHolidays.slice(0, 7)) // Show next 7 days
    } catch (error) {
      console.error("Failed to load worldwide holidays:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysUntil = (date: string) => {
    const today = new Date()
    const holidayDate = new Date(date)
    const diffTime = holidayDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-green-50 via-mint-50 to-yellow-50 dark:from-green-950 dark:via-mint-950 dark:to-yellow-950 border-green-200 dark:border-green-800 rounded-2xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading worldwide holidays...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 via-mint-50 to-yellow-50 dark:from-green-950 dark:via-mint-950 dark:to-yellow-950 border-green-200 dark:border-green-800 rounded-2xl overflow-hidden">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          <Globe className="h-6 w-6 text-green-600" />
          <span>Next Public Holidays Worldwide</span>
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400">Upcoming holidays in the next 7 days</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {holidays.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No upcoming holidays in the next 7 days</p>
          </div>
        ) : (
          <div className="space-y-3">
            {holidays.map((holiday, index) => {
              const daysUntil = getDaysUntil(holiday.date)
              return (
                <div
                  key={`${holiday.id}-${index}`}
                  className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{holiday.name}</h3>
                      {holiday.global && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs">
                          Global
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(holiday.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{holiday.country}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
