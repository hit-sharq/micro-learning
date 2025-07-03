import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`)

    // Get file content
    const buffer = Buffer.from(await file.arrayBuffer())
    const content = buffer.toString("utf-8")

    // Process based on file type
    let lessonData: any = {}

    if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      // Text/Markdown file
      lessonData = {
        title: file.name.replace(/\.(txt|md)$/, "").replace(/[-_]/g, " "),
        description: content.substring(0, 200) + (content.length > 200 ? "..." : ""),
        content: content,
        type: "TEXT",
        difficulty: "BEGINNER",
        estimatedDuration: Math.max(5, Math.ceil(content.length / 1000)), // Rough estimate
        tags: [],
        isPublished: false,
      }
    } else if (file.name.endsWith(".json")) {
      // JSON file with lesson data
      try {
        const jsonData = JSON.parse(content)
        if (Array.isArray(jsonData)) {
          // Multiple lessons
          const lessons = []
          for (const item of jsonData) {
            const lesson = await createLessonFromData(item)
            lessons.push(lesson)
          }
          return NextResponse.json({ lessons }, { status: 201 })
        } else {
          // Single lesson
          lessonData = jsonData
        }
      } catch (error) {
        console.error("JSON parsing error:", error)
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 })
      }
    } else if (file.name.endsWith(".csv")) {
      // CSV file
      try {
        const lines = content.split("\n").filter((line) => line.trim())
        if (lines.length < 2) {
          return NextResponse.json({ error: "CSV file must have at least a header and one data row" }, { status: 400 })
        }

        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
        const lessons = []

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
            const lessonObj: any = {}

            headers.forEach((header, index) => {
              lessonObj[header] = values[index] || ""
            })

            const lesson = await createLessonFromData(lessonObj)
            lessons.push(lesson)
          }
        }

        return NextResponse.json({ lessons }, { status: 201 })
      } catch (error) {
        console.error("CSV processing error:", error)
        return NextResponse.json({ error: "Failed to process CSV file" }, { status: 400 })
      }
    } else {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${file.name}. Supported types: .txt, .md, .json, .csv`,
        },
        { status: 400 },
      )
    }

    // Create single lesson
    const lesson = await createLessonFromData(lessonData)
    return NextResponse.json({ lesson }, { status: 201 })
  } catch (error) {
    console.error("Bulk upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    )
  }
}

async function createLessonFromData(data: any) {
  try {
    // Generate slug from title
    const title = data.title || "Untitled Lesson"
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Ensure unique slug
    let finalSlug = slug
    let counter = 1
    while (await prisma.lesson.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`
      counter++
    }

    // Get or create default category
    let categoryId = 1
    if (data.categoryId) {
      const parsedCategoryId = Number.parseInt(data.categoryId)
      if (!isNaN(parsedCategoryId)) {
        const categoryExists = await prisma.category.findUnique({
          where: { id: parsedCategoryId },
        })
        if (categoryExists) {
          categoryId = parsedCategoryId
        }
      }
    }

    // If no valid category found, get the first active category
    const firstCategory = await prisma.category.findFirst({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    })

    if (firstCategory) {
      categoryId = firstCategory.id
    } else {
      // Create a default category if none exists
      const defaultCategory = await prisma.category.create({
        data: {
          name: "General",
          description: "General lessons",
          slug: "general",
          isActive: true,
          sortOrder: 1,
        },
      })
      categoryId = defaultCategory.id
    }

    // Validate and set defaults
    const validDifficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]
    const validTypes = ["TEXT", "VIDEO", "QUIZ", "INTERACTIVE"]

    const lessonData = {
      title: title,
      description: data.description || "No description provided",
      content: data.content || "",
      type: validTypes.includes(data.type?.toUpperCase()) ? data.type.toUpperCase() : "TEXT",
      categoryId: categoryId,
      difficulty: validDifficulties.includes(data.difficulty?.toUpperCase())
        ? data.difficulty.toUpperCase()
        : "BEGINNER",
      estimatedDuration: Math.max(1, Number.parseInt(data.estimatedDuration) || 5),
      tags: Array.isArray(data.tags)
        ? data.tags
        : data.tags
          ? data.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],
      slug: finalSlug,
      isPublished: data.isPublished === true || data.isPublished === "true",
      publishedAt: data.isPublished === true || data.isPublished === "true" ? new Date() : null,
      videoUrl: data.videoUrl || null,
      videoThumbnail: data.videoThumbnail || null,
      quizData: data.quizData ? (typeof data.quizData === "string" ? JSON.parse(data.quizData) : data.quizData) : null,
      metaDescription: data.metaDescription || null,
    }

    console.log("Creating lesson with data:", lessonData)

    const lesson = await prisma.lesson.create({
      data: lessonData,
      include: {
        category: true,
      },
    })

    return lesson
  } catch (error) {
    console.error("Error creating lesson:", error)
    throw new Error(`Failed to create lesson: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
