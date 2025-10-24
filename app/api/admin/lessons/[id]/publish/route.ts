import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        category: true,
        _count: {
          select: {
            progress: true,
            bookmarks: true,
          },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error("Error fetching lesson:", error)
    return NextResponse.json({ error: "Failed to fetch lesson" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const body = await request.json()
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
      isPublished,
    } = body

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title,
        description,
        content,
        type: type?.toUpperCase(),
        categoryId,
        difficulty: difficulty?.toUpperCase(),
        estimatedDuration,
        tags,
        videoUrl,
        videoThumbnail,
        quizData,
        metaDescription,
        isPublished,
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      lesson,
      message: "Lesson updated successfully!",
    })
  } catch (error) {
    console.error("Error updating lesson:", error)
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const lessonId = Number.parseInt(id)

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 })
    }

    const body = await request.json()
    const { isPublished } = body

    if (typeof isPublished !== "boolean") {
      return NextResponse.json({ error: "isPublished must be a boolean" }, { status: 400 })
    }

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      lesson,
      message: `Lesson ${isPublished ? "published" : "unpublished"} successfully!`,
    })
  } catch (error) {
    console.error("Error updating lesson publish status:", error)
    return NextResponse.json({ error: "Failed to update lesson publish status" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Delete related records first
    await prisma.userProgress.deleteMany({
      where: { lessonId },
    })

    await prisma.userBookmark.deleteMany({
      where: { lessonId },
    })

    // Delete the lesson
    await prisma.lesson.delete({
      where: { id: lessonId },
    })

    return NextResponse.json({
      success: true,
      message: "Lesson deleted successfully!",
    })
  } catch (error) {
    console.error("Error deleting lesson:", error)
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 })
  }
}
