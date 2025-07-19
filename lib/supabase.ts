import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/* -------------------------------------------------------------------------- */
/* 1 ▸ Read PUBLIC env-vars (must start with NEXT_PUBLIC_ to reach the client) */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/* -------------------------------------------------------------------------- */
/* 2 ▸ Validate that we have real URLs, not placeholder strings              */
function isValidUrl(url: string | undefined): boolean {
  if (!url) return false
  if (url.startsWith("your_") || url.includes("placeholder")) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidKey(key: string | undefined): boolean {
  if (!key) return false
  if (key.startsWith("your_") || key.includes("placeholder")) return false
  return key.length > 10 // Basic length check
}

/* -------------------------------------------------------------------------- */
/* 3 ▸ Create a harmless stub so the preview build doesn't blow up            */
function createStub(): SupabaseClient<any, "public", any> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handler = () => {
    throw new Error(
      [
        "[Supabase] Environment variables missing or invalid.",
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "in .env.local with valid values (they begin with NEXT_PUBLIC_ so they're exposed",
        "to the browser bundle).",
      ].join(" "),
    )
  }
  return new Proxy({} as any, { get: handler, apply: handler })
}

/* -------------------------------------------------------------------------- */
/* 4 ▸ Export the client - real or stub based on env validation              */
export const supabase =
  isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey) ? createClient(supabaseUrl!, supabaseAnonKey!) : createStub()

/* -------------------------------------------------------------------------- */
/* 5 ▸ Server-side admin client (service role key should never be on client)  */
export const supabaseAdmin =
  isValidUrl(supabaseUrl) && isValidKey(process.env.SUPABASE_SERVICE_ROLE_KEY)
    ? createClient(supabaseUrl!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : createStub()

// Types
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  country_code: string
  country_name: string
  timezone: string
  email_notifications: boolean
  reminder_preferences: {
    same_day: boolean
    day_before: boolean
  }
  created_at: string
  updated_at: string
}

export interface Holiday {
  id: string
  name: string
  local_name?: string
  date: string
  country_code: string
  country_name: string
  type: "public" | "religious" | "observance" | "national"
  description?: string
  is_global: boolean
  created_at: string
}

export interface UserHoliday {
  id: string
  user_id: string
  holiday_id: string
  is_favorite: boolean
  reminder_enabled: boolean
  custom_reminder_time: string
  created_at: string
  holiday?: Holiday
}

export interface EmailReminder {
  id: string
  user_id: string
  holiday_id: string
  reminder_type: "same_day" | "day_before" | "custom"
  scheduled_for: string
  sent_at?: string
  status: "pending" | "sent" | "failed"
  error_message?: string
  created_at: string
}

export default supabase
