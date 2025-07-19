"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ModernFeaturesSection } from "@/components/modern-features-section"
import { FeatureSection } from "@/components/feature-section"
import { HolidayGrid } from "@/components/holiday-grid"
import { CountdownTimer } from "@/components/countdown-timer"
import { WorldwideHolidays } from "@/components/worldwide-holidays"
import { LongWeekends } from "@/components/long-weekends"
import { Footer } from "@/components/footer"
import { APIStatus } from "@/components/api-status"
import { holidayAPI, type Holiday } from "@/lib/holidays-api"

export default function Home() {
  const router = useRouter()
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(false)
  const [searchMode, setSearchMode] = useState(false)
  const [apiProvider, setApiProvider] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleSearch = async (query: string) => {
    setLoading(true)
    setSearchMode(true)
    setError("")
    try {
      const response = await holidayAPI.searchHolidays(query)
      setHolidays(response.data)
      setApiProvider(response.provider)
    } catch (error) {
      console.error("Search error:", error)
      setError(error instanceof Error ? error.message : "Search failed")
      setHolidays([])
    } finally {
      setLoading(false)
    }
  }

  const handleCountrySelect = async (countryCode: string) => {
    // Navigate to the dedicated country page
    router.push(`/country/${countryCode.toLowerCase()}`)
  }

  // Load default holidays on mount for preview
  useEffect(() => {
    const loadDefaultHolidays = async () => {
      try {
        const response = await holidayAPI.getHolidaysByCountry("US", { limit: 6 })
        setHolidays(response.data)
        setApiProvider(response.provider)
      } catch (error) {
        console.error("Failed to load default holidays:", error)
      }
    }

    loadDefaultHolidays()
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main>
        <HeroSection onSearch={handleSearch} onCountrySelect={handleCountrySelect} />

        {/* New Modern Features Section */}
        <ModernFeaturesSection />

        {/* API Provider Info */}
        {apiProvider && !loading && (
          <div className="py-4 bg-green-50 dark:bg-green-950">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-green-700 dark:text-green-300">
                Data provided by <strong>{apiProvider}</strong>
                {apiProvider === "cache" && " (cached)"}
                {apiProvider === "Nager.Date" && " - Free & Reliable Holiday API"}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="py-4 bg-red-50 dark:bg-red-950">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Error:</strong> {error}
              </p>
            </div>
          </div>
        )}

        {/* Worldwide Holidays Section */}
        <section className="py-16 bg-gradient-to-br from-green-50 via-mint-50 to-yellow-50 dark:from-green-950 dark:via-mint-950 dark:to-yellow-950">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <WorldwideHolidays />
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <CountdownTimer />
            </div>
          </div>
        </section>

        {/* Long Weekends Section */}
        <section className="py-16 bg-gradient-to-br from-green-50 via-mint-50 to-yellow-50 dark:from-green-950 dark:via-mint-950 dark:to-yellow-950">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <LongWeekends />
            </div>
          </div>
        </section>

        {/* Holiday Preview */}
        {loading ? (
          <section className="py-16">
            <div className="container mx-auto px-4 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading holidays from Nager.Date API...</p>
            </div>
          </section>
        ) : (
          <HolidayGrid holidays={holidays} title={searchMode ? "Search Results" : "Featured Holidays"} />
        )}

        {/* Original Feature Section (moved down) */}
        <FeatureSection />
      </main>

      <Footer />
      <APIStatus />
    </div>
  )
}
