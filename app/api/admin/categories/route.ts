import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    await requireAdmin()

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            lessons: true,
          },
        },
      },
      orderBy: { sortOrder: "asc" },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch categories",
      },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 403 : 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { name, description, slug, isActive, sortOrder } = body

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    // Generate slug if not provided
    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    // Check if slug is unique
    const existingCategory = await prisma.category.findUnique({
      where: { slug: finalSlug },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        slug: finalSlug,
        isActive: isActive !== false,
        sortOrder: sortOrder || 0,
      },
    })

    console.log(`Created category: ${category.name}`)

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create category",
      },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 403 : 500 },
    )
  }
}
