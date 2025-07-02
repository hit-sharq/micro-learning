import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const type = searchParams.get("type")

    const where: any = {}

    if (status === "published") where.isPublished = true
    if (status === "draft") where.isPublished = false
    if (category && category !== "all") where.category = { name: category }
    if (type && type !== "all") where.type = type.toUpperCase()

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        category: true,
        progress: {
          select: {
            completed: true,
            score: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    // Calculate performance metrics
    const lessonsWithMetrics = lessons.map((lesson) => ({
      ...lesson,
      viewCount: lesson.progress.length,
      completionRate:
        lesson.progress.length > 0
          ? Math.round((lesson.progress.filter((p) => p.completed).length / lesson.progress.length) * 100)
          : 0,
    }))

    return NextResponse.json({ lessons: lessonsWithMetrics })
  } catch (error) {
    console.error("Admin lessons fetch error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

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

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content: content || "",
        type: type.toUpperCase(),
        categoryId: Number.parseInt(categoryId),
        difficulty: difficulty.toUpperCase(),
        estimatedDuration: Number.parseInt(estimatedDuration),
        tags: tags || [],
        videoUrl,
        videoThumbnail,
        quizData,
        slug,
        metaDescription,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ lesson }, { status: 201 })
  } catch (error) {
    console.error("Admin lesson creation error:", error)
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
  }
}
