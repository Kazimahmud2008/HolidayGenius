"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-10 h-10 rounded-full hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-300 hover:scale-105"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-green-600 transition-all" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-500 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
