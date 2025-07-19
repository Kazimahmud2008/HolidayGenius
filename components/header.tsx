"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Globe, Sparkles, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { AuthModal } from "./auth/auth-modal"
import { UserDashboard } from "./user-dashboard"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "signin" | "signup" }>({
    isOpen: false,
    mode: "signin",
  })
  const [showDashboard, setShowDashboard] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (event === "SIGNED_IN" && session?.user) {
        // Create or update user profile
        await createUserProfile(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const createUserProfile = async (user: any) => {
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || "",
        country_code: user.user_metadata?.country_code || "US",
        country_name: getCountryName(user.user_metadata?.country_code || "US"),
      })

      if (error && error.code !== "23505") {
        // Ignore duplicate key errors
        throw error
      }

      // Fetch and store holidays for the user's country
      if (user.user_metadata?.country_code) {
        await fetchAndStoreHolidays(user.id, user.user_metadata.country_code)
      }
    } catch (error: any) {
      console.error("Error creating user profile:", error)
    }
  }

  const fetchAndStoreHolidays = async (userId: string, countryCode: string) => {
    try {
      // Call our API to fetch and store holidays
      const response = await fetch("/api/user/sync-holidays", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, countryCode }),
      })

      if (!response.ok) {
        throw new Error("Failed to sync holidays")
      }

      toast.success("Your holidays have been synced!")
    } catch (error) {
      console.error("Error syncing holidays:", error)
    }
  }

  const getCountryName = (countryCode: string): string => {
    const countryMap: Record<string, string> = {
      US: "United States",
      CA: "Canada",
      GB: "United Kingdom",
      AU: "Australia",
      DE: "Germany",
      FR: "France",
      JP: "Japan",
      IN: "India",
      BR: "Brazil",
      MX: "Mexico",
    }
    return countryMap[countryCode] || countryCode
  }

  const openAuthModal = (mode: "signin" | "signup") => {
    setAuthModal({ isOpen: true, mode })
  }

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: "signin" })
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-green-200 dark:border-green-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-400 via-mint-400 to-yellow-400 group-hover:scale-105 transition-transform duration-300">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1">
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 via-mint-600 to-yellow-600 bg-clip-text text-transparent font-poppins">
                GlobeHoliday.ai
              </h1>
              <Sparkles className="h-4 w-4 text-green-500" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 font-medium"
            >
              Home
            </Link>
            <Link
              href="/features"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 font-medium"
            >
              Features
            </Link>
            <Link
              href="/widget"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 font-medium"
            >
              Widget
            </Link>

            {!loading &&
              (user ? (
                <Button
                  onClick={() => setShowDashboard(true)}
                  className="rounded-full bg-gradient-to-r from-green-500 to-mint-500 hover:from-green-600 hover:to-mint-600 text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => openAuthModal("signin")} className="rounded-full">
                    Sign In
                  </Button>
                  <Button
                    onClick={() => openAuthModal("signup")}
                    className="rounded-full bg-gradient-to-r from-green-500 to-mint-500 hover:from-green-600 hover:to-mint-600 text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              ))}

            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-green-200 dark:border-green-800 bg-white dark:bg-gray-900">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <Link
                href="/"
                className="block text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/features"
                className="block text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/widget"
                className="block text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Widget
              </Link>

              {!loading &&
                (user ? (
                  <Button
                    onClick={() => {
                      setShowDashboard(true)
                      setIsMenuOpen(false)
                    }}
                    className="w-full rounded-full bg-gradient-to-r from-green-500 to-mint-500 hover:from-green-600 hover:to-mint-600 text-white"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        openAuthModal("signin")
                        setIsMenuOpen(false)
                      }}
                      className="w-full rounded-full border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900 bg-transparent"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        openAuthModal("signup")
                        setIsMenuOpen(false)
                      }}
                      className="w-full rounded-full bg-gradient-to-r from-green-500 to-mint-500 hover:from-green-600 hover:to-mint-600 text-white"
                    >
                      Sign Up
                    </Button>
                  </div>
                ))}
            </nav>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        mode={authModal.mode}
        onModeChange={(mode) => setAuthModal({ ...authModal, mode })}
      />

      {/* User Dashboard */}
      {showDashboard && user && <UserDashboard user={user} onClose={() => setShowDashboard(false)} />}
    </>
  )
}
