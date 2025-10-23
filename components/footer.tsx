"use client"

import type React from "react"

import Link from "next/link"
import { Linkedin, Twitter, Github, Instagram, BookOpen, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)
  const [activeTab, setActiveTab] = useState<"product" | "company" | "legal">("product")

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

  const tabs = [
    {
      id: "product",
      label: "Product",
      links: [
        { label: "Browse Lessons", href: "/lessons" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Achievements", href: "/achievements" },
        { label: "Progress Tracking", href: "/progress" },
      ],
    },
    {
      id: "company",
      label: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog", icon: BookOpen },
        { label: "Careers", href: "/careers", icon: Briefcase },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      id: "legal",
      label: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Accessibility", href: "/accessibility" },
      ],
    },
  ]

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 border-t border-slate-800">
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

          {/* Desktop View - Show all tabs */}
          <div className="hidden lg:grid lg:col-span-3 grid-cols-3 gap-8">
            {tabs.map((tab) => (
              <div key={tab.id}>
                <h3 className="font-semibold text-white mb-4">{tab.label}</h3>
                <ul className="space-y-2">
                  {tab.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2 group"
                      >
                        {link.icon && <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile/Tablet View - Tabbed interface */}
          <div className="lg:hidden md:col-span-1">
            <div className="flex gap-2 mb-4 border-b border-slate-700 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "product" | "company" | "legal")}
                  className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                      : "border-transparent text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-3">
              {tabs
                .find((tab) => tab.id === activeTab)
                ?.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-slate-400 hover:text-indigo-400 transition-colors text-sm flex items-center gap-2 group block"
                  >
                    {link.icon && <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    {link.label}
                  </Link>
                ))}
            </div>
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
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500"
              />
              <Button
                type="submit"
                disabled={subscribing}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
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
