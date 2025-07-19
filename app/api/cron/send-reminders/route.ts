import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayEnd = new Date(todayStart)
    todayEnd.setDate(todayEnd.getDate() + 1)

    // Get pending reminders for today
    const { data: reminders, error: remindersError } = await supabaseAdmin
      .from("email_reminders")
      .select(`
        *,
        user_profiles!inner(*),
        holidays!inner(*)
      `)
      .eq("status", "pending")
      .gte("scheduled_for", todayStart.toISOString())
      .lt("scheduled_for", todayEnd.toISOString())

    if (remindersError) {
      throw remindersError
    }

    let sentCount = 0
    let failedCount = 0

    for (const reminder of reminders || []) {
      try {
        // Check if user has email notifications enabled
        if (!reminder.user_profiles.email_notifications) {
          continue
        }

        // Check reminder preferences
        const preferences = reminder.user_profiles.reminder_preferences
        if (reminder.reminder_type === "same_day" && !preferences.same_day) {
          continue
        }
        if (reminder.reminder_type === "day_before" && !preferences.day_before) {
          continue
        }

        // Send email
        await sendHolidayReminderEmail(reminder)

        // Mark as sent
        await supabaseAdmin
          .from("email_reminders")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", reminder.id)

        sentCount++
      } catch (error: any) {
        console.error(`Failed to send reminder ${reminder.id}:`, error)

        // Mark as failed
        await supabaseAdmin
          .from("email_reminders")
          .update({
            status: "failed",
            error_message: error.message,
          })
          .eq("id", reminder.id)

        failedCount++
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      failed: failedCount,
      total: reminders?.length || 0,
    })
  } catch (error: any) {
    console.error("Error in cron job:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

async function sendHolidayReminderEmail(reminder: any) {
  const { user_profiles: user, holidays: holiday } = reminder

  const isToday = reminder.reminder_type === "same_day"
  const subject = isToday ? `🎉 Today is ${holiday.name}!` : `🗓️ Tomorrow is ${holiday.name}`

  const holidayDate = new Date(holiday.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #10b981, #22c55e, #eab308); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 40px 20px; }
        .holiday-card { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 12px; padding: 24px; margin: 20px 0; border-left: 4px solid #10b981; }
        .holiday-name { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 8px; }
        .holiday-date { font-size: 16px; color: #6b7280; margin-bottom: 12px; }
        .holiday-description { font-size: 14px; color: #4b5563; line-height: 1.6; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        .button { display: inline-block; background: linear-gradient(135deg, #10b981, #22c55e); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌍 GlobeHoliday.ai</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">
            ${isToday ? "Holiday Reminder" : "Upcoming Holiday"}
          </p>
        </div>
        
        <div class="content">
          <h2 style="color: #1f2937; margin-bottom: 20px;">
            Hello ${user.full_name || "there"}! 👋
          </h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            ${
              isToday
                ? `Today is <strong>${holiday.name}</strong> in ${user.country_name}! 🎉`
                : `Just a friendly reminder that <strong>${holiday.name}</strong> is tomorrow in ${user.country_name}! 📅`
            }
          </p>
          
          <div class="holiday-card">
            <div class="holiday-name">${holiday.name}</div>
            <div class="holiday-date">📅 ${holidayDate}</div>
            <div class="holiday-description">
              ${holiday.description || `${holiday.name} is a ${holiday.type} holiday celebrated in ${user.country_name}.`}
            </div>
          </div>
          
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            ${
              isToday
                ? "We hope you have a wonderful celebration! 🎊"
                : "Don't forget to plan ahead for tomorrow's celebration! 🎈"
            }
          </p>
          
          <a href="${process.env.NEXTAUTH_URL}/country/${user.country_code.toLowerCase()}" class="button">
            View All ${user.country_name} Holidays
          </a>
        </div>
        
        <div class="footer">
          <p>You're receiving this because you signed up for holiday reminders on GlobeHoliday.ai</p>
          <p>
            <a href="${process.env.NEXTAUTH_URL}" style="color: #10b981;">Manage your preferences</a> | 
            <a href="${process.env.NEXTAUTH_URL}" style="color: #6b7280;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  await resend.emails.send({
    from: "GlobeHoliday.ai <noreply@globeholiday.ai>",
    to: [user.email],
    subject,
    html: emailHtml,
  })
}
