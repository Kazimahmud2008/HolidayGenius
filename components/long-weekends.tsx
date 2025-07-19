"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Coffee, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CountrySelector } from "./country-selector"
import { getLongWeekends, type LongWeekend } from "@/lib/holidays-api"

export function LongWeekends() {
  const [longWeekends, setLongWeekends] = useState<LongWeekend[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("US")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    if (selectedCountry) {
      loadLongWeekends()
    }
  }, [selectedCountry, selectedYear])

  const loadLongWeekends = async () => {
    try {
      setLoading(true)
      const weekends = await getLongWeekends(selectedCountry, selectedYear)
      setLongWeekends(weekends)
    } catch (error) {
      console.error("Failed to load long weekends:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const startFormatted = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })

    const endFormatted = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })

    return `${startFormatted} - ${endFormatted}`
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 via-mint-50 to-yellow-50 dark:from-green-950 dark:via-mint-950 dark:to-yellow-950 border-green-200 dark:border-green-800 rounded-2xl overflow-hidden">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          <Coffee className="h-6 w-6 text-green-600" />
          <span>Long Weekends</span>
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400">Perfect opportunities for extended breaks</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <CountrySelector value={selectedCountry} onSelect={setSelectedCountry} />
          </div>
          <div className="flex gap-2">
            {[2024, 2025, 2026].map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedYear(year)}
                className={
                  selectedYear === year
                    ? "bg-gradient-to-r from-green-500 to-mint-500 text-white"
                    : "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900 bg-transparent"
                }
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading long weekends...</p>
          </div>
        ) : longWeekends.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No long weekends found for this selection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {longWeekends.map((weekend, index) => (
              <div
                key={index}
                className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatDateRange(weekend.startDate, weekend.endDate)}
                    </span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {weekend.dayCount} days
                  </Badge>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="h-3 w-3" />
                  <span>{weekend.country}</span>
                </div>

                {weekend.needBridgeDay && (
                  <div className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                    💡 Bridge day needed for maximum effect
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
