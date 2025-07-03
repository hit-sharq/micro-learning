import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { searchLessons } from "@/lib/database-operations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || "all"
    const difficulty = searchParams.get("difficulty") || "all"
    const type = searchParams.get("type") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    console.log("Fetching lessons with params:", { search, category, difficulty, type, page, limit })

    let lessons

    if (search) {
      lessons = await searchLessons(search, { category, difficulty, type })
    } else {
      const where: any = { isPublished: true }

      if (category !== "all") {
        where.category = { name: category }
      }

      if (difficulty !== "all") {
        where.difficulty = difficulty.toUpperCase()
      }

      if (type !== "all") {
        where.type = type.toUpperCase()
      }

      console.log("Database query where clause:", where)

      lessons = await prisma.lesson.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: {
              progress: {
                where: { completed: true },
              },
            },
          },
        },
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      })
    }

    console.log(`Found ${lessons.length} lessons`)

    // Get user progress if authenticated
    const { userId } = await auth()
    let userProgress: any = {}

    if (userId) {
      const progressData = await prisma.userProgress.findMany({
        where: {
          userId,
          lessonId: { in: lessons.map((l) => l.id) },
        },
      })

      userProgress = progressData.reduce((acc, p) => {
        acc[p.lessonId] = p
        return acc
      }, {} as any)
    }

    const lessonsWithProgress = lessons.map((lesson) => ({
      ...lesson,
      userProgress: userProgress[lesson.id] || null,
      completionCount: lesson._count.progress,
    }))

    return NextResponse.json({
      lessons: lessonsWithProgress,
      pagination: {
        page,
        limit,
        total: lessons.length,
      },
    })
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 })
  }
}
