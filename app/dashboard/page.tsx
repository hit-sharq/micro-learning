import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { BookOpen, Target, Trophy, TrendingUp, Clock, Star, ArrowRight, Flame } from "lucide-react"

async function getUserStats(userId: string) {
  try {
    const [user, totalProgress, recentLessons, userAchievements, totalLessons] = await Promise.all([
      prisma.user.findUnique({
        where: { clerkId: userId },
        include: {
          _count: { select: { progress: true } },
          streaks: true,
        },
      }),
      prisma.userProgress.count({
        where: { userId, completed: true },
      }),
      prisma.userProgress.findMany({
        where: { userId },
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { lesson: { select: { title: true, estimatedDuration: true, type: true } } },
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { unlockedAt: "desc" },
        take: 3,
      }),
      prisma.lesson.count({ where: { isPublished: true } }),
    ])

    const currentStreak = user?.streaks?.currentStreak || 0
    const completionRate = totalLessons > 0 ? Math.round((totalProgress / totalLessons) * 100) : 0

    return {
      totalProgress,
      currentStreak,
      completionRate,
      recentLessons,
      achievements: userAchievements,
      dailyGoal: user?.dailyGoal || 1,
      totalLessons,
    }
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return {
      totalProgress: 0,
      currentStreak: 0,
      completionRate: 0,
      recentLessons: [],
      achievements: [],
      dailyGoal: 1,
      totalLessons: 0,
    }
  }
}

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const stats = await getUserStats(userId)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-indigo-100 text-lg">Ready to continue your learning journey?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Lessons Completed */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-3xl font-bold text-indigo-600">{stats.totalProgress}</span>
          </div>
          <p className="text-slate-600 font-medium">Lessons Completed</p>
          <p className="text-sm text-slate-500 mt-1">{stats.totalLessons - stats.totalProgress} remaining</p>
        </div>

        {/* Current Streak */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-3xl font-bold text-orange-600">{stats.currentStreak}</span>
          </div>
          <p className="text-slate-600 font-medium">Day Streak</p>
          <p className="text-sm text-slate-500 mt-1">Keep it going! 🔥</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-3xl font-bold text-emerald-600">{stats.completionRate}%</span>
          </div>
          <p className="text-slate-600 font-medium">Completion Rate</p>
          <p className="text-sm text-slate-500 mt-1">Excellent progress!</p>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-purple-600">{stats.achievements.length}</span>
          </div>
          <p className="text-slate-600 font-medium">Achievements</p>
          <p className="text-sm text-slate-500 mt-1">Unlock more rewards!</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/lessons"
          className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Browse Lessons</h3>
          <p className="text-slate-600">Discover new topics and continue learning</p>
        </Link>

        <Link
          href="/progress"
          className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">View Progress</h3>
          <p className="text-slate-600">Track your learning journey and stats</p>
        </Link>

        <Link
          href="/achievements"
          className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Achievements</h3>
          <p className="text-slate-600">View your badges and milestones</p>
        </Link>
      </div>

      {/* Recent Activity and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Recent Activity</h3>
            <Clock className="w-6 h-6 text-slate-400" />
          </div>
          <div className="space-y-4">
            {stats.recentLessons.length > 0 ? (
              stats.recentLessons.map((progress, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-lg">
                      {progress.lesson.type === "TEXT" && "📄"}
                      {progress.lesson.type === "VIDEO" && "🎥"}
                      {progress.lesson.type === "QUIZ" && "❓"}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{progress.lesson.title}</div>
                      <div className="text-sm text-slate-500">
                        {progress.completed ? "✅ Completed" : "📚 In Progress"}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 font-medium">{progress.lesson.estimatedDuration} min</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No recent activity</p>
                <Link href="/lessons" className="text-indigo-600 hover:text-indigo-700 font-semibold mt-2 inline-block">
                  Start learning now →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Recent Achievements</h3>
            <Star className="w-6 h-6 text-slate-400" />
          </div>
          <div className="space-y-4">
            {stats.achievements.length > 0 ? (
              stats.achievements.map((userAchievement, index) => {
                const achievement = userAchievement.achievement as {
                  icon?: string
                  name?: string
                  description?: string
                  points?: number
                }
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
                  >
                    <div className="text-3xl">{achievement?.icon || "🏆"}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{achievement?.name || "Achievement"}</div>
                      <div className="text-sm text-slate-600">{achievement?.description || "Great job!"}</div>
                      <div className="text-xs text-orange-600 font-semibold">+{achievement?.points || 0} points</div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No achievements yet</p>
                <Link href="/lessons" className="text-purple-600 hover:text-purple-700 font-semibold mt-2 inline-block">
                  Start earning badges →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
