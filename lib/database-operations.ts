// Missing database operations that need implementation

import { prisma } from "./prisma"

export async function createUserInDatabase(clerkUser: any) {
  try {
    const user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
        avatar: clerkUser.imageUrl,
      },
    })

    // Create initial streak record
    await prisma.userStreak.create({
      data: {
        userId: clerkUser.id,
        currentStreak: 0,
        longestStreak: 0,
      },
    })

    return user
  } catch (error) {
    console.error("Error creating user in database:", error)
    throw error
  }
}

export async function getUserProgress(userId: string, lessonId: number) {
  return await prisma.userProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  })
}

export async function updateUserProgress(
  userId: string,
  lessonId: number,
  data: {
    completed?: boolean
    score?: number
    timeSpent?: number
    videoProgress?: number
    quizAnswers?: any
  },
) {
  return await prisma.userProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    update: {
      ...data,
      completedAt: data.completed ? new Date() : undefined,
      attempts: { increment: 1 },
    },
    create: {
      userId,
      lessonId,
      ...data,
      attempts: 1,
      completedAt: data.completed ? new Date() : undefined,
    },
  })
}

export async function getUserBookmarks(userId: string) {
  return await prisma.userBookmark.findMany({
    where: { userId },
    include: {
      lesson: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function toggleBookmark(userId: string, lessonId: number) {
  const existing = await prisma.userBookmark.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  })

  if (existing) {
    await prisma.userBookmark.delete({
      where: { id: existing.id },
    })
    return false
  } else {
    await prisma.userBookmark.create({
      data: { userId, lessonId },
    })
    return true
  }
}

export async function checkAndUnlockAchievements(userId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      progress: true,
      streaks: true,
      achievements: {
        include: {
          achievement: true,
        },
      },
    },
  })

  if (!user) return []

  const unlockedAchievements = []
  const completedLessons = user.progress.filter((p) => p.completed).length
  const currentStreak = user.streaks?.currentStreak || 0

  // Check for achievements to unlock
  const achievements = await prisma.achievement.findMany({
    where: { isActive: true },
  })

  for (const achievement of achievements) {
    const alreadyUnlocked = user.achievements.some((ua) => ua.achievementId === achievement.id)
    if (alreadyUnlocked) continue

    let shouldUnlock = false

    // Check achievement criteria
    const criteria = achievement.criteria as any
    switch (achievement.type) {
      case "COMPLETION":
        shouldUnlock = completedLessons >= criteria.lessonsRequired
        break
      case "STREAK":
        shouldUnlock = currentStreak >= criteria.streakRequired
        break
      case "SCORE":
        const highScores = user.progress.filter((p) => p.score && p.score >= criteria.scoreRequired).length
        shouldUnlock = highScores >= criteria.countRequired
        break
    }

    if (shouldUnlock) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      })
      unlockedAchievements.push(achievement)
    }
  }

  return unlockedAchievements
}
