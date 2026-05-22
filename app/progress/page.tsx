import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import {
  BookOpen, Target, Clock, Flame, TrendingUp, Trophy,
  ArrowRight, Zap, Calendar, Award, CheckCircle2, Star,
} from "lucide-react"
import { PremiumBadge, BackButton } from "@/components/premium"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

/* ═══════════════════════════ Data Fetching ═══════════════════════════ */
async function getProgressData(userId: string) {
  // Get user's progress records with lesson data
  const userProgress = await prisma.userProgress.findMany({
    where: { userId },
    include: { lesson: { include: { category: true } } },
  })

  // Get total lessons count
  const totalLessons = await prisma.lesson.count({
    where: { isPublished: true },
  })

  // Calculate overall stats
  const completed = userProgress.filter((p) => p.completed).length
  const scores = userProgress.filter((p) => p.score !== null).map((p) => p.score!)
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const timeMins = Math.round(
    (userProgress.reduce((acc, p) => acc + (p.timeSpent || 0), 0) || 0) / 60
  )

  // Get streak data
  const streakData = await prisma.userStreak.findUnique({
    where: { userId },
  })
  const streak = streakData?.currentStreak || 0
  const longestStreak = streakData?.longestStreak || 0

  // Category progress
  const categoryMap = new Map<string, { name: string; color: string; completed: number; total: number; scores: number[] }>()
  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    include: { category: true },
  })

  for (const lesson of lessons) {
    const cat = lesson.category
    if (!categoryMap.has(cat.name)) {
      categoryMap.set(cat.name, { name: cat.name, color: cat.color, completed: 0, total: 0, scores: [] })
    }
    const entry = categoryMap.get(cat.name)!
    entry.total++
    const progress = userProgress.find((p) => p.lessonId === lesson.id)
    if (progress?.completed) {
      entry.completed++
      if (progress.score !== null) entry.scores.push(progress.score)
    }
  }

  const categoryProgress = Array.from(categoryMap.values()).map((cat) => ({
    ...cat,
    avg: cat.scores.length > 0 ? Math.round(cat.scores.reduce((a, b) => a + b, 0) / cat.scores.length) : 0,
  }))

  // Recent activity (last 7 days)
  const today = new Date()
  const recentActivity = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    const dayStart = new Date(dateStr)
    const dayEnd = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() + 1))

    const dayProgress = await prisma.userProgress.count({
      where: {
        userId,
        completedAt: { gte: dayStart, lt: dayEnd },
      },
    })
    recentActivity.push({
      date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      lessons: dayProgress,
      max: 5, // max expected per day
    })
  }

  // Achievements
  const allAchievements = await prisma.achievement.findMany({ where: { isActive: true } })
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
  })
  const earnedIds = new Set(userAchievements.map((ua) => ua.achievementId))

  const achievements = allAchievements.map((a) => {
    const ua = userAchievements.find((u) => u.achievementId === a.id)
    return {
      id: a.id,
      title: a.name,
      description: a.description,
      earned: earnedIds.has(a.id),
      earnedDate: ua?.unlockedAt?.toLocaleDateString(),
    }
  })

  return {
    overallStats: { completed, totalLessons, avgScore, timeMins, streak, longestStreak },
    categoryProgress,
    recentActivity,
    achievements,
  }
}

/* ═══════════════════════════ Page ═══════════════════════════ */
export default async function ProgressPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const data = await getProgressData(userId)
  const { overallStats, categoryProgress, recentActivity, achievements } = data

  return (
    <div className="space-y-8 relative">

      {/* ── Page header ───────────────────────────────────────── */}
      <div className="absolute -top-2 left-0"><BackButton href="/dashboard" label="Dashboard" /></div>
      <div className="pt-12 flex items-center gap-3">
        <TrendingUp className="w-7 h-7 text-indigo-500" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Your Progress</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track your journey and celebrate every milestone
          </p>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Completed", value: overallStats.completed, sub: `of ${overallStats.totalLessons} lessons`, icon: CheckCircle2, accent: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-500/15", fg: "text-emerald-600 dark:text-emerald-400" },
          { label: "Avg Score", value: `${overallStats.avgScore}%`, sub: "across all quizzes", icon: Target, accent: "from-indigo-500 to-purple-500", bg: "bg-indigo-50 dark:bg-indigo-500/15", fg: "text-indigo-600 dark:text-indigo-400" },
          { label: "Time Invested", value: `${Math.floor(overallStats.timeMins / 60)}h ${overallStats.timeMins % 60}m`, sub: "total learning time", icon: Clock, accent: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-500/15", fg: "text-blue-600 dark:text-blue-400" },
          { label: "Current Streak", value: `${overallStats.streak}🔥`, sub: `best: ${overallStats.longestStreak} days`, icon: Flame, accent: "from-orange-400 to-amber-500", bg: "bg-orange-50 dark:bg-orange-500/15", fg: "text-orange-600 dark:text-orange-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}><s.icon className={cn("w-5 h-5", s.fg)} /></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{s.label}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-none mb-1">{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Category progress ─────────────────────────────────── */}
      {categoryProgress.length > 0 && (
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> Progress by Category
          </h2>
          <div className="space-y-5">
            {categoryProgress.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{cat.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{cat.completed}/{cat.total} • {cat.avg}% avg</span>
                </div>
                <Progress value={(cat.completed / (cat.total || 1)) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Activity heat-map style ───────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 p-6 sm:p-8">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" /> Last 7 Days
        </h2>
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {recentActivity.map((day) => {
            const intensity = day.max > 0 ? day.lessons / day.max : 0
            const bg = intensity === 0
              ? "bg-slate-100 dark:bg-slate-800"
              : intensity <= 0.25
                ? "bg-emerald-200 dark:bg-emerald-900/40"
                : intensity <= 0.5
                  ? "bg-emerald-400 dark:bg-emerald-700/50"
                  : intensity <= 0.75
                    ? "bg-emerald-500 dark:bg-emerald-600/60"
                    : "bg-emerald-600 dark:bg-emerald-500/70"
            return (
              <div key={day.date} className="flex flex-col items-center gap-2">
                <div className={cn("w-full aspect-square rounded-xl transition-all", bg)} />
                <span className="text-[10px] font-medium text-slate-400 leading-none">{day.date.split(" ")[0]}</span>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 leading-none">{day.lessons}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Achievements ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 p-6 sm:p-8">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={cn(
                "flex flex-col items-center text-center gap-2.5 p-4 rounded-2xl border transition-all duration-300",
                a.earned
                  ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border-amber-200/60 dark:border-amber-800/40"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/60 opacity-60 hover:opacity-100",
              )}
            >
              <span className="text-2xl">{a.earned ? "🏆" : "🔒"}</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{a.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{a.description}</p>
              {a.earned && a.earnedDate && (
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">{a.earnedDate}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA row ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link href="/lessons" className="w-full sm:w-auto">
          <span className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer">
            <Zap className="w-4 h-4" /> Continue Learning
          </span>
        </Link>
        <Link href="/dashboard" className="w-full sm:w-auto">
          <span className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            Back to Dashboard
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

    </div>
  )
}
