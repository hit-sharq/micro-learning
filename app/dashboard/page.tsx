import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import {
  BookOpen, Target, Trophy, TrendingUp, Clock, Star,
  ArrowRight, Flame, Zap, Bookmark, ChevronRight, CheckCircle2,
} from "lucide-react"

/* ═══════════════════════════════════════════════════════
   Data layer
   ═══════════════════════════════════════════════════════ */
async function getUserStats(userId: string) {
  try {
    const [user, totalProgress, recentLessons, userAchievements, totalLessons] = await Promise.all([
      prisma.user.findUnique({
        where: { clerkId: userId },
        include: { _count: { select: { progress: true } }, streaks: true },
      }),
      prisma.userProgress.count({ where: { userId, completed: true } }),
      prisma.userProgress.findMany({
        where: { userId }, take: 5, orderBy: { updatedAt: "desc" },
        include: { lesson: { select: { title: true, estimatedDuration: true, type: true } } },
      }),
      prisma.userAchievement.findMany({
        where: { userId }, include: { achievement: true }, orderBy: { unlockedAt: "desc" }, take: 3,
      }),
      prisma.lesson.count({ where: { isPublished: true } }),
    ])

    const currentStreak = user?.streaks?.currentStreak || 0
    const completionRate = totalLessons > 0 ? Math.round((totalProgress / totalLessons) * 100) : 0

    return { totalProgress, currentStreak, completionRate, recentLessons, achievements: userAchievements, dailyGoal: user?.dailyGoal || 1, totalLessons }
  } catch {
    return { totalProgress: 0, currentStreak: 0, completionRate: 0, recentLessons: [], achievements: [], dailyGoal: 1, totalLessons: 0 }
  }
}

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */
function lessonIcon(type: string) {
  if (type === "VIDEO") return "🎥"
  if (type === "QUIZ") return "❓"
  return "📄"
}

function StatCard({
  label, value, sub, accent, icon: Icon,
  bg, fg,
}: {
  label: string; value: string | number; sub: string
  accent: string; icon: React.ElementType
  bg: string; fg: string
}) {
  return (
    <div className="group relative rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 hover:border-indigo-300/60 dark:hover:border-indigo-700/40 hover:shadow-xl hover:shadow-indigo-500/8 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${fg}`} />
        </div>
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value}</span>
      </div>
      <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
  )
}

function QuickAction({
  href, title, description, icon: Icon, accent, arrow,
}: {
  href: string; title: string; description: string
  icon: React.ElementType; accent: string; arrow: string
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl p-7 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 hover:border-indigo-300/60 dark:hover:border-indigo-700/40 hover:shadow-xl hover:shadow-indigo-500/8 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="flex items-center justify-between mb-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${accentBg(accent)}`}>
          <Icon className="w-5.5 h-5.5 text-white" />
        </div>
        <ChevronRight className={`w-5 h-5 ${arrow} group-hover:translate-x-1 transition-transform duration-200`} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </Link>
  )
}

function accentBg(accent: string) {
  const map: Record<string, string> = {
    "from-indigo-500 to-indigo-600": "bg-gradient-to-br from-indigo-500 to-indigo-600",
    "from-purple-500 to-pink-500": "bg-gradient-to-br from-purple-500 to-pink-500",
    "from-emerald-500 to-teal-500": "bg-gradient-to-br from-emerald-500 to-teal-500",
    "from-amber-400 to-orange-500": "bg-gradient-to-br from-amber-400 to-orange-500",
  }
  return map[accent] || "bg-gradient-to-br from-indigo-500 to-indigo-600"
}

/* ═══════════════════════════════════════════════════════
   Dashboard page
   ═══════════════════════════════════════════════════════ */
