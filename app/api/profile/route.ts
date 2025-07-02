import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      profile: {
        timezone: user.timezone,
        dailyGoal: user.dailyGoal,
        reminderTime: user.reminderTime,
        emailNotifications: user.emailNotifications,
        pushNotifications: user.pushNotifications,
        preferredDifficulty: user.preferredDifficulty,
        preferredCategories: user.preferredCategories,
        learningStyle: user.learningStyle,
      },
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      timezone,
      dailyGoal,
      reminderTime,
      emailNotifications,
      pushNotifications,
      preferredDifficulty,
      preferredCategories,
      learningStyle,
    } = body

    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        timezone,
        dailyGoal,
        reminderTime,
        emailNotifications,
        pushNotifications,
        preferredDifficulty,
        preferredCategories,
        learningStyle,
      },
    })

    return NextResponse.json({
      success: true,
      profile: {
        timezone: updatedUser.timezone,
        dailyGoal: updatedUser.dailyGoal,
        reminderTime: updatedUser.reminderTime,
        emailNotifications: updatedUser.emailNotifications,
        pushNotifications: updatedUser.pushNotifications,
        preferredDifficulty: updatedUser.preferredDifficulty,
        preferredCategories: updatedUser.preferredCategories,
        learningStyle: updatedUser.learningStyle,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
