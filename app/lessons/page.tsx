import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { LessonsClient } from "./lessons-client"
import BackButton from "./BackButton"
import "./lesson.css"

async function getLessonsData(userId?: string) {
  try {
    console.log("Fetching lessons for user:", userId)

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

    console.log(`Found ${lessons.length} published lessons`)

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

  console.log(`Rendering lessons page with ${lessons.length} lessons`)

  return (
    <div className="lessons-page">
      <div className="lessons-container">
        <BackButton />
        <div className="lessons-header">
          <h1 className="lessons-title">Explore Lessons 📚</h1>
          <p className="lessons-subtitle">Discover bite-sized lessons tailored to your learning goals</p>
        </div>

        {lessons.length === 0 ? (
          <div className="lessons-empty">
            <div className="lessons-empty-icon">
              <span className="lessons-empty-emoji">📚</span>
            </div>
            <h3 className="lessons-empty-title">No lessons available</h3>
            <p className="lessons-empty-text">There are no published lessons yet. Check back later!</p>
          </div>
        ) : (
          <LessonsClient lessons={lessons} />
        )}
      </div>
    </div>
  )
}
