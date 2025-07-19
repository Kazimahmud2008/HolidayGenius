"use client"

import { useState } from "react"
import { Search, Globe, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CountrySelector } from "./country-selector"

interface HeroSectionProps {
  onSearch: (query: string) => void
  onCountrySelect: (countryCode: string) => void
}

export function HeroSection({ onSearch, onCountrySelect }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode)
    onCountrySelect(countryCode)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-mint-50 to-yellow-50 dark:from-green-950 dark:via-mint-950 dark:to-yellow-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-green-400 to-mint-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-yellow-400 to-green-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-mint-400 to-yellow-400 rounded-full opacity-20 animate-pulse delay-2000"></div>

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-4 py-2 border border-green-200 dark:border-green-800">
            <Sparkles className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">AI-Powered Holiday Discovery</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins">
            <span className="bg-gradient-to-r from-green-600 via-mint-600 to-yellow-600 bg-clip-text text-transparent">
              Discover Global
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-600 via-green-600 to-mint-600 bg-clip-text text-transparent">
              Holidays with AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore public holidays from every country worldwide. Get AI-powered insights, personalized tracking, and
            embeddable widgets for your projects.
          </p>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search holidays, countries, or dates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 pr-4 py-6 text-lg rounded-2xl border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="lg"
                className="px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-green-500 via-mint-500 to-yellow-500 hover:from-green-600 hover:via-mint-600 hover:to-yellow-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Or explore by country:</span>
              <div className="w-full md:w-64">
                <CountrySelector
                  onSelect={handleCountrySelect}
                  value={selectedCountry}
                  placeholder="Select a country..."
                />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              className="px-8 py-4 text-lg rounded-2xl bg-gradient-to-r from-green-500 to-mint-500 hover:from-green-600 hover:to-mint-600 text-white font-semibold transition-all duration-300 hover:scale-105"
            >
              <Globe className="h-5 w-5 mr-2" />
              Explore Holidays
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg rounded-2xl border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900 transition-all duration-300 bg-transparent"
            >
              View Features
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
