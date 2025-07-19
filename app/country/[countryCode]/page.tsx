import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CountryHolidaysView } from "@/components/country-holidays-view"
import { getAvailableCountries } from "@/lib/holidays-api"

interface CountryPageProps {
  params: {
    countryCode: string
  }
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const countries = await getAvailableCountries()
  const country = countries.find((c) => c.code.toLowerCase() === params.countryCode.toLowerCase())

  if (!country) {
    return {
      title: "Country Not Found - GlobeHoliday.ai",
    }
  }

  return {
    title: `${country.name} Holidays ${new Date().getFullYear()} - GlobeHoliday.ai`,
    description: `Discover all public holidays in ${country.name} for ${new Date().getFullYear()}. Get dates, descriptions, and cultural insights for each holiday.`,
    keywords: `${country.name} holidays, public holidays ${country.name}, ${country.name} calendar, holidays ${new Date().getFullYear()}`,
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const countries = await getAvailableCountries()
  const country = countries.find((c) => c.code.toLowerCase() === params.countryCode.toLowerCase())

  if (!country) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <CountryHolidaysView country={country} />
      <Footer />
    </div>
  )
}
