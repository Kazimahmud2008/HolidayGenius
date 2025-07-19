import { Globe, Search, Calendar, WorkflowIcon as Widget, Heart, Timer, Code, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Access holidays from 200+ countries worldwide with real-time updates and local insights.",
  },
  {
    icon: Search,
    title: "AI-Powered Search",
    description: "Find holidays instantly with intelligent search that understands context and cultural significance.",
  },
  {
    icon: Calendar,
    title: "Smart Calendar",
    description: "Interactive calendar views with holiday details, cultural context, and celebration tips.",
  },
  {
    icon: Widget,
    title: "Embeddable Widgets",
    description: "Generate custom holiday widgets for your website or blog with just a few clicks.",
  },
  {
    icon: Heart,
    title: "Personal Favorites",
    description: "Save and track your favorite holidays with personalized notifications and reminders.",
  },
  {
    icon: Timer,
    title: "Live Countdowns",
    description: "Real-time countdowns to upcoming holidays with beautiful animated displays.",
  },
  {
    icon: Code,
    title: "Developer API",
    description: "Robust REST API for developers to integrate holiday data into their applications.",
  },
  {
    icon: Sparkles,
    title: "Cultural Insights",
    description: "Learn about holiday traditions, customs, and cultural significance with AI-generated insights.",
  },
]

export function FeatureSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-mint-100 dark:from-green-900 dark:to-mint-900 rounded-full px-4 py-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-poppins bg-gradient-to-r from-green-600 via-mint-600 to-yellow-600 bg-clip-text text-transparent">
            Everything You Need for
            <br />
            Holiday Discovery
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover, track, and celebrate holidays from around the world with our comprehensive suite of AI-powered
            tools and features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl hover:shadow-green-100 dark:hover:shadow-green-900/20 transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 border-green-200 dark:border-green-800 rounded-2xl overflow-hidden"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 via-mint-400 to-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
