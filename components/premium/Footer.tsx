"use client"

import type React from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Linkedin, Twitter, Github, Instagram,
  BookOpen, Briefcase, Mail, Heart,
} from "lucide-react"
import { useState } from "react"

interface LinkItem { label: string; href: string; icon?: React.ReactNode }
interface TabItem { id: string; label: string; links: LinkItem[] }

interface PremiumFooterProps {
  brandName?: string
  brandDescription?: string
  tabs?: TabItem[]
  socialLinks?: { icon: React.ReactNode; href: string; label: string }[]
  showNewsletter?: boolean
  newsletterPlaceholder?: string
  customBottomLinks?: { label: string; href: string }[]
  className?: string
}

const defaultTabs: TabItem[] = [
  {
    id: "product",
    label: "Product",
    links: [
      { label: "Explore Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "/blog", icon: <BookOpen className="w-3.5 h-3.5" /> },
    ],
  },
  {
    id: "company",
    label: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog", icon: <BookOpen className="w-3.5 h-3.5" /> },
      { label: "Careers", href: "/careers", icon: <Briefcase className="w-3.5 h-3.5" /> },
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

const defaultSocial = [
  { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com", label: "Twitter" },
  { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: <Github className="w-5 h-5" />, href: "https://github.com", label: "GitHub" },
  { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com", label: "Instagram" },
]

export function PremiumFooter({
  brandName = "Microlearning Coach",
  brandDescription = "Empowering learners worldwide with personalized, bite-sized education that fits into any lifestyle.",
  tabs = defaultTabs,
  socialLinks = defaultSocial,
  showNewsletter = true,
  newsletterPlaceholder = "your@email.com",
  customBottomLinks,
  className,
}: PremiumFooterProps) {
  const [email, setEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id ?? "product")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return toast.error("Please enter your email")
    setSubscribing(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success("Successfully subscribed!")
    setEmail("")
    setSubscribing(false)
  }

  const year = new Date().getFullYear()

  return (
    <footer className={cn("relative overflow-hidden bg-slate-950 border-t border-slate-800/60", className)}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, rgba(99,102,241,0.12) 0%, transparent 50%)," +
            "radial-gradient(circle at 80% 20%, rgba(168,85,247,0.1) 0%, transparent 50%)," +
            "radial-gradient(circle at 50% 100%, rgba(236,72,153,0.06) 0%, transparent 55%)",
        }}
      />

      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24")}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14 mb-14">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-sm">ML</span>
              </div>
              <span className="font-bold text-lg text-white tracking-tight">{brandName}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{brandDescription}</p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 transition-all duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns — Desktop visible / Mobile tabbed */}
          <div className="hidden lg:flex lg:col-span-7 gap-12">
            {tabs.map((tab) => (
              <div key={tab.id}>
                <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">{tab.label}</h3>
                <ul className="space-y-3">
                  {tab.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2.5 text-sm text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-200 group"
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile tabbed nav */}
          <div className="lg:hidden md:col-span-1 space-y-5">
            <div className="flex gap-2 pb-3 border-b border-slate-800 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg border-b-2 transition-all",
                    activeTab === tab.id ? "border-indigo-500 text-indigo-400 bg-indigo-500/10" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <ul className="space-y-2.5">
              {tabs.find((t) => t.id === activeTab)?.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-indigo-400 hover:translate-x-1 inline-block transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          {showNewsletter && (
            <div className="lg:col-span-3">
              <div className="p-7 rounded-2xl from-slate-800/60 to-slate-900/60 border border-slate-700/50 backdrop-blur-md">
                <h3 className="font-semibold text-white text-lg mb-2">Stay in the Loop</h3>
                <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                  Get the latest learning tips and product updates delivered to your inbox.
                </p>
                <form onSubmit={handleSubscribe} className="flex gap-2.5 flex-col">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      placeholder={newsletterPlaceholder}
                      className={cn("pl-10 h-11 bg-slate-900/80 border-slate-700/60 text-white placeholder:text-slate-500 focus:border-indigo-500/60 focus:ring-indigo-500/20")}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={subscribing}
                    className="h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25"
                  >
                    {subscribing ? "Subscribing…" : "Subscribe"}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-800/50 pt-8 mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              © {year} {brandName}. All rights reserved. Built with
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            </p>
            <div className="flex gap-6">
              {customBottomLinks
                ? customBottomLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{link.label}</Link>
                  ))
                : (
                  <>
                    <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Privacy</Link>
                    <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Terms</Link>
                    <Link href="/contact" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Contact</Link>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
