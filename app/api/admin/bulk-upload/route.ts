import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

interface LessonData {
  title: string
  description: string
  content: string
  type: string
  categoryId: number
  difficulty: string
  estimatedDuration: number
  tags?: string[]
  videoUrl?: string
  videoThumbnail?: string
  quizData?: any
  metaDescription?: string
  isPublished?: boolean
}

export async function POST(request: NextRequest) {
  try {
    // Check admin access first
    await requireAdmin()

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    console.log(`Processing ${files.length} files`)

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
      lessons: [] as any[],
    }

    // Get default category
    const defaultCategory = await prisma.category.findFirst({
      orderBy: { id: "asc" },
    })

    if (!defaultCategory) {
      return NextResponse.json({ error: "No categories found. Please create a category first." }, { status: 400 })
    }

    // Check if categoryId is provided in formData
    const categoryIdFromForm = formData.get("categoryId") as string
    const selectedCategoryId = categoryIdFromForm ? parseInt(categoryIdFromForm) : defaultCategory.id

    for (const file of files) {
      try {
        const content = await file.text()
        const fileName = file.name
        const fileExtension = fileName.split(".").pop()?.toLowerCase()

        console.log(`Processing file: ${fileName} (${fileExtension})`)

        let lessonsToCreate: LessonData[] = []

        switch (fileExtension) {
          case "txt":
          case "md":
            // Simple text/markdown file
            lessonsToCreate = [
              {
                title: fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                description: `Lesson created from ${fileName}`,
                content: content,
                type: "TEXT",
                categoryId: selectedCategoryId,
                difficulty: "BEGINNER",
                estimatedDuration: Math.max(5, Math.ceil(content.length / 200)), // Rough reading time
                tags: ["bulk-upload"],
                isPublished: false,
              },
            ]
            break

          case "json":
            try {
              const jsonData = JSON.parse(content)
              if (Array.isArray(jsonData)) {
                lessonsToCreate = jsonData.map((lesson: any) => ({
                  title: lesson.title || "Untitled Lesson",
                  description: lesson.description || "No description provided",
                  content: lesson.content || "",
                  type: lesson.type?.toUpperCase() || "TEXT",
                  categoryId: lesson.categoryId || selectedCategoryId,
                  difficulty: lesson.difficulty?.toUpperCase() || "BEGINNER",
                  estimatedDuration: lesson.estimatedDuration || 10,
                  tags: lesson.tags || ["bulk-upload"],
                  videoUrl: lesson.videoUrl,
                  videoThumbnail: lesson.videoThumbnail,
                  quizData: lesson.quizData,
                  metaDescription: lesson.metaDescription,
                  isPublished: lesson.isPublished || false,
                }))
              } else {
                lessonsToCreate = [
                  {
                    title: jsonData.title || fileName.replace(/\.[^/.]+$/, ""),
                    description: jsonData.description || "No description provided",
                    content: jsonData.content || "",
                    type: jsonData.type?.toUpperCase() || "TEXT",
                  categoryId: jsonData.categoryId || selectedCategoryId,
                    difficulty: jsonData.difficulty?.toUpperCase() || "BEGINNER",
                    estimatedDuration: jsonData.estimatedDuration || 10,
                    tags: jsonData.tags || ["bulk-upload"],
                    videoUrl: jsonData.videoUrl,
                    videoThumbnail: jsonData.videoThumbnail,
                    quizData: jsonData.quizData,
                    metaDescription: jsonData.metaDescription,
                    isPublished: jsonData.isPublished || false,
                  },
                ]
              }
            } catch (parseError) {
              results.failed++
              results.errors.push(`${fileName}: Invalid JSON format`)
              continue
            }
            break

          case "csv":
            try {
              const lines = content.split("\n").filter((line) => line.trim())
              if (lines.length < 2) {
                results.failed++
                results.errors.push(`${fileName}: CSV must have at least a header and one data row`)
                continue
              }

              const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
              const dataLines = lines.slice(1)

              lessonsToCreate = dataLines.map((line) => {
                const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
                const lessonData: any = {}

                headers.forEach((header, index) => {
                  lessonData[header] = values[index] || ""
                })

                return {
                  title: lessonData.title || "Untitled Lesson",
                  description: lessonData.description || "No description provided",
                  content: lessonData.content || "",
                  type: lessonData.type?.toUpperCase() || "TEXT",
                  categoryId: lessonData.categoryId ? Number.parseInt(lessonData.categoryId) : selectedCategoryId,
                  difficulty: lessonData.difficulty?.toUpperCase() || "BEGINNER",
                  estimatedDuration: lessonData.estimatedDuration ? Number.parseInt(lessonData.estimatedDuration) : 10,
                  tags: lessonData.tags ? lessonData.tags.split(";") : ["bulk-upload"],
                  videoUrl: lessonData.videoUrl,
                  videoThumbnail: lessonData.videoThumbnail,
                  metaDescription: lessonData.metaDescription,
                  isPublished: lessonData.isPublished === "true",
                }
              })
            } catch (parseError) {
              results.failed++
              results.errors.push(`${fileName}: Error parsing CSV`)
              continue
            }
            break

          default:
            results.failed++
            results.errors.push(`${fileName}: Unsupported file type`)
            continue
        }

        // Create lessons in database
        for (const lessonData of lessonsToCreate) {
          try {
            // Generate unique slug
            const baseSlug = lessonData.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")

            let slug = baseSlug
            let counter = 1
            while (await prisma.lesson.findUnique({ where: { slug } })) {
              slug = `${baseSlug}-${counter}`
              counter++
            }

            const lesson = await prisma.lesson.create({
              data: {
                title: lessonData.title,
                description: lessonData.description,
                content: lessonData.content,
                type: lessonData.type as any,
                categoryId: lessonData.categoryId,
                difficulty: lessonData.difficulty as any,
                estimatedDuration: lessonData.estimatedDuration,
                tags: lessonData.tags || [],
                videoUrl: lessonData.videoUrl,
                videoThumbnail: lessonData.videoThumbnail,
                quizData: lessonData.quizData,
                slug,
                metaDescription: lessonData.metaDescription,
                isPublished: lessonData.isPublished || false,
                publishedAt: lessonData.isPublished ? new Date() : null,
              },
              include: {
                category: true,
              },
            })

            results.successful++
            results.lessons.push(lesson)
            console.log(`Created lesson: ${lesson.title}`)
          } catch (dbError) {
            console.error(`Database error for lesson ${lessonData.title}:`, dbError)
            results.failed++
            results.errors.push(`${lessonData.title}: Database error`)
          }
        }
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError)
        results.failed++
        results.errors.push(`${file.name}: Processing error`)
      }
    }

    console.log(`Bulk upload completed: ${results.successful} successful, ${results.failed} failed`)

    return NextResponse.json({
      message: `Bulk upload completed. ${results.successful} successful, ${results.failed} failed.`,
      results,
    })
  } catch (error) {
    console.error("Bulk upload error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process bulk upload",
      },
      { status: error instanceof Error && error.message.includes("Unauthorized") ? 403 : 500 },
    )
  }
}
