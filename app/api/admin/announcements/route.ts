import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // For now, return mock data since we don't have announcements table
    // You should create an announcements table in your schema
    const announcements = [
      {
        id: 1,
        title: "Welcome to the Platform!",
        content: "We're excited to have you here. Start your learning journey today!",
        type: "INFO",
        priority: "NORMAL",
        targetAudience: ["all"],
        publishAt: new Date().toISOString(),
        expiresAt: null,
        isActive: true,
        isDraft: false,
        viewCount: 150,
        clickCount: 25,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "New Lessons Available",
        content: "Check out our latest programming lessons in the catalog.",
        type: "UPDATE",
        priority: "HIGH",
        targetAudience: ["students"],
        publishAt: new Date().toISOString(),
        expiresAt: null,
        isActive: true,
        isDraft: false,
        viewCount: 89,
        clickCount: 12,
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error("Announcements API error:", error)
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    // Mock response - you should implement actual announcement creation
    const announcement = {
      id: Date.now(),
      ...body,
      viewCount: 0,
      clickCount: 0,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      announcement,
      message: "Announcement created successfully!",
    })
  } catch (error) {
    console.error("Create announcement error:", error)
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
  }
}
