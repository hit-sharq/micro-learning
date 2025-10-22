import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import BackButton from "@/app/lessons/BackButton"

async function getProgressData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        progress: {
          include: {
            lesson: {
              include: {
                category: true,
              },
            },
          },
        },
        streaks: true,
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    })

    if (!user) {
      return {
        overallStats: {
          totalLessons: 0,
          completedLessons: 0,
          averageScore: 0,
          timeSpent: 0,
          currentStreak: 0,
          longestStreak: 0,
        },
        categoryProgress: [],
        recentActivity: [],
        achievements: [],
      }
    }

    const completedProgress = user.progress.filter((p) => p.completed)
    const totalLessons = await prisma.lesson.count({ where: { isPublished: true } })
    const averageScore =
      completedProgress.length > 0
        ? Math.round(completedProgress.reduce((sum, p) => sum + (p.score || 0), 0) / completedProgress.length)
        : 0
    const totalTimeSpent = user.progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0)

    // Get category progress
    const categories = await prisma.category.findMany({
      include: {
        lessons: {
          where: { isPublished: true },
          include: {
            progress: {
              where: { userId },
            },
          },
        },
      },
    })

    const categoryProgress = categories
      .map((category) => {
        const totalCategoryLessons = category.lessons.length
        const completedCategoryLessons = category.lessons.filter((lesson) =>
          lesson.progress.some((p) => p.completed),
        ).length
        const categoryScores = category.lessons
          .flatMap((lesson) => lesson.progress.filter((p) => p.completed && p.score))
          .map((p) => p.score!)
        const avgScore =
          categoryScores.length > 0
            ? Math.round(categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length)
            : 0

        return {
          name: category.name,
          completed: completedCategoryLessons,
          total: totalCategoryLessons,
          avgScore,
        }
      })
      .filter((cat) => cat.total > 0)

    // Get recent activity (last 7 days)
    const recentActivity = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const dayProgress = user.progress.filter(
        (p) => p.completedAt && p.completedAt >= dayStart && p.completedAt <= dayEnd && p.completed,
      )

      const timeSpent = dayProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0)

      recentActivity.push({
        date: dayStart.toISOString().split("T")[0],
        lessonsCompleted: dayProgress.length,
        timeSpent: Math.round(timeSpent / 60),
      })
    }

    // Format achievements
    const achievements = [
      {
        id: 1,
        title: "First Steps",
        description: "Complete your first lesson",
        earned: completedProgress.length > 0,
        date: completedProgress.length > 0 ? completedProgress[0].completedAt?.toISOString().split("T")[0] : null,
      },
      {
        id: 2,
        title: "Week Warrior",
        description: "Maintain a 7-day streak",
        earned: (user.streaks?.currentStreak || 0) >= 7,
        date: (user.streaks?.currentStreak || 0) >= 7 ? new Date().toISOString().split("T")[0] : null,
      },
      {
        id: 3,
        title: "Quiz Master",
        description: "Score 90%+ on 5 quizzes",
        earned: completedProgress.filter((p) => (p.score || 0) >= 90).length >= 5,
        date:
          completedProgress.filter((p) => (p.score || 0) >= 90).length >= 5
            ? new Date().toISOString().split("T")[0]
            : null,
      },
      {
        id: 4,
        title: "Speed Learner",
        description: "Complete 10 lessons in one day",
        earned: false,
        date: null,
      },
      {
        id: 5,
        title: "Perfect Score",
        description: "Get 100% on any quiz",
        earned: completedProgress.some((p) => p.score === 100),
        date:
          completedProgress
            .find((p) => p.score === 100)
            ?.completedAt?.toISOString()
            .split("T")[0] || null,
      },
    ]

    return {
      overallStats: {
        totalLessons,
        completedLessons: completedProgress.length,
        averageScore,
        timeSpent: Math.round(totalTimeSpent / 60),
        currentStreak: user.streaks?.currentStreak || 0,
        longestStreak: user.streaks?.longestStreak || 0,
      },
      categoryProgress,
      recentActivity,
      achievements,
    }
  } catch (error) {
    console.error("Error fetching progress data:", error)
    return {
      overallStats: {
        totalLessons: 0,
        completedLessons: 0,
        averageScore: 0,
        timeSpent: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
      categoryProgress: [],
      recentActivity: [],
      achievements: [],
    }
  }
}

export default async function ProgressPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const data = await getProgressData(userId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <BackButton />
        <h1 className="text-4xl font-bold text-slate-900 mt-4 mb-2">Your Learning Progress</h1>
        <p className="text-lg text-slate-600">Track your journey and celebrate your achievements</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
          <div className="text-3xl font-bold text-indigo-600 mb-2">{data.overallStats.completedLessons}</div>
          <div className="text-slate-600 font-medium">Lessons Completed</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
          <div className="text-3xl font-bold text-emerald-600 mb-2">{data.overallStats.averageScore}%</div>
          <div className="text-slate-600 font-medium">Average Score</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {Math.floor(data.overallStats.timeSpent / 60)}h {data.overallStats.timeSpent % 60}m
          </div>
          <div className="text-slate-600 font-medium">Time Spent Learning</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
          <div className="text-3xl font-bold text-orange-600 mb-2">{data.overallStats.currentStreak} 🔥</div>
          <div className="text-slate-600 font-medium">Current Streak</div>
        </div>
      </div>

      {/* Category Progress */}
      {data.categoryProgress.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Progress by Category</h3>
          <div className="space-y-6">
            {data.categoryProgress.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-slate-900">{category.name}</span>
                  <span className="text-sm text-slate-600">
                    {category.completed}/{category.total} • {category.avgScore}% avg
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(category.completed / category.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity (Last 7 Days)</h3>
        <div className="space-y-3">
          {data.recentActivity.map((day) => (
            <div
              key={day.date}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
            >
              <div>
                <div className="font-semibold text-slate-900">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm text-slate-600">
                  {day.lessonsCompleted} lessons • {day.timeSpent} min
                </div>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(day.lessonsCompleted, 5) }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-6 rounded-2xl text-center border-2 transition-all ${
                achievement.earned
                  ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300"
                  : "bg-slate-50 border-slate-200 opacity-60"
              }`}
            >
              <div className="text-5xl mb-4">{achievement.earned ? "🏆" : "🔒"}</div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{achievement.title}</h4>
              <p className="text-sm text-slate-600 mb-4">{achievement.description}</p>
              {achievement.earned && achievement.date && (
                <p className="text-xs text-slate-500">Earned {new Date(achievement.date).toLocaleDateString()}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          href="/lessons"
          className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all font-semibold text-center"
        >
          Continue Learning
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 bg-slate-200 text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-300 transition-all font-semibold text-center"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
