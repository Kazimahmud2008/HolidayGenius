import { Calendar, MapPin, Tag, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Holiday } from "@/lib/holidays-api"

interface HolidayGridProps {
  holidays: Holiday[]
  title?: string
}

export function HolidayGrid({ holidays, title = "Holidays" }: HolidayGridProps) {
  const typeColors = {
    public: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    religious: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    observance: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    national: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  }

  if (holidays.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-mint-100 dark:from-green-900 dark:to-mint-900 flex items-center justify-center">
          <Calendar className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No holidays found</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Try selecting a different country or adjusting your search terms to discover holidays.
        </p>
      </div>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins bg-gradient-to-r from-green-600 via-mint-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Showing {holidays.length} holiday{holidays.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {holidays.map((holiday) => (
            <Card
              key={holiday.id}
              className="group hover:shadow-xl hover:shadow-green-100 dark:hover:shadow-green-900/20 transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 border-green-200 dark:border-green-800 rounded-2xl overflow-hidden"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 mb-2">
                      {holiday.name}
                    </h3>
                    {holiday.localName && holiday.localName !== holiday.name && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">"{holiday.localName}"</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900 group/heart"
                  >
                    <Heart className="h-4 w-4 text-gray-400 group-hover/heart:text-red-500 transition-colors duration-300" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={typeColors[holiday.type]}>
                    <Tag className="h-3 w-3 mr-1" />
                    {holiday.type}
                  </Badge>
                  {holiday.global && (
                    <Badge
                      variant="outline"
                      className="border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300"
                    >
                      Global
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
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

                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{holiday.country}</span>
                  </div>
                </div>

                {holiday.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{holiday.description}</p>
                )}

                <div className="pt-2 border-t border-green-100 dark:border-green-800">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full rounded-xl hover:bg-green-100 dark:hover:bg-green-900 text-green-700 dark:text-green-300"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
