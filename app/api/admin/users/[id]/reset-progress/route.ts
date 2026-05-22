import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete all progress for the user
    await prisma.userProgress.deleteMany({
      where: { userId: params.id },
    })

    // Reset user streaks (upsert because a streak record may not yet exist
    // for a brand-new user)
    await prisma.userStreak.upsert({
      where: { userId: params.id },
      create: {
        userId: params.id,
        currentStreak: 0,
        longestStreak: 0,
      },
      update: {
        currentStreak: 0,
        longestStreak: 0,
      },
    })

    return NextResponse.json({
      success: true,
      message: "User progress reset successfully!",
    })
  } catch (error) {
    console.error("Reset user progress error:", error)
    return NextResponse.json({ error: "Failed to reset user progress" }, { status: 500 })
  }
}
