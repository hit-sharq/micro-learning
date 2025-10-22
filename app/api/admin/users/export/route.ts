import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            progress: true,
          },
        },
        progress: {
          where: { completed: true },
          select: { id: true },
        },
        streaks: true,
      },
    })

    // Create CSV content
    const csvHeader =
      "ID,Name,Email,Role,Status,Created At,Total Lessons,Completed Lessons,Current Streak,Longest Streak\n"
    const csvRows = users
      .map(
        (user) =>
          `${user.id},"${user.name || ""}","${user.email}","${user.role}","${user.isActive ? "Active" : "Inactive"}","${user.createdAt.toISOString()}","${user._count.progress}","${user.progress.length}","${user.streaks?.currentStreak || 0}","${user.streaks?.longestStreak || 0}"`,
      )
      .join("\n")

    const csvContent = csvHeader + csvRows

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="users-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export users error:", error)
    return NextResponse.json({ error: "Failed to export users" }, { status: 500 })
  }
}
