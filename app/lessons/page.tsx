import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { LessonsClient } from "./lessons-client"
import BackButton from "./BackButton"

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Lessons 📚</h1>
          <p className="text-xl text-gray-600">Discover bite-sized lessons tailored to your learning goals</p>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No lessons available</h3>
            <p className="text-gray-600 mb-6">There are no published lessons yet. Check back later!</p>
          </div>
        ) : (
          <LessonsClient lessons={lessons} />
        )}
      </div>
    </div>
  )
}
