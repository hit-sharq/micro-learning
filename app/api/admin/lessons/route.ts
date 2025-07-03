import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const type = searchParams.get("type")

    const where: any = {}

    if (status && status !== "all") {
      where.isPublished = status === "published"
    }

    if (category && category !== "all") {
      where.category = { name: category }
    }

    if (type && type !== "all") {
      where.type = type.toUpperCase()
    }

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        category: true,
        progress: {
          select: {
            completed: true,
            id: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    const lessonsWithStats = lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      type: lesson.type,
      category: lesson.category.name,
      difficulty: lesson.difficulty,
      duration: lesson.estimatedDuration,
      isPublished: lesson.isPublished,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      viewCount: lesson.progress.length,
      completionRate:
        lesson.progress.length > 0
          ? Math.round((lesson.progress.filter((p) => p.completed).length / lesson.progress.length) * 100)
          : 0,
    }))

    return NextResponse.json({ lessons: lessonsWithStats })
  } catch (error) {
    console.error("Error fetching admin lessons:", error)
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
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

    // Validate required fields
    if (!title || !description || !content || !type || !categoryId || !difficulty || !estimatedDuration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const lesson = await prisma.lesson.create({
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
        isPublished: isPublished || false,
        authorId: userId,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      lesson,
      message: isPublished ? "Lesson published successfully!" : "Lesson saved as draft!",
    })
  } catch (error) {
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
  }
}
