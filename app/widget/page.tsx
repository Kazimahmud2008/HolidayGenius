import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WidgetGenerator } from "@/components/widget-generator"

export const metadata: Metadata = {
  title: "Holiday Widget Generator - GlobeHoliday.ai | Embed Holidays on Your Site",
  description:
    "Generate custom holiday widgets for your website or blog. Easy copy-paste integration with customizable themes and real-time updates.",
  keywords: "holiday widget, embed holidays, website integration, blog widget, holiday calendar embed",
}

export default function WidgetPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <WidgetGenerator />
      <Footer />
    </div>
  )
}
