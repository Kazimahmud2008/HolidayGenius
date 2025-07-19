import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "GlobeHoliday.ai - Discover Global Holidays with AI-Powered Insights",
  description:
    "Explore public holidays from every country worldwide with GlobeHoliday.ai. Get AI-powered holiday insights, countdowns, embeddable widgets, and personalized holiday tracking.",
  keywords:
    "global holidays, public holidays, holiday calendar, AI holidays, international holidays, holiday API, holiday widgets, country holidays",
  authors: [{ name: "GlobeHoliday.ai" }],
  creator: "GlobeHoliday.ai",
  publisher: "GlobeHoliday.ai",
  robots: "index, follow",
  openGraph: {
    title: "GlobeHoliday.ai - AI-Powered Global Holiday Discovery",
    description:
      "Discover and track public holidays from every country with AI-powered insights and personalized features.",
    type: "website",
    locale: "en_US",
    siteName: "GlobeHoliday.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobeHoliday.ai - AI-Powered Global Holiday Discovery",
    description: "Discover and track public holidays from every country with AI-powered insights.",
  },
  viewport: "width=device-width, initial-scale=1",
  alternates: {
    canonical: "https://globeholiday.ai",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "GlobeHoliday.ai",
              description: "AI-powered global holiday discovery and tracking platform",
              url: "https://globeholiday.ai",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
