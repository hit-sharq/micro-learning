import { prisma } from "./prisma"

export async function createUserInDatabase(clerkUser: any) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    })

    if (existingUser) {
      return existingUser
    }

    const user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
        avatar: clerkUser.imageUrl,
        role: "STUDENT",
        isActive: true,
        dailyGoal: 1,
        timezone: "UTC",
        emailNotifications: true,
        pushNotifications: true,
        preferredDifficulty: "BEGINNER",
        preferredCategories: [],
        learningStyle: "VISUAL",
      },
    })

    // Create initial streak record
    await prisma.userStreak.create({
      data: {
        userId: clerkUser.id,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date(),
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
  const progress = await prisma.userProgress.upsert({
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
      updatedAt: new Date(),
    },
    create: {
      userId,
      lessonId,
      ...data,
      attempts: 1,
      completedAt: data.completed ? new Date() : undefined,
    },
  })

  // Update user streak if lesson completed
  if (data.completed) {
    await updateUserStreak(userId)
    await checkAndUnlockAchievements(userId)
  }

  return progress
}

export async function updateUserStreak(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const userStreak = await prisma.userStreak.findUnique({
    where: { userId },
  })

  if (!userStreak) {
    return await prisma.userStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: new Date(),
      },
    })
  }

  const lastActivity = new Date(userStreak.lastActivityDate)
  lastActivity.setHours(0, 0, 0, 0)

  let newCurrentStreak = userStreak.currentStreak

  if (lastActivity.getTime() === yesterday.getTime()) {
    // Consecutive day
    newCurrentStreak += 1
  } else if (lastActivity.getTime() < yesterday.getTime()) {
    // Streak broken
    newCurrentStreak = 1
  }
  // If same day, don't change streak

  const newLongestStreak = Math.max(userStreak.longestStreak, newCurrentStreak)

  return await prisma.userStreak.update({
    where: { userId },
    data: {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: new Date(),
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
  const highScores = user.progress.filter((p) => p.score && p.score >= 90).length
  const perfectScores = user.progress.filter((p) => p.score === 100).length

  // Define achievements to check
  const achievementsToCheck = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      type: "COMPLETION",
      criteria: { lessonsRequired: 1 },
      points: 10,
    },
    {
      id: 2,
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      type: "STREAK",
      criteria: { streakRequired: 7 },
      points: 50,
    },
    {
      id: 3,
      name: "Quiz Master",
      description: "Score 90%+ on 5 quizzes",
      icon: "🧠",
      type: "SCORE",
      criteria: { scoreRequired: 90, countRequired: 5 },
      points: 30,
    },
    {
      id: 4,
      name: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: "💯",
      type: "SCORE",
      criteria: { scoreRequired: 100, countRequired: 1 },
      points: 25,
    },
    {
      id: 5,
      name: "Dedicated Learner",
      description: "Complete 10 lessons",
      icon: "📚",
      type: "COMPLETION",
      criteria: { lessonsRequired: 10 },
      points: 40,
    },
  ]

  for (const achievement of achievementsToCheck) {
    const alreadyUnlocked = user.achievements.some((ua) => ua.achievement.name === achievement.name)
    if (alreadyUnlocked) continue

    let shouldUnlock = false

    switch (achievement.type) {
      case "COMPLETION":
        shouldUnlock = completedLessons >= achievement.criteria.lessonsRequired
        break
      case "STREAK":
        shouldUnlock = currentStreak >= achievement.criteria.streakRequired
        break
      case "SCORE":
        if (achievement.criteria.scoreRequired === 100) {
          shouldUnlock = perfectScores >= achievement.criteria.countRequired
        } else {
          shouldUnlock = highScores >= achievement.criteria.countRequired
        }
        break
    }

    if (shouldUnlock) {
      // Create achievement if it doesn't exist
      let dbAchievement = await prisma.achievement.findFirst({
        where: { name: achievement.name },
      })

      if (!dbAchievement) {
        dbAchievement = await prisma.achievement.create({
          data: {
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            type: achievement.type,
            criteria: achievement.criteria,
            points: achievement.points,
            isActive: true,
          },
        })
      }

      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: dbAchievement.id,
        },
      })

      unlockedAchievements.push(dbAchievement)
    }
  }

  return unlockedAchievements
}

export async function searchLessons(
  query: string,
  filters: {
    category?: string
    difficulty?: string
    type?: string
  },
) {
  const where: any = {
    isPublished: true,
    OR: [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { content: { contains: query, mode: "insensitive" } },
    ],
  }

  if (filters.category && filters.category !== "all") {
    where.category = { name: filters.category }
  }

  if (filters.difficulty && filters.difficulty !== "all") {
    where.difficulty = filters.difficulty.toUpperCase()
  }

  if (filters.type && filters.type !== "all") {
    where.type = filters.type.toUpperCase()
  }

  return await prisma.lesson.findMany({
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
    take: 50,
  })
}
