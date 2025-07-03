import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/user"
import { getUserBookmarks, toggleBookmark } from "@/lib/database-operations"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookmarks = await getUserBookmarks(user.clerkId)

    return NextResponse.json({ bookmarks })
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { lessonId } = await request.json()

    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 })
    }

    // Ensure user exists or create if missing
    const userExists = await prisma.user.findUnique({
      where: { clerkId: user.clerkId },
    })

    if (!userExists) {
      const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${user.clerkId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }).then((res) => res.json())

      await prisma.user.create({
        data: {
          clerkId: user.clerkId,
          email: clerkUser.email_addresses[0]?.email_address || "",
          name: `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`.trim() || "User",
        },
      })
    }

    const isBookmarked = await toggleBookmark(user.clerkId, lessonId)

    return NextResponse.json({
      isBookmarked,
      message: isBookmarked ? "Lesson bookmarked!" : "Bookmark removed!",
    })
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 })
  }
}
