import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

async function getDashboardData(userId: string) {
  try {
    // Get user data
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
      },
    })

    if (!user) {
      // Create user if doesn't exist
      const newUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: "user@example.com", // This should come from Clerk
          name: "User",
        },
      })

      // Create initial streak
      await prisma.userStreak.create({
        data: {
          userId: userId,
          currentStreak: 0,
          longestStreak: 0,
        },
      })

      return {
        user: {
          name: newUser.name,
          totalLessons: 0,
          completedLessons: 0,
          currentStreak: 0,
          longestStreak: 0,
        },
        recentLessons: [],
        categories: [],
      }
    }

    const completedLessons = user.progress.filter((p) => p.completed).length
    const totalLessons = await prisma.lesson.count({ where: { isPublished: true } })

    // Get recent lessons
    const recentLessons = user.progress.slice(-3).map((p) => ({
      id: p.lesson.id,
      title: p.lesson.title,
      completed: p.completed,
      score: p.score,
    }))

    // Get category progress
    const categories = await prisma.category.findMany({
      include: {
        lessons: {
          where: { isPublished: true },
          include: {
            progress: {
              where: { userId: userId },
            },
          },
        },
      },
    })

    const categoryProgress = categories.map((category) => {
      const totalCategoryLessons = category.lessons.length
      const completedCategoryLessons = category.lessons.filter((lesson) =>
        lesson.progress.some((p) => p.completed),
      ).length

      return {
        id: category.id,
        name: category.name,
        progress: totalCategoryLessons > 0 ? Math.round((completedCategoryLessons / totalCategoryLessons) * 100) : 0,
        color: category.color,
      }
    })

    return {
      user: {
        name: user.name,
        totalLessons,
        completedLessons,
        currentStreak: user.streaks?.currentStreak || 0,
        longestStreak: user.streaks?.longestStreak || 0,
      },
      recentLessons,
      categories: categoryProgress,
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return {
      user: {
        name: "User",
        totalLessons: 0,
        completedLessons: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
      recentLessons: [],
      categories: [],
    }
  }
}

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const data = await getDashboardData(userId)

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Welcome Section */}
      <div className="dashboard-header">
        <h1>Welcome back, {data.user.name}! 👋</h1>
        <p>Ready to continue your learning journey?</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{data.user.completedLessons}</div>
          <div className="stat-label">Lessons Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.user.currentStreak}</div>
          <div className="stat-label">Day Streak 🔥</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {data.user.totalLessons > 0 ? Math.round((data.user.completedLessons / data.user.totalLessons) * 100) : 0}%
          </div>
          <div className="stat-label">Overall Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.user.longestStreak}</div>
          <div className="stat-label">Longest Streak</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <div className="action-card">
          <h3>Continue Learning</h3>
          <p>Pick up where you left off</p>
          <Link href="/lessons" className="btn btn-primary">
            Browse Lessons
          </Link>
        </div>

        <div className="action-card">
          <h3>Daily Challenge</h3>
          <p>Complete today's challenge to maintain your streak</p>
          <Link href="/challenge" className="btn btn-success">
            Take Challenge
          </Link>
        </div>
      </div>

      {/* Progress by Category */}
      {data.categories.length > 0 && (
        <div className="progress-card">
          <div className="card-header">
            <h3>Learning Progress</h3>
          </div>

          <div className="progress-list">
            {data.categories.map((category) => (
              <div key={category.id} className="progress-item">
                <div className="progress-info">
                  <span className="progress-name">{category.name}</span>
                  <span className="progress-percent">{category.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${category.progress}%`,
                      background: `linear-gradient(90deg, ${category.color}, ${category.color}aa)`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {data.recentLessons.length > 0 && (
        <div className="recent-card">
          <div className="card-header">
            <h3>Recent Lessons</h3>
          </div>

          <div className="recent-list">
            {data.recentLessons.map((lesson) => (
              <div key={lesson.id} className="recent-item">
                <div className="recent-info">
                  <div className={`recent-status ${lesson.completed ? "completed" : "pending"}`}></div>
                  <span className="recent-title">{lesson.title}</span>
                </div>
                <div className="recent-actions">
                  {lesson.completed && lesson.score && <span className="badge badge-success">{lesson.score}%</span>}
                  <Link href={`/lessons/${lesson.id}`} className="btn btn-secondary btn-sm">
                    {lesson.completed ? "Review" : "Continue"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
