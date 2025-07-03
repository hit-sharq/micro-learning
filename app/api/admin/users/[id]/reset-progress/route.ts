import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete all progress for the user
    await prisma.userProgress.deleteMany({
      where: { userId: params.id },
    })

    // Reset user streaks
    await prisma.user.update({
      where: { id: params.id },
      data: {
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
