"use client"

import { useState, useEffect } from "react"
import { Timer, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Holiday } from "@/lib/holidays-api"

interface CountdownToNextHolidayProps {
  holidays: Holiday[]
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownToNextHoliday({ holidays }: CountdownToNextHolidayProps) {
  const [nextHoliday, setNextHoliday] = useState<Holiday | null>(null)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    // Find next upcoming holiday
    const now = new Date()
    const upcomingHolidays = holidays
      .filter((holiday) => new Date(holiday.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    if (upcomingHolidays.length > 0) {
      setNextHoliday(upcomingHolidays[0])
    }
  }, [holidays])

  useEffect(() => {
    if (!nextHoliday) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const holidayTime = new Date(nextHoliday.date).getTime()
      const difference = holidayTime - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [nextHoliday])

  if (!nextHoliday) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Timer className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">No upcoming holidays found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2 text-lg font-bold text-gray-900 dark:text-gray-100">
          <Timer className="h-5 w-5 text-blue-600" />
          <span>Next Holiday</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {nextHoliday.name}
          </h3>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(nextHoliday.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Min", value: timeLeft.minutes },
            { label: "Sec", value: timeLeft.seconds },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm mb-1">
                {item.value.toString().padStart(2, "0")}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
