"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Globe, Sparkles, Mail, Send, Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  const [email, setEmail] = useState("")

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <footer className="bg-gradient-to-br from-green-900 via-mint-900 to-yellow-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-400 via-mint-400 to-yellow-400">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <h3 className="text-xl font-bold font-poppins">GlobeHoliday.ai</h3>
                <Sparkles className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
            <p className="text-green-100 leading-relaxed">
              Discover and celebrate holidays from around the world with AI-powered insights and personalized tracking.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin, Github].map((Icon, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full hover:bg-white/10 text-green-200 hover:text-white transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Product</h4>
            <ul className="space-y-3">
              {["Features", "API Documentation", "Widget Generator", "Mobile App", "Pricing"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-green-200 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Blog", "Careers", "Press Kit", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-green-200 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Stay Updated</h4>
            <p className="text-green-200 mb-4">
              Get the latest holiday updates and AI insights delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-300" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-green-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-green-900 font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-green-200">
            <p>&copy; 2024 GlobeHoliday.ai. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="#" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-white transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-green-200 text-sm">Made with 💚 for holiday enthusiasts worldwide</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
