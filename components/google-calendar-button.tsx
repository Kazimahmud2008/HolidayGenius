"use client"

import { Calendar, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Holiday, Country } from "@/lib/holidays-api"

interface GoogleCalendarButtonProps {
  holidays: Holiday[]
  country: Country
}

export function GoogleCalendarButton({ holidays, country }: GoogleCalendarButtonProps) {
  const addToGoogleCalendar = (holiday: Holiday) => {
    const startDate = new Date(holiday.date)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 1)

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `${holiday.name} (${country.name})`,
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: holiday.description || `${holiday.name} is a ${holiday.type} holiday in ${country.name}.`,
      location: country.name,
      trp: "false",
    })

    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank")
  }

  const addAllToGoogleCalendar = () => {
    // For multiple events, we'll create a calendar subscription URL
    // In a real implementation, you'd generate an .ics file
    const upcomingHolidays = holidays.filter((holiday) => new Date(holiday.date) >= new Date()).slice(0, 5) // Limit to next 5 holidays

    if (upcomingHolidays.length > 0) {
      addToGoogleCalendar(upcomingHolidays[0])
    }
  }

  const upcomingHolidays = holidays.filter((holiday) => new Date(holiday.date) >= new Date()).slice(0, 3)

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2 text-lg font-bold text-gray-900 dark:text-gray-100">
          <Calendar className="h-5 w-5 text-orange-600" />
          <span>Add to Calendar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingHolidays.length > 0 ? (
          <>
            <div className="space-y-2">
              {upcomingHolidays.map((holiday, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => addToGoogleCalendar(holiday)}
                  className="w-full justify-between text-left bg-white/80 hover:bg-orange-50 border-orange-200 dark:border-orange-800"
                >
                  <span className="truncate">{holiday.name}</span>
                  <ExternalLink className="h-3 w-3 ml-2 flex-shrink-0" />
                </Button>
              ))}
            </div>

            <Button
              onClick={addAllToGoogleCalendar}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Add Next Holiday
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">No upcoming holidays to add</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
