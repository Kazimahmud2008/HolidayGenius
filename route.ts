import { type NextRequest, NextResponse } from "next/server"
import { holidayAPI } from "@/lib/holidays-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get("country")
    const year = searchParams.get("year")
    const search = searchParams.get("search")

    if (search) {
      // Search holidays
      const response = await holidayAPI.searchHolidays(search, country || undefined)
      return NextResponse.json({
        success: true,
        data: response.data,
        provider: response.provider,
        cached: response.cached,
        count: response.data.length,
      })
    }

    if (!country) {
      return NextResponse.json({ success: false, error: "Country parameter is required" }, { status: 400 })
    }

    // Get holidays by country
    const response = await holidayAPI.getHolidaysByCountry(country, {
      year: year ? Number.parseInt(year) : undefined,
    })

    return NextResponse.json({
      success: true,
      data: response.data,
      provider: response.provider,
      cached: response.cached,
      count: response.data.length,
      rateLimit: response.rateLimit,
    })
  } catch (error) {
    console.error("API Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
