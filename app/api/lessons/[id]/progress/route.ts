import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { updateUserProgress, updateUserStreak, checkAndUnlockAchievements } from "@/lib/database-operations"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lessonId = Number.parseInt(params.id)
    const body = await request.json()

    // Update progress
    const progress = await updateUserProgress(userId, lessonId, body)

    // Update streak if lesson completed
    if (body.completed) {
      await updateUserStreak(userId)

      // Check for new achievements
      const newAchievements = await checkAndUnlockAchievements(userId)

      return NextResponse.json({
        progress,
        newAchievements: newAchievements.length > 0 ? newAchievements : undefined,
      })
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error("Progress update error:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
