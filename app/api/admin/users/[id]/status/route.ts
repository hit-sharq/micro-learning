import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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

    const body = await request.json()
    const { isActive } = body

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { isActive },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `User ${isActive ? "activated" : "deactivated"} successfully!`,
    })
  } catch (error) {
    console.error("Toggle user status error:", error)
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
  }
}
