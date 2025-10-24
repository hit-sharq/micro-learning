import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import BackButton from "@/app/lessons/BackButton"
import "./progress.css"

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
    <div className="progress-page">
      <div className="progress-container">
        {/* Header */}
        <div className="progress-header">
          <BackButton />
          <h1 className="progress-title">Your Learning Progress</h1>
          <p className="progress-subtitle">Track your journey and celebrate your achievements</p>
        </div>

        {/* Overall Stats */}
        <div className="progress-stats-grid">
          <div className="progress-stat-card">
            <div className="progress-stat-value">{data.overallStats.completedLessons}</div>
            <div className="progress-stat-label">Lessons Completed</div>
          </div>
          <div className="progress-stat-card">
            <div className="progress-stat-value">{data.overallStats.averageScore}%</div>
            <div className="progress-stat-label">Average Score</div>
          </div>
          <div className="progress-stat-card">
            <div className="progress-stat-value">
              {Math.floor(data.overallStats.timeSpent / 60)}h {data.overallStats.timeSpent % 60}m
            </div>
            <div className="progress-stat-label">Time Spent Learning</div>
          </div>
          <div className="progress-stat-card">
            <div className="progress-stat-value">{data.overallStats.currentStreak} 🔥</div>
            <div className="progress-stat-label">Current Streak</div>
          </div>
        </div>

        {/* Category Progress */}
        {data.categoryProgress.length > 0 && (
          <div className="progress-section-card">
            <h3 className="progress-section-title">Progress by Category</h3>
            <div className="progress-category-list">
              {data.categoryProgress.map((category) => (
                <div key={category.name} className="progress-category-item">
                  <div className="progress-category-header">
                    <span className="progress-category-name">{category.name}</span>
                    <span className="progress-category-stats">
                      {category.completed}/{category.total} • {category.avgScore}% avg
                    </span>
                  </div>
                  <div className="progress-category-bar">
                    <div
                      className="progress-category-fill"
                      style={{ width: `${(category.completed / category.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="progress-section-card">
          <h3 className="progress-section-title">Recent Activity (Last 7 Days)</h3>
          <div className="progress-activity-list">
            {data.recentActivity.map((day) => (
              <div key={day.date} className="progress-activity-item">
                <div className="progress-activity-info">
                  <div className="progress-activity-date">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="progress-activity-details">
                    {day.lessonsCompleted} lessons • {day.timeSpent} min
                  </div>
                </div>
                <div className="progress-activity-dots">
                  {Array.from({ length: Math.min(day.lessonsCompleted, 5) }).map((_, i) => (
                    <div key={i} className="progress-activity-dot"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="progress-section-card">
          <h3 className="progress-section-title">Achievements</h3>
          <div className="progress-achievements-grid">
            {data.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`progress-achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
              >
                <span className="progress-achievement-icon">{achievement.earned ? "🏆" : "🔒"}</span>
                <h4 className="progress-achievement-title">{achievement.title}</h4>
                <p className="progress-achievement-description">{achievement.description}</p>
                {achievement.earned && achievement.date && (
                  <p className="progress-achievement-date">Earned {new Date(achievement.date).toLocaleDateString()}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="progress-actions">
          <Link href="/lessons" className="progress-action-button primary">
            Continue Learning
          </Link>
          <Link href="/dashboard" className="progress-action-button secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
