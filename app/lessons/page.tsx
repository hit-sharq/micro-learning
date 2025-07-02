"use client"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { LessonsClient } from "./lessons-client"

async function getLessonsData(userId?: string) {
  try {
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

    return lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      type: lesson.type.toLowerCase(),
      category: lesson.category.name,
      difficulty: lesson.difficulty.toLowerCase(),
      duration: lesson.estimatedDuration,
      completed: userId ? lesson.progress.some((p) => p.completed) : false,
      categoryColor: lesson.category.color,
      tags: lesson.tags,
    }))
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return []
  }
}

export default async function LessonsPage() {
  const { userId } = await auth()
  const lessons = await getLessonsData(userId || undefined)

  return (
    <div className="lessons-page animate-fade-in">
      <div className="lessons-header">
        <h1>Browse Lessons</h1>
        <p>Discover bite-sized lessons tailored to your learning goals</p>
      </div>

      <LessonsClient lessons={lessons} />
    </div>
  )
}
