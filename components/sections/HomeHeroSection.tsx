"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import {
  ArrowRight, TrendingUp, Users, Award, BadgeCheck
} from "lucide-react"
import { PremiumButton } from "@/components/premium"
import { GradientText } from "@/components/animations"
import { cn } from "@/lib/utils"

// ── Stat item ──────────────────────────────────────────────────────────────────
interface StatItem {
  value: string
  label: string
  icon: ReactNode
  accent: "indigo" | "purple" | "pink" | "cyan" | "emerald" | "amber"
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface HomeHeroSectionProps {
  badgeText?: string
  headline?: string
  headlineHighlight?: string
  description?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  stats?: StatItem[]
  showStats?: boolean
  className?: string
}

/** HomeHeroSection — full-width hero with animated gradient text. */
export function HomeHeroSection({
  badgeText = "Join 10,000+ learners already growing their skills",
  headline = "Master Skills in",
  headlineHighlight = "5 Minutes a Day",
  description =
    "Transform your learning journey with AI-powered, bite-sized lessons that adapt to your schedule, learning style, and goals. Build lasting habits that actually stick.",
  primaryCta = { label: "Start Learning Free", href: "/sign-up" },
  secondaryCta = { label: "Sign In", href: "/sign-in" },
  stats = defaultHeroStats,
  showStats = true,
  className,
}: HomeHeroSectionProps) {
  return (
    <section className={cn("relative overflow-hidden pt-24 sm:pt-32 lg:pt-40 pb-20 sm:pb-28", className)}>
      {/* Animated gradient blobs — pure CSS keyframes */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-indigo-400/20 blur-[100px] dark:bg-indigo-500/10 animate-blob" />
        <div className="absolute top-10 -right-20 w-96 h-96 rounded-full bg-purple-400/15 blur-[120px] dark:bg-purple-500/8 animate-blob-slow" />
        <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] rounded-full bg-pink-400/10 blur-[140px] dark:bg-pink-500/5 animate-blob-slower" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle,rgba(0,0,0,0.4)1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-semibold mb-8"
            style={{ animationDelay: "0ms", animationFillMode: "backwards" }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {badgeText}
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] sm:leading-[1.05] mb-6 sm:mb-8"
            style={{ animationDelay: "80ms", animationFillMode: "backwards" }}>
            {headline}
            <br />
            <GradientText from="from-indigo-500" via="via-purple-500" to="to-pink-500">
              {headlineHighlight}
            </GradientText>
          </h1>

          {/* Description */}
          <p className="animate-fade-in-up text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mb-10 sm:mb-14"
            style={{ animationDelay: "160ms", animationFillMode: "backwards" }}>

            {description}
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 sm:mb-20"
            style={{ animationDelay: "240ms", animationFillMode: "backwards" }}>
            <Link href={primaryCta.href}>
              <PremiumButton
                variant="gradient"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="shadow-2xl shadow-indigo-500/30 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5"
              >
                {primaryCta.label}
              </PremiumButton>
            </Link>
            <Link href={secondaryCta.href}>
              <PremiumButton variant="secondary" size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5">
                {secondaryCta.label}
              </PremiumButton>
            </Link>
          </div>

          {/* Stats */}
          {showStats && (
            <div className="animate-fade-in-up grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto"
              style={{ animationDelay: "320ms", animationFillMode: "backwards" }}>
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/40 dark:border-slate-700/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ animationDelay: `${360 + i * 80}ms`, animationFillMode: "backwards" }}
                >
                  <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{stat.icon}</span>
                  <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent text-slate-900 dark:text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Default stats (const — not a function) ─────────────────────────────────────
const defaultHeroStats: StatItem[] = [
  {
    value: "10K+", label: "Active Learners",
    icon: <Users className="w-5 h-5 text-indigo-500" />, accent: "indigo",
  },
  {
    value: "500+", label: "Expert Lessons",
    icon: <Award className="w-5 h-5 text-purple-500" />, accent: "purple",
  },
  {
    value: "95%", label: "Completion Rate",
    icon: <TrendingUp className="w-5 h-5 text-pink-500" />, accent: "pink",
  },
  {
    value: "4.9★", label: "Average Rating",
    icon: <BadgeCheck className="w-5 h-5 text-amber-500" />, accent: "amber",
  },
]
