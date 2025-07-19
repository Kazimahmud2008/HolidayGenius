"use client"

import { useState, useEffect } from "react"
import { Activity, Database, Wifi, WifiOff, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { holidayAPI } from "@/lib/holidays-api"
import { API_PROVIDERS } from "@/lib/api-config"

interface APIStatus {
  provider: string
  status: "online" | "offline" | "limited"
  responseTime?: number
  rateLimit?: {
    remaining: number
    resetTime: number | null
    maxRequests: number
  }
}

export function APIStatus() {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([])
  const [cacheStats, setCacheStats] = useState({ size: 0, keys: [] })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    checkAPIStatus()
    updateCacheStats()

    const interval = setInterval(() => {
      checkAPIStatus()
      updateCacheStats()
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const checkAPIStatus = async () => {
    const statuses: APIStatus[] = []

    for (const provider of Object.values(API_PROVIDERS)) {
      try {
        const startTime = Date.now()
        const rateLimitStatus = holidayAPI.getRateLimitStatus(provider)
        const responseTime = Date.now() - startTime

        statuses.push({
          provider,
          status: rateLimitStatus.remaining > 0 ? "online" : "limited",
          responseTime,
          rateLimit: rateLimitStatus,
        })
      } catch (error) {
        statuses.push({
          provider,
          status: "offline",
        })
      }
    }

    setApiStatuses(statuses)
  }

  const updateCacheStats = () => {
    const stats = holidayAPI.getCacheStats()
    setCacheStats(stats)
  }

  const clearCache = () => {
    holidayAPI.clearCache()
    updateCacheStats()
  }

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900"
      >
        <Activity className="h-4 w-4 mr-2" />
        API Status
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-green-200 dark:border-green-800">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm flex items-center">
            <Activity className="h-4 w-4 mr-2 text-green-600" />
            API Status
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="h-6 w-6 p-0">
            ×
          </Button>
        </div>

        {/* API Providers Status */}
        <div className="space-y-2">
          {apiStatuses.map((status) => (
            <div key={status.provider} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {status.status === "online" ? (
                  <Wifi className="h-3 w-3 text-green-500" />
                ) : status.status === "limited" ? (
                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-red-500" />
                )}
                <span className="capitalize">{status.provider}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    status.status === "online" ? "default" : status.status === "limited" ? "secondary" : "destructive"
                  }
                  className="text-xs px-1 py-0"
                >
                  {status.status}
                </Badge>
                {status.responseTime && <span className="text-gray-500">{status.responseTime}ms</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Rate Limits */}
        <div className="space-y-2">
          <h4 className="font-medium text-xs text-gray-600 dark:text-gray-400">Rate Limits</h4>
          {apiStatuses.map(
            (status) =>
              status.rateLimit && (
                <div key={`${status.provider}-rate`} className="flex items-center justify-between text-xs">
                  <span className="capitalize">{status.provider}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-500">
                      {status.rateLimit.remaining}/{status.rateLimit.maxRequests}
                    </span>
                  </div>
                </div>
              ),
          )}
        </div>

        {/* Cache Status */}
        <div className="border-t border-green-200 dark:border-green-800 pt-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-xs text-gray-600 dark:text-gray-400 flex items-center">
              <Database className="h-3 w-3 mr-1" />
              Cache
            </h4>
            <Button variant="ghost" size="sm" onClick={clearCache} className="text-xs h-6 px-2">
              Clear
            </Button>
          </div>
          <div className="text-xs text-gray-500">{cacheStats.size} entries cached</div>
        </div>
      </CardContent>
    </Card>
  )
}
