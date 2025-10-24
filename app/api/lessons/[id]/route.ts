import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const lessonId = Number.parseInt(params.id)

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 })
    }

    const { userId } = await auth()

    // Get lesson by ID if published
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
        isPublished: true,
      },
      include: {
        category: true,
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Get user progress if user is authenticated
    let userProgress = null
    if (userId) {
      userProgress = await prisma.userProgress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
      })
    }

    return NextResponse.json({ lesson: { ...lesson, userProgress } })
  } catch (error) {
    console.error("Get lesson error:", error)
    return NextResponse.json({ error: "Failed to fetch lesson" }, { status: 500 })
  }
}
