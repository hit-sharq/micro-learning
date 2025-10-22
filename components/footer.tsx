"use client"

import type React from "react"

import Link from "next/link"
import { Linkedin, Twitter, Github, Instagram } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email")
      return
    }

    setSubscribing(true)
    try {
      // Simulate newsletter subscription
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Successfully subscribed to our newsletter!")
      setEmail("")
    } catch (error) {
      toast.error("Failed to subscribe")
    } finally {
      setSubscribing(false)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-100 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">ML</span>
              </div>
              <span className="text-lg font-bold">Microlearning Coach</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Empowering learners worldwide with personalized, bite-sized education.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/lessons" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                  Browse Lessons
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                  Achievements
                </Link>
              </li>
              <li>
                <Link href="/progress" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                  Progress Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-sm text-slate-400 mb-4">Subscribe to get the latest updates and learning tips.</p>
            <form onSubmit={handleNewsletterSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Button
                type="submit"
                disabled={subscribing}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">© {currentYear} Microlearning Coach. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
