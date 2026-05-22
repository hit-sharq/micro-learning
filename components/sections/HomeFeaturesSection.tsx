"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { BookOpen, Target, Trophy, Zap, ShieldCheck, Sparkles } from "lucide-react"
import { PremiumButton } from "@/components/premium"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────────
interface FeatureItem {
  icon: ReactNode
  title: string
  description: string
  gradientFrom: string
  gradientTo: string
}

const defaultFeatures: FeatureItem[] = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "AI-Powered Personalization",
    description: "Our intelligent system adapts to your learning style, pace, and goals, creating a unique experience just for you.",
    gradientFrom: "indigo-500", gradientTo: "purple-500",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Bite-Sized Learning",
    description: "Master complex topics through focused 5-minute sessions that fit your schedule.",
    gradientFrom: "purple-500", gradientTo: "pink-500",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Gamified Progress",
    description: "Stay motivated with achievements, streaks, and progress tracking that keeps you engaged.",
    gradientFrom: "pink-500", gradientTo: "amber-400",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Science-Backed Approach",
    description: "Our methods are grounded in cognitive science, ensuring maximum retention and growth.",
    gradientFrom: "emerald-500", gradientTo: "teal-500",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Smart Recommendations",
    description: "Personalized lesson paths powered by adaptive AI algorithms that learn with you.",
    gradientFrom: "amber-400", gradientTo: "orange-500",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Expert Crafted Content",
    description: "Learn from industry leaders with lessons built by experts who care about your success.",
    gradientFrom: "blue-500", gradientTo: "indigo-500",
  },
]

interface HomeFeaturesSectionProps {
  title?: string
  description?: string
  features?: FeatureItem[]
  customBackground?: string
  className?: string
}

/** HomeFeaturesSection — reusable feature grid. */
export function HomeFeaturesSection({
  title = "Why Choose Microlearning Coach?",
  description = "Our platform combines cutting-edge AI with proven learning science to deliver personalized education that fits your life.",
  features = defaultFeatures,
  customBackground,
  className,
}: HomeFeaturesSectionProps) {
  return (
    <section className={cn("relative overflow-hidden", customBackground ?? "bg-white dark:bg-slate-950", className)}>
      {/* Mesh gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.07)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.05)_0%,transparent_60%)] -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6 ring-1 ring-indigo-200/50 dark:ring-indigo-500/20">
            <Sparkles className="w-4 h-4" />
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">{title}</h2>
          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">{description}</p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative h-full p-7 sm:p-8 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/8 hover:border-indigo-200/60 dark:hover:border-indigo-500/30 overflow-hidden">
                {/* Top accent bar — shows on hover */}
                <div
                  className={cn(
                    "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    feature.gradientFrom === "indigo-500" && "from-indigo-500 to-purple-500",
                    feature.gradientFrom === "purple-500" && "from-purple-500 to-pink-500",
                    feature.gradientFrom === "pink-500" && "from-pink-500 to-amber-400",
                    feature.gradientFrom === "emerald-500" && "from-emerald-500 to-teal-500",
                    feature.gradientFrom === "amber-400" && "from-amber-400 to-orange-500",
                    feature.gradientFrom === "blue-500" && "from-blue-500 to-indigo-500",
                  )}
                />

                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                    feature.gradientFrom === "indigo-500" && "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-indigo-500/30",
                    feature.gradientFrom === "purple-500" && "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-500/30",
                    feature.gradientFrom === "pink-500" && "bg-gradient-to-br from-pink-500 to-amber-400 text-white shadow-pink-500/30",
                    feature.gradientFrom === "emerald-500" && "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/30",
                    feature.gradientFrom === "amber-400" && "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-400/30",
                    feature.gradientFrom === "blue-500" && "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-blue-500/30",
                  )}
                >
                  {feature.icon}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5 leading-snug">{feature.title}</h3>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
