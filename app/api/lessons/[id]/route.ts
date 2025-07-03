import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const lessonId = Number.parseInt(params.id)

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get lesson with user progress
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
        isPublished: true, // Only show published lessons to regular users
      },
      include: {
        category: true,
        progress: {
          where: { userId: user.id },
          take: 1,
        },
        bookmarks: {
          where: { userId: user.id },
          take: 1,
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Format the response
    const lessonWithProgress = {
      ...lesson,
      userProgress: lesson.progress[0] || null,
      isBookmarked: lesson.bookmarks.length > 0,
      progress: undefined, // Remove the progress array from response
      bookmarks: undefined, // Remove the bookmarks array from response
    }

    return NextResponse.json({ lesson: lessonWithProgress })
  } catch (error) {
    console.error("Get lesson error:", error)
    return NextResponse.json({ error: "Failed to fetch lesson" }, { status: 500 })
  }
}
