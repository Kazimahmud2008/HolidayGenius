"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DateConverter() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const convertDate = (date: string) => {
    const d = new Date(date)

    return {
      gregorian: d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      iso: d.toISOString().split("T")[0],
      unix: Math.floor(d.getTime() / 1000),
      dayOfYear: Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)),
      weekNumber: Math.ceil(
        ((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000 +
          new Date(d.getFullYear(), 0, 1).getDay() +
          1) /
          7,
      ),
    }
  }

  const converted = convertDate(selectedDate)

  return (
    <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border-green-200 dark:border-green-800">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2 text-lg font-bold text-gray-900 dark:text-gray-100">
          <RefreshCw className="h-5 w-5 text-green-600" />
          <span>Date Converter</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="date-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Date
          </Label>
          <Input
            id="date-input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 rounded-lg border-green-200 dark:border-green-800"
          />
        </div>

        <div className="space-y-3">
          <div className="text-sm">
            <div className="font-medium text-gray-700 dark:text-gray-300">Gregorian</div>
            <div className="text-gray-600 dark:text-gray-400">{converted.gregorian}</div>
          </div>

          <div className="text-sm">
            <div className="font-medium text-gray-700 dark:text-gray-300">ISO Format</div>
            <div className="text-gray-600 dark:text-gray-400 font-mono">{converted.iso}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300">Day of Year</div>
              <div className="text-gray-600 dark:text-gray-400">{converted.dayOfYear}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700 dark:text-gray-300">Week #</div>
              <div className="text-gray-600 dark:text-gray-400">{converted.weekNumber}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
