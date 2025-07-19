"use client"

import { useState, useEffect } from "react"
import { User, Settings, Bell, Calendar, Heart, LogOut, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { supabase, type UserProfile, type UserHoliday } from "@/lib/supabase"
import { toast } from "sonner"

interface UserDashboardProps {
  user: any
  onClose: () => void
}

export function UserDashboard({ user, onClose }: UserDashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userHolidays, setUserHolidays] = useState<UserHoliday[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [user])

  const loadUserData = async () => {
    try {
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError
      }

      if (profileData) {
        setProfile(profileData)
      }

      // Load user holidays
      const { data: holidaysData, error: holidaysError } = await supabase
        .from("user_holidays")
        .select(`
          *,
          holiday:holidays(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (holidaysError) throw holidaysError

      setUserHolidays(holidaysData || [])
    } catch (error: any) {
      console.error("Error loading user data:", error)
      toast.error("Failed to load user data")
    } finally {
      setLoading(false)
    }
  }

  const updateNotificationSettings = async (field: string, value: boolean) => {
    try {
      const updates: any = {}

      if (field === "email_notifications") {
        updates.email_notifications = value
      } else {
        updates.reminder_preferences = {
          ...profile?.reminder_preferences,
          [field]: value,
        }
      }

      const { error } = await supabase.from("user_profiles").update(updates).eq("id", user.id)

      if (error) throw error

      setProfile((prev) => (prev ? { ...prev, ...updates } : null))
      toast.success("Settings updated successfully")
    } catch (error: any) {
      toast.error("Failed to update settings")
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    onClose()
    toast.success("Signed out successfully")
  }

  const upcomingHolidays = userHolidays.filter((uh) => uh.holiday && new Date(uh.holiday.date) > new Date()).slice(0, 5)

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <Card className="w-full max-w-2xl mx-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-mint-500 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-mint-600 bg-clip-text text-transparent">
                Welcome, {profile?.full_name || user.email}!
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                {profile?.country_name} • {userHolidays.length} holidays tracked
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="w-8 h-8 p-0">
            ×
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Upcoming Holidays */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Upcoming Holidays
            </h3>
            {upcomingHolidays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingHolidays.map((userHoliday) => (
                  <Card
                    key={userHoliday.id}
                    className="bg-gradient-to-r from-green-50 to-mint-50 dark:from-green-950 dark:to-mint-950 border-green-200 dark:border-green-800"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {userHoliday.holiday?.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(userHoliday.holiday?.date || "").toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {userHoliday.is_favorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                          {userHoliday.reminder_enabled && <Bell className="h-4 w-4 text-green-600" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No upcoming holidays found.</p>
            )}
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-green-600" />
              Notification Settings
            </h3>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="text-sm font-medium">Email Notifications</Label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Receive email reminders for holidays</p>
                    </div>
                  </div>
                  <Switch
                    checked={profile?.email_notifications || false}
                    onCheckedChange={(checked) => updateNotificationSettings("email_notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-green-600" />
                    <div>
                      <Label className="text-sm font-medium">Same Day Reminders</Label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Get reminded on the holiday</p>
                    </div>
                  </div>
                  <Switch
                    checked={profile?.reminder_preferences?.same_day || false}
                    onCheckedChange={(checked) => updateNotificationSettings("same_day", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div>
                      <Label className="text-sm font-medium">Day Before Reminders</Label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Get reminded one day before</p>
                    </div>
                  </div>
                  <Switch
                    checked={profile?.reminder_preferences?.day_before || false}
                    onCheckedChange={(checked) => updateNotificationSettings("day_before", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Member since {new Date(profile?.created_at || "").toLocaleDateString()}
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
