import { prisma } from "./prisma"
import { auth } from "@clerk/nextjs/server"

export async function isAdmin() {
  const { userId } = await auth()

  if (!userId) {
    return false
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  })

  return user?.role === "ADMIN"
}

export async function requireAdmin() {
  const adminStatus = await isAdmin()

  if (!adminStatus) {
    throw new Error("Admin access required")
  }

  return true
}

export async function getAdminStats() {
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
        updatedAt: {
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
        currentStreak: { gt: 0 },
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
}
