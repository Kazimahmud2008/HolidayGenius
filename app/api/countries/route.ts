import { NextResponse } from "next/server"
import { holidayAPI } from "@/lib/holidays-api"

export async function GET() {
  try {
    const response = await holidayAPI.getAvailableCountries()

    return NextResponse.json({
      success: true,
      data: response.data,
      provider: response.provider,
      cached: response.cached,
      count: response.data.length,
    })
  } catch (error) {
    console.error("Countries API Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch countries",
      },
      { status: 500 },
    )
  }
}
