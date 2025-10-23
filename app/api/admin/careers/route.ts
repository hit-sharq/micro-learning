import { auth } from "@clerk/nextjs/server"
import { isAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId || !(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const careers = await prisma.career.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(careers)
  } catch (error) {
    console.error("Error fetching careers:", error)
    return NextResponse.json({ error: "Failed to fetch careers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId || !(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const career = await prisma.career.create({
      data: {
        ...data,
        createdBy: userId,
        requirements: data.requirements || [],
        benefits: data.benefits || [],
      },
    })

    return NextResponse.json(career, { status: 201 })
  } catch (error) {
    console.error("Error creating career:", error)
    return NextResponse.json({ error: "Failed to create career" }, { status: 500 })
  }
}
