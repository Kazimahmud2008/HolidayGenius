"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getAvailableCountries, type Country } from "@/lib/holidays-api"

interface CountrySelectorProps {
  onSelect: (countryCode: string) => void
  value?: string
  placeholder?: string
  className?: string
}

export function CountrySelector({ onSelect, value, placeholder, className }: CountrySelectorProps) {
  const [open, setOpen] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    try {
      setLoading(true)
      const countriesData = await getAvailableCountries()
      setCountries(countriesData)
    } catch (error) {
      console.error("Failed to load countries:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedCountry = countries.find((country) => country.code === value)

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const displayText = selectedCountry
    ? `${selectedCountry.flag} ${selectedCountry.name}`
    : placeholder || "Select a country..."

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between rounded-2xl border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-green-50 dark:hover:bg-green-900 transition-all duration-300 min-h-[48px]",
            className,
          )}
          disabled={loading}
        >
          <div className="flex items-center space-x-2 truncate">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="truncate">{displayText}</span>}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 rounded-2xl border-green-200 dark:border-green-800 max-h-[400px]">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>
              <div className="py-6 text-center text-sm">
                <div className="mb-2">No country found.</div>
                <div className="text-xs text-muted-foreground">Try searching with a different term</div>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredCountries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.code}`}
                  onSelect={() => {
                    onSelect(country.code)
                    setOpen(false)
                  }}
                  className="hover:bg-green-50 dark:hover:bg-green-900 cursor-pointer"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === country.code ? "opacity-100" : "opacity-0")} />
                  <span className="mr-2 text-lg">{country.flag}</span>
                  <span className="flex-1">{country.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{country.code}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
