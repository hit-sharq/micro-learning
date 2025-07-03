import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "7d"

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (range) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Get user stats
    const [totalUsers, newUsersThisWeek, activeUsersToday] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    // Calculate retention rate (users who logged in within 7 days of signup)
    const retentionUsers = await prisma.user.count({
      where: {
        AND: [
          {
            createdAt: {
              gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            },
          },
          {
            lastLoginAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        ],
      },
    })

    const retentionRate = totalUsers > 0 ? Math.round((retentionUsers / totalUsers) * 100) : 0

    // Get lesson stats
    const [totalLessons, completedLessons] = await Promise.all([
      prisma.lesson.count({ where: { isPublished: true } }),
      prisma.userProgress.count({ where: { completed: true } }),
    ])

    const averageCompletionTime = 15 // Mock data - you can calculate this from actual data

    // Get popular lessons
    const popularLessons = await prisma.lesson.findMany({
      take: 5,
      include: {
        _count: {
          select: {
            progress: {
              where: { completed: true },
            },
          },
        },
        progress: {
          where: { completed: true },
          select: { score: true },
        },
      },
      orderBy: {
        progress: {
          _count: "desc",
        },
      },
    })

    const popularLessonsFormatted = popularLessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      completions: lesson._count.progress,
      averageScore:
        lesson.progress.length > 0
          ? Math.round(lesson.progress.reduce((sum, p) => sum + (p.score || 0), 0) / lesson.progress.length)
          : 0,
    }))

    // Generate daily active users data (mock data for now)
    const dailyActiveUsers = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dailyActiveUsers.push({
        date: date.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 50) + 10, // Mock data
      })
    }

    // Generate lesson completions data (mock data for now)
    const lessonCompletions = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      lessonCompletions.push({
        date: date.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 30) + 5, // Mock data
      })
    }

    // Generate streak data
    const streakData = [
      { streakLength: 0, userCount: Math.floor(totalUsers * 0.3) },
      { streakLength: 1, userCount: Math.floor(totalUsers * 0.2) },
      { streakLength: 3, userCount: Math.floor(totalUsers * 0.15) },
      { streakLength: 7, userCount: Math.floor(totalUsers * 0.2) },
      { streakLength: 14, userCount: Math.floor(totalUsers * 0.1) },
      { streakLength: 30, userCount: Math.floor(totalUsers * 0.05) },
    ]

    const analyticsData = {
      userStats: {
        totalUsers,
        newUsersThisWeek,
        activeUsersToday,
        retentionRate,
      },
      lessonStats: {
        totalLessons,
        completedLessons,
        averageCompletionTime,
        popularLessons: popularLessonsFormatted,
      },
      engagementStats: {
        dailyActiveUsers,
        lessonCompletions,
        streakData,
      },
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
