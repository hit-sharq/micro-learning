import { auth } from "@clerk/nextjs/server"

export async function isAdmin() {
  const { userId } = await auth()

  if (!userId) {
    return false
  }

  // Get admin IDs from environment variable
  const adminIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []

  return adminIds.includes(userId)
}

export async function requireAdmin() {
  const adminStatus = await isAdmin()

  if (!adminStatus) {
    throw new Error("Admin access required")
  }

  return true
}

// Mock stats for now - will be replaced with real data later
export async function getAdminStats() {
  return {
    totalUsers: 156,
    activeUsers: 89,
    totalLessons: 45,
    publishedLessons: 38,
    totalProgress: 1247,
    completedLessons: 892,
    totalStreaks: 67,
    activeStreaks: 34,
  }
}
