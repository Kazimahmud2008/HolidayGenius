"use client"

import { useState, useEffect } from "react"
import { Timer, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getNextGlobalHoliday } from "@/lib/holidays-api"
import type { Holiday } from "@/lib/holidays-api"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer() {
  const [nextHoliday, setNextHoliday] = useState<Holiday | null>(null)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const holiday = getNextGlobalHoliday()
    setNextHoliday(holiday)
  }, [])

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

  if (!nextHoliday) return null

  return (
    <Card className="bg-gradient-to-br from-green-50 via-mint-50 to-yellow-50 dark:from-green-950 dark:via-mint-950 dark:to-yellow-950 border-green-200 dark:border-green-800 rounded-2xl overflow-hidden">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          <Timer className="h-6 w-6 text-green-600" />
          <span>Next Global Holiday</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-mint-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            {nextHoliday.name}
          </h3>
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(nextHoliday.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-400 via-mint-400 to-yellow-400 flex items-center justify-center text-white font-bold text-xl mb-2">
                {item.value.toString().padStart(2, "0")}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
