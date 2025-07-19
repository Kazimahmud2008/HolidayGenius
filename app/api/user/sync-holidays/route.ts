import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId, countryCode } = await request.json()

    if (!userId || !countryCode) {
      return NextResponse.json({ error: "Missing userId or countryCode" }, { status: 400 })
    }

    // Fetch holidays from Calendarific API
    const currentYear = new Date().getFullYear()
    const calendarificResponse = await fetch(
      `https://calendarific.com/api/v2/holidays?api_key=${process.env.CALENDARIFIC_API_KEY}&country=${countryCode}&year=${currentYear}`,
    )

    if (!calendarificResponse.ok) {
      throw new Error("Failed to fetch holidays from Calendarific")
    }

    const calendarificData = await calendarificResponse.json()

    if (calendarificData.meta.code !== 200) {
      throw new Error("Calendarific API error")
    }

    const holidays = calendarificData.response.holidays

    // Store holidays in database
    for (const holiday of holidays) {
      // First, insert or update the holiday
      const { data: holidayData, error: holidayError } = await supabaseAdmin
        .from("holidays")
        .upsert(
          {
            name: holiday.name,
            local_name: holiday.name,
            date: holiday.date.iso,
            country_code: countryCode,
            country_name: holiday.country.name,
            type: mapHolidayType(holiday.primary_type),
            description: holiday.description,
            is_global: holiday.type.includes("National holiday"),
          },
          {
            onConflict: "name,date,country_code",
            ignoreDuplicates: false,
          },
        )
        .select()
        .single()

      if (holidayError && holidayError.code !== "23505") {
        console.error("Error inserting holiday:", holidayError)
        continue
      }

      // Get the holiday ID (either from insert or existing)
      let holidayId = holidayData?.id

      if (!holidayId) {
        // If upsert didn't return data, fetch the existing holiday
        const { data: existingHoliday } = await supabaseAdmin
          .from("holidays")
          .select("id")
          .eq("name", holiday.name)
          .eq("date", holiday.date.iso)
          .eq("country_code", countryCode)
          .single()

        holidayId = existingHoliday?.id
      }

      if (holidayId) {
        // Create user-holiday relationship
        const { error: userHolidayError } = await supabaseAdmin.from("user_holidays").upsert(
          {
            user_id: userId,
            holiday_id: holidayId,
            reminder_enabled: true,
          },
          {
            onConflict: "user_id,holiday_id",
            ignoreDuplicates: true,
          },
        )

        if (userHolidayError && userHolidayError.code !== "23505") {
          console.error("Error creating user-holiday relationship:", userHolidayError)
        }

        // Schedule email reminders
        await scheduleEmailReminders(userId, holidayId, holiday.date.iso)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${holidays.length} holidays`,
    })
  } catch (error: any) {
    console.error("Error syncing holidays:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

function mapHolidayType(primaryType: string): "public" | "religious" | "observance" | "national" {
  const typeMap: Record<string, "public" | "religious" | "observance" | "national"> = {
    "National holiday": "national",
    "Public holiday": "public",
    "Religious holiday": "religious",
    Observance: "observance",
    Season: "observance",
    "Local holiday": "public",
  }
  return typeMap[primaryType] || "observance"
}

async function scheduleEmailReminders(userId: string, holidayId: string, holidayDate: string) {
  try {
    const holiday = new Date(holidayDate)
    const dayBefore = new Date(holiday)
    dayBefore.setDate(dayBefore.getDate() - 1)

    // Schedule same-day reminder
    await supabaseAdmin.from("email_reminders").upsert(
      {
        user_id: userId,
        holiday_id: holidayId,
        reminder_type: "same_day",
        scheduled_for: holiday.toISOString(),
      },
      {
        onConflict: "user_id,holiday_id,reminder_type",
        ignoreDuplicates: true,
      },
    )

    // Schedule day-before reminder
    await supabaseAdmin.from("email_reminders").upsert(
      {
        user_id: userId,
        holiday_id: holidayId,
        reminder_type: "day_before",
        scheduled_for: dayBefore.toISOString(),
      },
      {
        onConflict: "user_id,holiday_id,reminder_type",
        ignoreDuplicates: true,
      },
    )
  } catch (error) {
    console.error("Error scheduling email reminders:", error)
  }
}
