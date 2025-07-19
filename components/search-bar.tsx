"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Search holidays..." }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange("")}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
