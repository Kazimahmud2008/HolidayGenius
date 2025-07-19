"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Holiday } from "@/lib/holidays"
import { cn } from "@/lib/utils"

interface CalendarGridProps {
  year: number
  month: number
  holidays: Holiday[]
  onMonthChange: (year: number, month: number) => void
}

export function CalendarGrid({ year, month, holidays, onMonthChange }: CalendarGridProps) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const firstDayOfMonth = new Date(year, month - 1, 1)
  const lastDayOfMonth = new Date(year, month, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const previousMonth = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12)
    } else {
      onMonthChange(year, month - 1)
    }
  }

  const nextMonth = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1)
    } else {
      onMonthChange(year, month + 1)
    }
  }

  const getHolidaysForDate = (day: number) => {
    const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    return holidays.filter((holiday) => holiday.date === dateStr)
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 p-1">
          <div className="h-full rounded-lg bg-gray-50 dark:bg-gray-800/50"></div>
        </div>,
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayHolidays = getHolidaysForDate(day)
      const isToday = new Date().toDateString() === new Date(year, month - 1, day).toDateString()

      days.push(
        <div key={day} className="h-24 p-1">
          <div
            className={cn(
              "h-full rounded-lg p-2 transition-all duration-300 hover:shadow-md",
              isToday
                ? "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border-2 border-purple-300 dark:border-purple-600"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950",
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  isToday ? "text-purple-700 dark:text-purple-300" : "text-gray-700 dark:text-gray-300",
                )}
              >
                {day}
              </span>
              {dayHolidays.length > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-1 py-0 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                >
                  {dayHolidays.length}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              {dayHolidays.slice(0, 2).map((holiday, index) => (
                <div
                  key={holiday.id}
                  className="text-xs p-1 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white truncate"
                  title={holiday.name}
                >
                  {holiday.name}
                </div>
              ))}
              {dayHolidays.length > 2 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">+{dayHolidays.length - 2} more</div>
              )}
            </div>
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {monthNames[month - 1]} {year}
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousMonth}
              className="hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950 transition-all duration-300 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950 transition-all duration-300 bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
      </CardContent>
    </Card>
  )
}
