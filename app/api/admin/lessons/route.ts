import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

async function requireAdmin() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const adminUserIds = process.env.ADMIN_USER_IDS?.split(",") || []
  if (!adminUserIds.includes(userId)) {
    throw new Error("Forbidden")
  }

  return userId
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const category = searchParams.get("category") || "all"
    const type = searchParams.get("type") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status !== "all") {
      where.isPublished = status === "published"
    }

    if (category !== "all") {
      where.category = { name: category }
    }

    if (type !== "all") {
      where.type = type.toUpperCase()
    }

    const [lessons, total] = await Promise.all([
      prisma.lesson.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: {
              progress: true,
              bookmarks: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lesson.count({ where }),
    ])

    const lessonsWithStats = lessons.map((lesson) => ({
      ...lesson,
      viewCount: lesson._count.progress,
      bookmarkCount: lesson._count.bookmarks,
      completionRate:
        lesson._count.progress > 0 ? Math.round((lesson._count.progress / lesson._count.progress) * 100) : 0,
    }))

    return NextResponse.json({
      lessons: lessonsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching admin lessons:", error)
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    console.log("Creating lesson with data:", body)

    const {
      title,
      description,
      content,
      type,
      difficulty,
      estimatedDuration,
      categoryId,
      tags,
      isPublished,
      videoUrl,
      quizData,
    } = body

    // Validate required fields
    if (!title || !description || !content || !type || !difficulty || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    let slug = baseSlug
    let counter = 1

    while (await prisma.lesson.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content,
        slug,
        type: type.toUpperCase(),
        difficulty: difficulty.toUpperCase(),
        estimatedDuration: Number(estimatedDuration),
        categoryId: Number(categoryId),
        tags: tags || [],
        isPublished: Boolean(isPublished),
        videoUrl: videoUrl || null,
        quizData: quizData || null,
      },
      include: {
        category: true,
      },
    })

    console.log("Created lesson:", lesson)

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error("Error creating lesson:", error)
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
  }
}
