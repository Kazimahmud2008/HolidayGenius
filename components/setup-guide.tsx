"use client"

import { useState } from "react"
import { ExternalLink, CheckCircle, AlertCircle, Copy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

const apiProviders = [
  {
    name: "Holidays API (Nager.Date)",
    description: "Free API with no registration required",
    url: "https://date.nager.at/",
    free: true,
    setup: "No setup required - works out of the box!",
    features: ["60+ countries", "No rate limits", "No API key needed"],
    envVar: "Not required",
  },
  {
    name: "Calendarific",
    description: "Comprehensive holiday data with cultural insights",
    url: "https://calendarific.com/",
    free: false,
    setup: "Sign up for free account (1000 requests/month)",
    features: ["200+ countries", "Cultural context", "Multiple languages"],
    envVar: "CALENDARIFIC_API_KEY",
  },
  {
    name: "Abstract API",
    description: "Simple and reliable holiday API",
    url: "https://app.abstractapi.com/",
    free: false,
    setup: "Sign up for free account (1000 requests/month)",
    features: ["Global coverage", "Fast response", "Easy integration"],
    envVar: "ABSTRACT_API_KEY",
  },
]

export function SetupGuide() {
  const [copiedEnv, setCopiedEnv] = useState<string>("")

  const copyEnvVar = (envVar: string) => {
    navigator.clipboard.writeText(`${envVar}=your_api_key_here`)
    setCopiedEnv(envVar)
    setTimeout(() => setCopiedEnv(""), 2000)
  }

  return (
    <div className="space-y-6">
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Good news!</strong> GlobeHoliday.ai works out of the box with the free Holidays API. Add premium API
          keys for enhanced features and higher rate limits.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {apiProviders.map((provider, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{provider.name}</CardTitle>
                {provider.free ? (
                  <Badge className="bg-green-100 text-green-800">Free</Badge>
                ) : (
                  <Badge variant="outline">Freemium</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{provider.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="text-sm space-y-1">
                  {provider.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Setup:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{provider.setup}</p>
              </div>

              {provider.envVar !== "Not required" && (
                <div>
                  <h4 className="font-medium mb-2">Environment Variable:</h4>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{provider.envVar}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyEnvVar(provider.envVar)}
                      className="h-6 w-6 p-0"
                    >
                      {copiedEnv === provider.envVar ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => window.open(provider.url, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit {provider.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro Tip:</strong> The system automatically falls back to available APIs if one fails. Configure
          multiple providers for maximum reliability.
        </AlertDescription>
      </Alert>
    </div>
  )
}
