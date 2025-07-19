import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Globe,
  Search,
  Calendar,
  WorkflowIcon as Widget,
  Heart,
  Timer,
  Code,
  Sparkles,
  Zap,
  Shield,
  Users,
  Smartphone,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SetupGuide } from "@/components/setup-guide"

export const metadata: Metadata = {
  title: "Features - GlobeHoliday.ai | AI-Powered Holiday Discovery Platform",
  description:
    "Explore all the powerful features of GlobeHoliday.ai including global holiday coverage, AI search, embeddable widgets, and developer APIs.",
  keywords: "holiday features, AI search, holiday widgets, developer API, global holidays, holiday calendar",
}

const mainFeatures = [
  {
    icon: Globe,
    title: "Global Holiday Coverage",
    description: "Access comprehensive holiday data from 200+ countries worldwide",
    details: [
      "Real-time updates from official government sources",
      "Cultural and religious holidays included",
      "Historical holiday data going back decades",
      "Regional and local holiday variations",
      "Multi-language holiday names and descriptions",
    ],
    badge: "200+ Countries",
  },
  {
    icon: Search,
    title: "AI-Powered Search",
    description: "Intelligent search that understands context and cultural significance",
    details: [
      "Natural language processing for complex queries",
      "Cultural context and holiday significance",
      "Smart suggestions and auto-complete",
      "Search by date, country, type, or tradition",
      "Personalized search results based on preferences",
    ],
    badge: "Smart AI",
  },
  {
    icon: Calendar,
    title: "Interactive Calendar Views",
    description: "Beautiful calendar interfaces with detailed holiday information",
    details: [
      "Monthly, weekly, and yearly calendar views",
      "Holiday details with cultural context",
      "Celebration tips and traditions",
      "Integration with popular calendar apps",
      "Customizable calendar themes and layouts",
    ],
    badge: "Multiple Views",
  },
  {
    icon: Widget,
    title: "Embeddable Widgets",
    description: "Generate custom holiday widgets for websites and blogs",
    details: [
      "Drag-and-drop widget builder",
      "Customizable themes and colors",
      "Responsive design for all devices",
      "Real-time holiday updates",
      "Easy copy-paste integration code",
    ],
    badge: "No Code",
  },
]

const additionalFeatures = [
  {
    icon: Heart,
    title: "Personal Favorites",
    description: "Save and track holidays that matter to you",
    features: ["Custom holiday lists", "Notification reminders", "Sharing capabilities"],
  },
  {
    icon: Timer,
    title: "Live Countdowns",
    description: "Real-time countdowns to upcoming holidays",
    features: ["Animated countdown displays", "Multiple timezone support", "Custom countdown widgets"],
  },
  {
    icon: Code,
    title: "Developer API",
    description: "Robust REST API for developers",
    features: ["RESTful endpoints", "Rate limiting", "Comprehensive documentation"],
  },
  {
    icon: Sparkles,
    title: "Cultural Insights",
    description: "AI-generated cultural context and traditions",
    features: ["Holiday origins and history", "Celebration customs", "Cultural significance"],
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Always up-to-date holiday information",
    features: ["Government source integration", "Instant notifications", "Change tracking"],
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security for business users",
    features: ["SOC 2 compliance", "Data encryption", "Privacy protection"],
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share and collaborate on holiday planning",
    features: ["Team workspaces", "Shared calendars", "Permission management"],
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Native iOS and Android applications",
    features: ["Offline access", "Push notifications", "Widget support"],
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-mint-50 to-yellow-50 dark:from-green-950 dark:via-mint-950 dark:to-yellow-950 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-4 py-2 border border-green-200 dark:border-green-800">
                <Sparkles className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Powerful Features</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold font-poppins">
                <span className="bg-gradient-to-r from-green-600 via-mint-600 to-yellow-600 bg-clip-text text-transparent">
                  Everything You Need
                </span>
                <br />
                <span className="bg-gradient-to-r from-yellow-600 via-green-600 to-mint-600 bg-clip-text text-transparent">
                  for Holiday Discovery
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Discover our comprehensive suite of AI-powered tools designed to help you explore, track, and celebrate
                holidays from around the world.
              </p>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="space-y-20">
              {mainFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12`}
                >
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 via-mint-400 to-yellow-400 flex items-center justify-center">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {feature.badge}
                      </Badge>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold font-poppins text-gray-900 dark:text-gray-100">
                      {feature.title}
                    </h2>

                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>

                    <ul className="space-y-3">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-mint-500 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex-1">
                    <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 border-green-200 dark:border-green-800 rounded-2xl overflow-hidden shadow-xl">
                      <CardContent className="p-8">
                        <div className="w-full h-64 bg-gradient-to-br from-green-100 via-mint-100 to-yellow-100 dark:from-green-900 dark:via-mint-900 dark:to-yellow-900 rounded-xl flex items-center justify-center">
                          <feature.icon className="h-24 w-24 text-green-600 dark:text-green-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-20 bg-gradient-to-br from-green-50 via-mint-50 to-yellow-50 dark:from-green-950 dark:via-mint-950 dark:to-yellow-950">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold font-poppins bg-gradient-to-r from-green-600 via-mint-600 to-yellow-600 bg-clip-text text-transparent">
                More Powerful Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Explore additional tools and capabilities that make GlobeHoliday.ai the most comprehensive holiday
                platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl hover:shadow-green-100 dark:hover:shadow-green-900/20 transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 border-green-200 dark:border-green-800 rounded-2xl overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 via-mint-400 to-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-500 to-mint-500 mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* API Setup Guide */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold font-poppins bg-gradient-to-r from-green-600 via-mint-600 to-yellow-600 bg-clip-text text-transparent">
                API Integration Setup
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Connect with premium holiday data providers for enhanced features and higher rate limits.
              </p>
            </div>
            <SetupGuide />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
