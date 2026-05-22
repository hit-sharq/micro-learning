"use client"

import type { ReactNode } from "react"
import { TrendingUp, Users, Award, Target, Zap, Shield, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────
interface StatItem {
  value: string
  label: string
  icon: ReactNode
  accent: string
}

const defaultStats: StatItem[] = [
  { value: "10K+", label: "Active Learners", icon: <Users className="w-6 h-6" />, accent: "from-indigo-500 to-indigo-600" },
  { value: "500+", label: "Expert Lessons", icon: <BookOpen className="w-6 h-6" />, accent: "from-purple-500 to-purple-600" },
  { value: "95%", label: "Completion Rate", icon: <Target className="w-6 h-6" />, accent: "from-pink-500 to-pink-600" },
  { value: "4.9★", label: "User Rating", icon: <Award className="w-6 h-6" />, accent: "from-amber-400 to-amber-600" },
]

interface HomeStatsSectionProps {
  title?: string
  description?: string
  stats?: StatItem[]
  background?: "light" | "dark" | "gradient"
  className?: string
}

/** HomeStatsSection — centered stats strip with animated gradient highlights. */
export function HomeStatsSection({
  title, description, stats = defaultStats,
  background = "light", className,
}: HomeStatsSectionProps) {
  const bgMap = {
    light: "bg-white dark:bg-slate-950",
    dark: "bg-slate-950",
    gradient: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
  }
  const textColor = background === "gradient" ? "text-white" : "text-slate-900 dark:text-white"
  const mutedColor = background === "gradient" ? "text-white/70" : "text-slate-500 dark:text-slate-400"

  return (
    <section className={cn("relative py-20 sm:py-28 lg:py-32", bgMap[background], className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="text-center max-w-2xl mx-auto mb-16">
            {title && (
              <h2 className={cn("text-3xl sm:text-4xl font-extrabold tracking-tight mb-4", textColor)}>{title}</h2>
            )}
            {description && <p className={cn("text-base sm:text-lg leading-relaxed", mutedColor)}>{description}</p>}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
            >
              {/* Value */}
              <span className={cn("text-3xl sm:text-4xl xl:text-5xl font-extrabold", textColor)}>{stat.value}</span>
              {/* Label */}
              <span className={cn("text-sm font-semibold uppercase tracking-wider", mutedColor)}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
