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
    <footer className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-slate-100 border-t border-slate-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none"></div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 hover:scale-110 transition-all duration-300 p-2 rounded-lg hover:bg-slate-800/50"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 hover:scale-110 transition-all duration-300 p-2 rounded-lg hover:bg-slate-800/50"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 hover:scale-110 transition-all duration-300 p-2 rounded-lg hover:bg-slate-800/50"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 hover:scale-110 transition-all duration-300 p-2 rounded-lg hover:bg-slate-800/50"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Desktop View - Show all tabs */}
          <div className="hidden lg:grid lg:col-span-3 grid-cols-3 gap-12">
            {tabs.map((tab) => (
              <div key={tab.id}>
                <h3 className="font-semibold text-white mb-6 text-lg">{tab.label}</h3>
                <ul className="space-y-3">
                  {tab.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-indigo-400 transition-all duration-200 text-sm flex items-center gap-3 group hover:translate-x-1"
                      >
                        {link.icon && <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />}
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
            <div className="flex gap-2 mb-6 border-b border-slate-700 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "product" | "company" | "legal")}
                  className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap border-b-2 rounded-t-md ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                      : "border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {tabs
                .find((tab) => tab.id === activeTab)
                ?.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-slate-400 hover:text-indigo-400 transition-all duration-200 text-sm flex items-center gap-3 group hover:translate-x-1"
                  >
                    {link.icon && <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />}
                    {link.label}
                  </Link>
                ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-4 text-lg">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">Subscribe to get the latest updates and learning tips delivered to your inbox.</p>
            <form onSubmit={handleNewsletterSubscribe} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800/80 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              />
              <Button
                type="submit"
                disabled={subscribing}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/50 pt-10 mt-12">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-400">© {currentYear} Microlearning Coach. All rights reserved.</p>
            <div className="flex gap-8 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-indigo-400 transition-all duration-200 hover:scale-105">
                Privacy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-indigo-400 transition-all duration-200 hover:scale-105">
                Terms
              </Link>
              <Link href="/contact" className="text-slate-400 hover:text-indigo-400 transition-all duration-200 hover:scale-105">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
