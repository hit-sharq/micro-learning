import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { lessons } = body

    if (!Array.isArray(lessons) || lessons.length === 0) {
      return NextResponse.json({ error: "Invalid lessons data" }, { status: 400 })
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const lessonData of lessons) {
      try {
        const {
          title,
          description,
          content,
          type,
          categoryId,
          difficulty,
          estimatedDuration,
          tags,
          videoUrl,
          videoThumbnail,
          quizData,
          metaDescription,
        } = lessonData

        // Validate required fields
        if (!title || !description || !content || !type || !categoryId || !difficulty || !estimatedDuration) {
          results.failed++
          results.errors.push(`Lesson "${title || "Unknown"}": Missing required fields`)
          continue
        }

        await prisma.lesson.create({
          data: {
            title,
            description,
            content,
            type: type.toUpperCase(),
            categoryId,
            difficulty: difficulty.toUpperCase(),
            estimatedDuration,
            tags: tags || [],
            videoUrl,
            videoThumbnail,
            quizData,
            metaDescription,
            isPublished: false, // Always create as draft for bulk upload
            authorId: userId,
          },
        })

        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Lesson "${lessonData.title || "Unknown"}": ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Bulk upload completed: ${results.success} successful, ${results.failed} failed`,
    })
  } catch (error) {
    console.error("Error in bulk upload:", error)
    return NextResponse.json({ error: "Failed to process bulk upload" }, { status: 500 })
  }
}
