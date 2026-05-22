import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import {
  BookOpen, Target, Clock, Flame, TrendingUp, Trophy,
  ArrowRight, Zap, Calendar, Award, CheckCircle2, Star,
} from "lucide-react"
import { PremiumBadge } from "@/components/premium"
import { cn } from "@/lib/utils"

/* ═══════════════════════════ Data ═══════════════════════════ */
async function getProgressData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        progress: {
          include: { lesson: { include: { category: true } } },
        },
        streaks: true,
        achievements: { include: { achievement: true } },
      },
    })
    if (!user) return emptyProgress()

    const completedProgress = user.progress.filter((p: any) => p.completed)
    const totalLessons = await prisma.lesson.count({ where: { isPublished: true } })
    const avgScore = completedProgress.length
      ? Math.round(completedProgress.reduce((s: number, p: any) => s + (p.score || 0), 0) / completedProgress.length)
      : 0
    const timeSpentMins = Math.round(user.progress.reduce((s: number, p: any) => s + (p.timeSpent || 0), 0) / 60)

    const categories = await prisma.category.findMany({
      include: {
        lessons: {
          where: { isPublished: true },
          include: { progress: { where: { userId } } },
        },
      },
    })
    const categoryProgress = categories
      .map((cat: any) => {
        const total = cat.lessons.length
        const completed = cat.lessons.filter((l: any) => l.progress.some((p: any) => p.completed)).length
        const scores = cat.lessons.flatMap((l: any) => l.progress.filter((p: any) => p.completed && p.score).map((p: any) => p.score))
        const avg = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0
        return { name: cat.name, color: cat.color, completed, total, avg }
      })
      .filter((c: any) => c.total > 0)

    const recentActivity = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      const start = new Date(d.setHours(0, 0, 0, 0))
      const end   = new Date(d.setHours(23, 59, 59, 999))
      const dayProg = user.progress.filter((p: any) => p.completedAt && p.completedAt >= start && p.completedAt <= end && p.completed)
      return {
        date: start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        lessons: dayProg.length,
        mins: Math.round(dayProg.reduce((s: number, p: any) => s + (p.timeSpent || 0), 0) / 60),
        max: Math.max(...Array.from({ length: 7 }, (_, j) => {
          const dx = new Date(); dx.setDate(dx.getDate() - (6 - j))
          const sx = new Date(dx.setHours(0,0,0,0)); const ex = new Date(dx.setHours(23,59,59,999))
          return user.progress.filter((p: any) => p.completedAt && p.completedAt >= sx && p.completedAt <= ex && p.completed).length
        }), 1),
      }
    })

    const achievements = [
      { id: 1, title: "First Steps", description: "Complete your first lesson", earned: completedProgress.length > 0, earnedDate: completedProgress[0]?.completedAt ? new Date(completedProgress[0].completedAt).toLocaleDateString() : null },
      { id: 2, title: "Week Warrior", description: "Maintain a 7-day streak", earned: (user.streaks?.currentStreak || 0) >= 7, earnedDate: null },
      { id: 3, title: "Quiz Master", description: "Score 90%+ on 5 quizzes", earned: completedProgress.filter((p: any) => (p.score || 0) >= 90).length >= 5, earnedDate: null },
      { id: 4, title: "Perfect Score", description: "Get 100% on any quiz", earned: completedProgress.some((p: any) => p.score === 100), earnedDate: completedProgress.find((p: any) => p.score === 100)?.completedAt ? new Date(completedProgress.find((p: any) => p.score === 100)!.completedAt!).toLocaleDateString() : null },
      { id: 5, title: "Speed Learner", description: "Complete 10 lessons in one day", earned: false, earnedDate: null },
      { id: 6, title: "Dedicated", description: "Complete 50 lessons total", earned: completedProgress.length >= 50, earnedDate: null },
    ]

    return { overallStats: { totalLessons, completed: completedProgress.length, avgScore, timeMins: timeSpentMins, streak: user.streaks?.currentStreak || 0, longestStreak: user.streaks?.longestStreak || 0 }, categoryProgress, recentActivity, achievements }
  } catch {
    return emptyProgress()
  }
}

function emptyProgress() {
  return {
    overallStats: { totalLessons: 0, completed: 0, avgScore: 0, timeMins: 0, streak: 0, longestStreak: 0 },
    categoryProgress: [], recentActivity: [], achievements: [],
  }
}

/* ═══════════════════════════ Helpers ═══════════════════════════ */
function ProgressBar({ value, max, color = "indigo" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500", purple: "bg-purple-500", pink: "bg-pink-500",
    emerald: "bg-emerald-500", amber: "bg-amber-400", blue: "bg-blue-500",
  }
  return (
    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden w-full">
      <div className={cn("h-full rounded-full transition-all duration-500", colorMap[color] || colorMap.indigo)} style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ═══════════════════════════ Page ═══════════════════════════ */
export default async function ProgressPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const data = await getProgressData(userId)
  const { overallStats, categoryProgress, recentActivity, achievements } = data

  return (
    <div className="space-y-8">

      {/* ── Page header ───────────────────────────────────────── */}
      <div className="flex items-center gap-3">
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
                <ProgressBar value={cat.completed} max={cat.total || 1} color={cat.name === "React" ? "purple" : cat.name === "JavaScript" ? "amber" : "indigo"} />
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
