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

    // Get file content
    const buffer = Buffer.from(await file.arrayBuffer())
    const content = buffer.toString("utf-8")

    // Process based on file type
    let lessonData: any = {}

    if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      // Text/Markdown file
      lessonData = {
        title: file.name.replace(/\.(txt|md)$/, "").replace(/[-_]/g, " "),
        description: content.substring(0, 200) + "...",
        content: content,
        type: "TEXT",
        categoryId: 1, // Default to first category
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
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 })
      }
    } else if (file.name.endsWith(".csv")) {
      // CSV file
      const lines = content.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim())
      const lessons = []

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(",").map((v) => v.trim())
          const lessonObj: any = {}

          headers.forEach((header, index) => {
            lessonObj[header] = values[index] || ""
          })

          const lesson = await createLessonFromData(lessonObj)
          lessons.push(lesson)
        }
      }

      return NextResponse.json({ lessons }, { status: 201 })
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    // Create single lesson
    const lesson = await createLessonFromData(lessonData)
    return NextResponse.json({ lesson }, { status: 201 })
  } catch (error) {
    console.error("Bulk upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

async function createLessonFromData(data: any) {
  // Generate slug from title
  const slug = (data.title || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  // Ensure required fields have defaults
  const lessonData = {
    title: data.title || "Untitled Lesson",
    description: data.description || "No description provided",
    content: data.content || "",
    type: (data.type || "TEXT").toUpperCase(),
    categoryId: Number.parseInt(data.categoryId) || 1,
    difficulty: (data.difficulty || "BEGINNER").toUpperCase(),
    estimatedDuration: Number.parseInt(data.estimatedDuration) || 5,
    tags: Array.isArray(data.tags) ? data.tags : data.tags ? data.tags.split(",").map((t: string) => t.trim()) : [],
    slug: slug,
    isPublished: data.isPublished === true || data.isPublished === "true",
    publishedAt: data.isPublished ? new Date() : null,
    videoUrl: data.videoUrl || null,
    videoThumbnail: data.videoThumbnail || null,
    quizData: data.quizData || null,
    metaDescription: data.metaDescription || null,
  }

  const lesson = await prisma.lesson.create({
    data: lessonData,
    include: {
      category: true,
    },
  })

  return lesson
}
