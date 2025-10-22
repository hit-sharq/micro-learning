import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const lessonId = Number.parseInt(params.id)

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 })
    }

    const originalLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    })

    if (!originalLesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    const duplicatedLesson = await prisma.lesson.create({
      data: {
        title: `${originalLesson.title} (Copy)`,
        description: originalLesson.description,
        content: originalLesson.content,
        type: originalLesson.type,
        categoryId: originalLesson.categoryId,
        difficulty: originalLesson.difficulty,
        estimatedDuration: originalLesson.estimatedDuration,
        tags: originalLesson.tags,
        videoUrl: originalLesson.videoUrl,
        videoThumbnail: originalLesson.videoThumbnail,
        quizData: originalLesson.quizData as any,
        metaDescription: originalLesson.metaDescription,
        isPublished: false, // Always create as draft
        createdBy: userId,
        slug: `${originalLesson.slug}-copy-${Date.now()}`,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      lesson: duplicatedLesson,
      message: "Lesson duplicated successfully!",
    })
  } catch (error) {
    console.error("Error duplicating lesson:", error)
    return NextResponse.json({ error: "Failed to duplicate lesson" }, { status: 500 })
  }
}
