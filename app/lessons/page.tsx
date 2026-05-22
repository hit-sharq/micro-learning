import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { LessonsClient } from "./lessons-client"

async function getLessonsData(userId?: string) {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        progress: userId ? { where: { userId } } : false,
      },
      orderBy: { createdAt: "desc" },
    })
    return lessons.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      type: l.type.toLowerCase(),
      category: l.category.name,
      difficulty: l.difficulty.toLowerCase(),
      duration: l.estimatedDuration,
      completed: userId ? l.progress.some((p: any) => p.completed) : false,
      categoryColor: l.category.color,
      tags: l.tags,
    }))
  } catch {
    return []
  }
}

export default async function LessonsPage() {
  const { userId } = await auth()
  const lessons = await getLessonsData(userId || undefined)

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explore Lessons
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover bite-sized lessons tailored to your goals
          </p>
        </div>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-5xl block mb-4">📚</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">No lessons available</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">There are no published lessons yet. Check back later!</p>
        </div>
      ) : (
        <LessonsClient lessons={lessons} />
      )}
    </div>
  )
}
