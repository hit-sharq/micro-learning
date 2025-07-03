import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Mock response - implement actual announcement deletion
    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully!",
    })
  } catch (error) {
    console.error("Delete announcement error:", error)
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 })
  }
}
