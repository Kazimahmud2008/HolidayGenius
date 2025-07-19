"use client"

import { useState } from "react"
import { Copy, Download, Eye, Settings, Palette, Code, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CountrySelector } from "./country-selector"

export function WidgetGenerator() {
  const [config, setConfig] = useState({
    country: "US",
    theme: "light",
    size: "medium",
    showCountdown: true,
    showDescription: true,
    maxHolidays: 5,
    primaryColor: "#10b981",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
  })

  const generateEmbedCode = () => {
    return `<iframe 
  src="https://globeholiday.ai/embed?country=${config.country}&theme=${config.theme}&size=${config.size}&countdown=${config.showCountdown}&desc=${config.showDescription}&max=${config.maxHolidays}&primary=${encodeURIComponent(config.primaryColor)}&bg=${encodeURIComponent(config.backgroundColor)}&text=${encodeURIComponent(config.textColor)}"
  width="${config.size === "small" ? "300" : config.size === "medium" ? "400" : "500"}"
  height="${config.size === "small" ? "400" : config.size === "medium" ? "500" : "600"}"
  frameborder="0"
  scrolling="no">
</iframe>`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateEmbedCode())
  }

  return (
    <main className="py-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-mint-50 to-yellow-50 dark:from-green-950 dark:via-mint-950 dark:to-yellow-950 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-4 py-2 border border-green-200 dark:border-green-800">
              <Code className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Widget Generator</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold font-poppins">
              <span className="bg-gradient-to-r from-green-600 via-mint-600 to-yellow-600 bg-clip-text text-transparent">
                Embed Holidays
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-600 via-green-600 to-mint-600 bg-clip-text text-transparent">
                On Your Website
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Generate custom holiday widgets for your website or blog. Easy copy-paste integration with real-time
              updates and customizable themes.
            </p>
          </div>
        </div>
      </section>

      {/* Widget Generator */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Configuration Panel */}
            <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 border-green-200 dark:border-green-800 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  <Settings className="h-6 w-6 text-green-600" />
                  <span>Widget Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Country Selection */}
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Country
                  </Label>
                  <CountrySelector value={config.country} onSelect={(country) => setConfig({ ...config, country })} />
                </div>

                {/* Theme Selection */}
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </Label>
                  <Select value={config.theme} onValueChange={(theme) => setConfig({ ...config, theme })}>
                    <SelectTrigger className="rounded-xl border-green-200 dark:border-green-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Size Selection */}
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Widget Size
                  </Label>
                  <Select value={config.size} onValueChange={(size) => setConfig({ ...config, size })}>
                    <SelectTrigger className="rounded-xl border-green-200 dark:border-green-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (300x400)</SelectItem>
                      <SelectItem value="medium">Medium (400x500)</SelectItem>
                      <SelectItem value="large">Large (500x600)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Max Holidays */}
                <div className="space-y-2">
                  <Label htmlFor="maxHolidays" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maximum Holidays to Show
                  </Label>
                  <Input
                    id="maxHolidays"
                    type="number"
                    min="1"
                    max="20"
                    value={config.maxHolidays}
                    onChange={(e) => setConfig({ ...config, maxHolidays: Number.parseInt(e.target.value) })}
                    className="rounded-xl border-green-200 dark:border-green-800"
                  />
                </div>

                {/* Toggle Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="countdown" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show Countdown Timer
                    </Label>
                    <Switch
                      id="countdown"
                      checked={config.showCountdown}
                      onCheckedChange={(showCountdown) => setConfig({ ...config, showCountdown })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show Holiday Descriptions
                    </Label>
                    <Switch
                      id="description"
                      checked={config.showDescription}
                      onCheckedChange={(showDescription) => setConfig({ ...config, showDescription })}
                    />
                  </div>
                </div>

                {/* Color Customization */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Palette className="h-5 w-5 text-green-600" />
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color Customization</Label>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor" className="text-sm text-gray-600 dark:text-gray-400">
                        Primary Color
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="w-16 h-10 rounded-xl border-green-200 dark:border-green-800"
                        />
                        <Input
                          type="text"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="flex-1 rounded-xl border-green-200 dark:border-green-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backgroundColor" className="text-sm text-gray-600 dark:text-gray-400">
                        Background Color
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={config.backgroundColor}
                          onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                          className="w-16 h-10 rounded-xl border-green-200 dark:border-green-800"
                        />
                        <Input
                          type="text"
                          value={config.backgroundColor}
                          onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                          className="flex-1 rounded-xl border-green-200 dark:border-green-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview and Code */}
            <div className="space-y-6">
              {/* Preview */}
              <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 border-green-200 dark:border-green-800 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    <Eye className="h-6 w-6 text-green-600" />
                    <span>Widget Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 min-h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Sparkles className="h-12 w-12 text-green-500 mx-auto" />
                      <p className="text-gray-600 dark:text-gray-400">Widget preview will appear here</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Size: {config.size} | Theme: {config.theme}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Embed Code */}
              <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 border-green-200 dark:border-green-800 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    <Code className="h-6 w-6 text-green-600" />
                    <span>Embed Code</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={generateEmbedCode()}
                    readOnly
                    className="min-h-[120px] font-mono text-sm rounded-xl border-green-200 dark:border-green-800 bg-gray-50 dark:bg-gray-800"
                  />

                  <div className="flex space-x-3">
                    <Button
                      onClick={copyToClipboard}
                      className="flex-1 bg-gradient-to-r from-green-500 to-mint-500 hover:from-green-600 hover:to-mint-600 text-white rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900 rounded-xl bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <strong>Pro Tip:</strong> Copy the code above and paste it into your website's HTML where you want
                      the holiday widget to appear. The widget will automatically update with new holidays!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
