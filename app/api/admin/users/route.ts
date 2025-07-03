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
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const activity = searchParams.get("activity")
    const search = searchParams.get("search")

    const where: any = {}

    if (role && role !== "all") {
      where.role = role.toUpperCase()
    }

    if (status && status !== "all") {
      where.isActive = status === "active"
    }

    if (activity === "recent") {
      where.lastLoginAt = {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }
    } else if (activity === "inactive") {
      where.lastLoginAt = {
        lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        _count: {
          select: {
            progress: true,
            bookmarks: true,
          },
        },
        progress: {
          where: { completed: true },
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const usersWithStats = users.map((user) => ({
      id: user.id,
      clerkId: user.clerkId,
      name: user.name || "Unknown",
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      totalLessons: user._count.progress,
      completedLessons: user.progress.length,
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
    }))

    return NextResponse.json({ users: usersWithStats })
  } catch (error) {
    console.error("Users API error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
