import { auth } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const career = await prisma.career.findUnique({
      where: { id: Number.parseInt(params.id) },
    })

    if (!career) {
      return NextResponse.json({ error: "Career not found" }, { status: 404 })
    }

    return NextResponse.json(career)
  } catch (error) {
    console.error("Error fetching career:", error)
    return NextResponse.json({ error: "Failed to fetch career" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId || !(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const career = await prisma.career.update({
      where: { id: Number.parseInt(params.id) },
      data: {
        ...data,
        lastEditedBy: userId,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(career)
  } catch (error) {
    console.error("Error updating career:", error)
    return NextResponse.json({ error: "Failed to update career" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId || !(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.career.delete({
      where: { id: Number.parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting career:", error)
    return NextResponse.json({ error: "Failed to delete career" }, { status: 500 })
  }
}
