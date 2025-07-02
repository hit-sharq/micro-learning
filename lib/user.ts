import { prisma } from "./prisma"
import { auth } from "@clerk/nextjs/server"

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      streaks: true,
      progress: {
        include: {
          lesson: {
            include: {
              category: true,
            },
          },
        },
      },
      achievements: {
        include: {
          achievement: true,
        },
      },
    },
  })

  // Create user if doesn't exist
  if (!user) {
    const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then((res) => res.json())

    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.email_addresses[0]?.email_address || "",
        name: `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`.trim() || "User",
      },
      include: {
        streaks: true,
        progress: {
          include: {
            lesson: {
              include: {
                category: true,
              },
            },
          },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    })

    // Create initial streak record
    await prisma.userStreak.create({
      data: {
        userId: userId,
        currentStreak: 0,
        longestStreak: 0,
      },
    })
  }

  return user
}

export async function updateUserStreak(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const streak = await prisma.userStreak.findUnique({
    where: { userId },
  })

  if (!streak) return

  const lastActivity = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null

  if (!lastActivity || lastActivity < today) {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let newCurrentStreak = 1

    if (lastActivity && lastActivity.getTime() === yesterday.getTime()) {
      // Consecutive day
      newCurrentStreak = streak.currentStreak + 1
    }

    await prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: Math.max(streak.longestStreak, newCurrentStreak),
        lastActivityDate: today,
      },
    })
  }
}
