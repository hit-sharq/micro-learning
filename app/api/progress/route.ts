import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

// Mock progress data - in a real app, you'd use Prisma with PostgreSQL
const userProgress: Record<string, any[]> = {}

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const progress = userProgress[userId] || []
    return NextResponse.json({ progress })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { lessonId, completed, score } = body

    if (!userProgress[userId]) {
      userProgress[userId] = []
    }

    const existingProgress = userProgress[userId].find((p) => p.lessonId === lessonId)

    if (existingProgress) {
      existingProgress.completed = completed
      existingProgress.score = score
      existingProgress.completedAt = new Date().toISOString()
    } else {
      userProgress[userId].push({
        lessonId,
        completed,
        score,
        completedAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
