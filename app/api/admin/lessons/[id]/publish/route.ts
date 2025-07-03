import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const lessonId = Number.parseInt(params.id)

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 })
    }

    const body = await request.json()
    const { isPublished } = body

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        isPublished,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      lesson,
      message: isPublished ? "Lesson published successfully!" : "Lesson unpublished successfully!",
    })
  } catch (error) {
    console.error("Error updating lesson publish status:", error)
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 })
  }
}