export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const stats = await getUserStats(userId)

  return (
    <div className="space-y-8">

      {/* ── Welcome banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-indigo-500/20">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-purple-400 blur-[100px]" />
          <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-indigo-400 blur-[80px]" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-1.5">
              Welcome back
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Ready to crush today&apos;s goals? 🔥
            </h1>
            <p className="mt-2 text-white/70 text-sm sm:text-base max-w-md">
              {stats.currentStreak > 0
                ? `You're on a ${stats.currentStreak}-day streak. Keep the momentum going!`
                : "Pick up where you left off — a new lesson is waiting."}
            </p>
          </div>
          {stats.currentStreak > 0 && (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-semibold">
              <Flame className="w-4 h-4 text-amber-300" />
              {stats.currentStreak} day streak
            </div>
          )}
        </div>
      </div>

      {/* ── Stats grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Lessons Completed"
          value={stats.totalProgress}
          sub={`${stats.totalLessons - stats.totalProgress} remaining`}
          accent="from-indigo-500 to-purple-500"
          icon={BookOpen}
          bg="bg-indigo-50 dark:bg-indigo-500/15"
          fg="text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          label="Current Streak"
          value={`${stats.currentStreak}d`}
          sub="Keep it going!"
          accent="from-orange-400 to-amber-500"
          icon={Flame}
          bg="bg-orange-50 dark:bg-orange-500/15"
          fg="text-orange-600 dark:text-orange-400"
        />
        <StatCard
          label="Completion Rate"
          value={`${stats.completionRate}%`}
          sub="Of all lessons"
          accent="from-emerald-400 to-teal-500"
          icon={Target}
          bg="bg-emerald-50 dark:bg-emerald-500/15"
          fg="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Achievements"
          value={stats.achievements.length}
          sub="Unlocked rewards"
          accent="from-purple-400 to-pink-500"
          icon={Trophy}
          bg="bg-purple-50 dark:bg-purple-500/15"
          fg="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* ── Quick Actions ───────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            href="/lessons"
            title="Browse Lessons"
            description="Discover new topics and skills"
            icon={BookOpen}
            accent="from-indigo-500 to-indigo-600"
            arrow="text-slate-400 group-hover:text-indigo-500"
          />
          <QuickAction
            href="/progress"
            title="View Progress"
            description="Track your learning journey"
            icon={TrendingUp}
            accent="from-emerald-500 to-teal-500"
            arrow="text-slate-400 group-hover:text-emerald-500"
          />
          <QuickAction
            href="/achievements"
            title="Achievements"
            description="View badges and milestones"
            icon={Trophy}
            accent="from-purple-500 to-pink-500"
            arrow="text-slate-400 group-hover:text-purple-500"
          />
          <QuickAction
            href="/bookmarks"
            title="Bookmarks"
            description="Continue saved lessons"
            icon={Bookmark}
            accent="from-amber-400 to-orange-500"
            arrow="text-slate-400 group-hover:text-amber-500"
          />
        </div>
      </div>

      {/* ── Two-column: Activity + Achievements ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="px-7 py-5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-indigo-500" />
              Recent Activity
            </h3>
            <Link href="/lessons" className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {stats.recentLessons.length > 0 ? (
              stats.recentLessons.map((progress, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-7 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0">
                      {lessonIcon(progress.lesson.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{progress.lesson.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {progress.completed
                          ? <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>
                          : "In Progress"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400 shrink-0 ml-3">{progress.lesson.estimatedDuration}m</span>
                </div>
              ))
            ) : (
              <div className="px-7 py-14 text-center">
                <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium mb-3">No recent activity</p>
                <Link href="/lessons" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Start learning now →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="px-7 py-5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4.5 h-4.5 text-amber-400" />
              Recent Achievements
            </h3>
            <Link href="/achievements" className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {stats.achievements.length > 0 ? (
              stats.achievements.map((ua, i) => {
                const a = ua.achievement as { icon?: string; name?: string; description?: string; points?: number }
                return (
                  <div key={i} className="flex items-center gap-4 px-7 py-4 hover:bg-amber-50/40 dark:hover:bg-amber-500/5 transition-colors">
                    <span className="text-2xl leading-none">{a.icon || "🏆"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{a.name || "Achievement"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{a.description || "Great job!"}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-500 shrink-0">+{a.points || 0}pts</span>
                  </div>
                )
              })
            ) : (
              <div className="px-7 py-14 text-center">
                <Trophy className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium mb-3">No achievements yet</p>
                <Link href="/lessons" className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                  Start earning badges →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Daily Goal pill ─────────────────────────────────── */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200/50 dark:border-indigo-800/30">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Daily Goal: <span className="text-indigo-600 dark:text-indigo-400">{stats.dailyGoal} lesson{stats.dailyGoal !== 1 ? "s" : ""}/day</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">You&apos;ve completed {stats.totalProgress} so far this week.</p>
        </div>
        <Link href="/lessons">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors">
            Continue
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

    </div>
  )
}
