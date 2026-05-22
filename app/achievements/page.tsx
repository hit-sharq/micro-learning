"use client"

import { useState, useEffect } from "react"
import { Trophy, Award, Sparkles, Zap, Target, Star, Flame, BookOpen, Filter } from "lucide-react"
import { PremiumBadge } from "@/components/premium"
import { cn } from "@/lib/utils"

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  type: string
  points: number
  isUnlocked: boolean
  unlockedAt?: string
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => { fetchAchievements() }, [])

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/achievements")
      const data = await res.json()
      setAchievements(data.achievements || [])
    } catch (e) { console.error("Failed to fetch achievements:", e) }
    finally { setLoading(false) }
  }

  const filtered = achievements.filter((a) => {
    if (filter === "unlocked") return a.isUnlocked
    if (filter === "locked") return !a.isUnlocked
    return true
  })

  const totalPoints = achievements.filter((a) => a.isUnlocked).reduce((s, a) => s + a.points, 0)
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length
  const streakCount = achievements.filter((a) => a.isUnlocked && a.type === "STREAK").length

  const tabs = [
    { key: "all", label: "All", count: achievements.length },
    { key: "unlocked", label: "Unlocked", count: unlockedCount },
    { key: "locked", label: "Locked", count: achievements.length - unlockedCount },
  ] as const

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">

      {/* ── Page header ───────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Achievements
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 pl-10">
          Track your learning milestones and unlock rewards
        </p>
      </div>

      {/* ── Stats strip ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Unlocked",    value: unlockedCount,   sub: `${achievements.length - unlockedCount} remaining`,     icon: Trophy,      accent: "purple" },
          { label: "Total Points",value: totalPoints,     sub: "All time",                                           icon: Award,      accent: "amber" },
          { label: "Completion", value: `${Math.round((unlockedCount / Math.max(achievements.length, 1)) * 100)}%`, sub: "of all achievements",  icon: Sparkles,   accent: "indigo" },
          { label: "Streak Badges",value: streakCount,    sub: "Maintain daily practice",                           icon: Flame,      accent: "orange" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{s.label}</span>
              <s.icon className={cn("w-4.5 h-4.5", accentIcon(s.accent))} />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ───────────────────────────────────────────── */}
      <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
              filter === tab.key
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-xs font-bold opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* ── Grid ──────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((a) => (
            <div
              key={a.id}
              className={cn(
                "group relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                a.isUnlocked
                  ? "bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-amber-50/50 dark:from-amber-500/10 dark:via-orange-500/8 dark:to-amber-500/10 border-amber-200/70 dark:border-amber-800/30"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/60 opacity-70 hover:opacity-100",
              )}
            >
              {/* Icon */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl leading-none">{a.isUnlocked ? a.icon : "🔒"}</span>
                {a.isUnlocked && a.unlockedAt && (
                  <PremiumBadge variant="success" size="sm">✓ Unlocked</PremiumBadge>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{a.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{a.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-700/50">
                <PremiumBadge variant={a.isUnlocked ? "warning" : "muted"} size="sm">{a.points} pts</PremiumBadge>
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{a.type}</span>
              </div>
              {a.isUnlocked && a.unlockedAt && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-2">
                  Earned {new Date(a.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-5xl block mb-4">🏆</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">No achievements found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your filter or start learning!</p>
        </div>
      )}
    </div>
  )
}

function accentIcon(accent: string) {
  return {
    indigo: "text-indigo-500", purple: "text-purple-500", amber: "text-amber-500",
    orange: "text-orange-500", emerald: "text-emerald-500",
  }[accent] || "text-slate-400"
}
