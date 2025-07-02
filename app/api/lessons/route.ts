import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()

    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        progress: userId
          ? {
              where: { userId },
            }
          : false,
      },
      orderBy: { createdAt: "desc" },
    })

    const formattedLessons = lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      type: lesson.type,
      category: lesson.category.name,
      difficulty: lesson.difficulty,
      duration: lesson.estimatedDuration,
      isPublished: lesson.isPublished,
      completed: userId ? lesson.progress.some((p) => p.completed) : false,
      createdAt: lesson.createdAt.toISOString(),
    }))

    return NextResponse.json({ lessons: formattedLessons })
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, content, type, categoryId, difficulty, duration } = body

    const newLesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content,
        type: type.toUpperCase(),
        categoryId: Number.parseInt(categoryId),
        difficulty: difficulty.toUpperCase(),
        estimatedDuration: Number.parseInt(duration),
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        createdBy: userId,
        isPublished: false,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ lesson: newLesson }, { status: 201 })
  } catch (error) {
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
  }
}
