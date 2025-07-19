import { Calendar, MapPin, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Holiday } from "@/lib/holidays"

interface HolidayCardProps {
  holiday: Holiday
}

export function HolidayCard({ holiday }: HolidayCardProps) {
  const date = new Date(holiday.date)
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const typeColors = {
    public: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    religious: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    observance: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  }

  return (
    <Card className="group hover:shadow-lg hover:shadow-purple-100 dark:hover:shadow-purple-900/20 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
              {holiday.name}
            </h3>
            <Badge className={typeColors[holiday.type]}>
              <Tag className="h-3 w-3 mr-1" />
              {holiday.type}
            </Badge>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{holiday.country}</span>
          </div>

          {holiday.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{holiday.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
