import { Globe, Calendar, Zap, Timer, Code, Sparkles, Brain } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Access holidays from 200+ countries with real-time updates and cultural insights.",
    gradient: "from-blue-500 via-purple-500 to-pink-500",
  },
  {
    icon: Brain,
    title: "AI-Powered Search",
    description: "Intelligent search that understands context and finds exactly what you're looking for.",
    gradient: "from-green-500 via-teal-500 to-blue-500",
  },
  {
    icon: Calendar,
    title: "Smart Calendar",
    description: "Interactive calendar views with detailed holiday information and celebration tips.",
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Always up-to-date holiday information from official government sources.",
    gradient: "from-yellow-500 via-orange-500 to-red-500",
  },
  {
    icon: Timer,
    title: "Live Countdowns",
    description: "Beautiful animated countdowns to your favorite upcoming holidays.",
    gradient: "from-purple-500 via-pink-500 to-red-500",
  },
  {
    icon: Code,
    title: "Developer API",
    description: "Robust REST API for developers to integrate holiday data into applications.",
    gradient: "from-cyan-500 via-blue-500 to-purple-500",
  },
]

export function ModernFeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200 dark:border-blue-800 shadow-lg">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold font-poppins">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              In One Platform
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive suite of AI-powered tools designed to help you explore, track, and celebrate
            holidays from around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Gradient Border */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              >
                <div className="absolute inset-[1px] bg-white dark:bg-gray-900 rounded-lg"></div>
              </div>

              <CardContent className="relative p-8 space-y-6">
                {/* Icon with Gradient Background */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </div>

                {/* Hover Effect Glow */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}
                ></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
