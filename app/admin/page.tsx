import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

async function getAdminStats() {
  try {
    const [
      totalUsers,
      activeUsers,
      totalLessons,
      publishedLessons,
      totalProgress,
      completedLessons,
      totalStreaks,
      activeStreaks,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
      prisma.lesson.count(),
      prisma.lesson.count({ where: { isPublished: true } }),
      prisma.userProgress.count(),
      prisma.userProgress.count({ where: { completed: true } }),
      prisma.userStreak.count(),
      prisma.userStreak.count({
        where: {
          currentStreak: {
            gt: 0,
          },
        },
      }),
    ])

    return {
      totalUsers,
      activeUsers,
      totalLessons,
      publishedLessons,
      totalProgress,
      completedLessons,
      totalStreaks,
      activeStreaks,
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalLessons: 0,
      publishedLessons: 0,
      totalProgress: 0,
      completedLessons: 0,
      totalStreaks: 0,
      activeStreaks: 0,
    }
  }
}

export default async function AdminDashboard() {
  const { userId } = await auth()

  if (!userId || !isAdmin(userId)) {
    redirect("/dashboard")
  }

  const stats = await getAdminStats()

  return (
    <div className="admin-dashboard animate-fade-in">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage content, users, and platform analytics</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-sub">{stats.activeUsers} active this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.publishedLessons}</div>
          <div className="stat-label">Published Lessons</div>
          <div className="stat-sub">{stats.totalLessons - stats.publishedLessons} drafts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completedLessons}</div>
          <div className="stat-label">Lessons Completed</div>
          <div className="stat-sub">
            {Math.round((stats.completedLessons / Math.max(stats.totalProgress, 1)) * 100)}% completion rate
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.activeStreaks}</div>
          <div className="stat-label">Active Streaks</div>
          <div className="stat-sub">{stats.totalStreaks} total users with streaks</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-actions">
        <Link href="/admin/content" className="admin-card">
          <div className="admin-card-content">
            <div className="admin-card-icon">📚</div>
            <h3>Content Management</h3>
            <p>Create, edit, and manage lessons</p>
          </div>
        </Link>

        <Link href="/admin/users" className="admin-card">
          <div className="admin-card-content">
            <div className="admin-card-icon">👥</div>
            <h3>User Management</h3>
            <p>Monitor users and their progress</p>
          </div>
        </Link>

        <Link href="/admin/analytics" className="admin-card">
          <div className="admin-card-content">
            <div className="admin-card-icon">📊</div>
            <h3>Analytics</h3>
            <p>View detailed platform statistics</p>
          </div>
        </Link>

        <Link href="/admin/announcements" className="admin-card">
          <div className="admin-card-content">
            <div className="admin-card-icon">📢</div>
            <h3>Announcements</h3>
            <p>Create and manage announcements</p>
          </div>
        </Link>

        <Link href="/admin/reports" className="admin-card">
          <div className="admin-card-content">
            <div className="admin-card-icon">🚨</div>
            <h3>Content Reports</h3>
            <p>Review flagged content</p>
          </div>
        </Link>

        <Link href="/admin/categories" className="admin-card">
          <div className="admin-card-content">
            <div className="admin-card-icon">🏷️</div>
            <h3>Categories</h3>
            <p>Manage lesson categories</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="admin-activity">
        <div className="activity-card">
          <div className="card-header">
            <h3>Recent User Activity</h3>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-info">
                <div className="activity-title">New user registrations</div>
                <div className="activity-subtitle">Last 24 hours</div>
              </div>
              <div className="activity-value success">+12</div>
            </div>
            <div className="activity-item">
              <div className="activity-info">
                <div className="activity-title">Lessons completed</div>
                <div className="activity-subtitle">Today</div>
              </div>
              <div className="activity-value primary">247</div>
            </div>
            <div className="activity-item">
              <div className="activity-info">
                <div className="activity-title">Active streaks</div>
                <div className="activity-subtitle">Current</div>
              </div>
              <div className="activity-value warning">{stats.activeStreaks}</div>
            </div>
          </div>
        </div>

        <div className="activity-card">
          <div className="card-header">
            <h3>System Status</h3>
          </div>
          <div className="status-list">
            <div className="status-item">
              <span>Database Connection</span>
              <span className="badge badge-success">✓ Healthy</span>
            </div>
            <div className="status-item">
              <span>Video Streaming</span>
              <span className="badge badge-success">✓ Operational</span>
            </div>
            <div className="status-item">
              <span>Email Service</span>
              <span className="badge badge-success">✓ Active</span>
            </div>
            <div className="status-item">
              <span>Storage Usage</span>
              <span className="badge badge-warning">⚠ 78% Full</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
