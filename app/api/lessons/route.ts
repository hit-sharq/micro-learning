import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

// Mock database - in a real app, you'd use Prisma with PostgreSQL
const lessons = [
  {
    id: 1,
    title: "JavaScript Basics",
    description: "Learn the fundamentals of JavaScript programming",
    content: "JavaScript is a versatile programming language...",
    type: "text",
    category: "Programming",
    difficulty: "beginner",
    duration: 5,
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json({ lessons })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, content, type, category, difficulty, duration } = body

    const newLesson = {
      id: lessons.length + 1,
      title,
      description,
      content,
      type,
      category,
      difficulty,
      duration: Number.parseInt(duration),
      isPublished: false,
      createdAt: new Date().toISOString(),
    }

    lessons.push(newLesson)

    return NextResponse.json({ lesson: newLesson }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
  }
}
