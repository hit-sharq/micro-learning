import { prisma } from "./prisma"

export async function createBlog(data: {
  title: string
  slug: string
  description: string
  content: string
  excerpt?: string
  featuredImage?: string
  tags?: string[]
  category?: string
  createdBy: string
}) {
  return await prisma.blog.create({
    data: {
      ...data,
      tags: data.tags || [],
    },
  })
}

export async function updateBlog(
  id: number,
  data: {
    title?: string
    slug?: string
    description?: string
    content?: string
    excerpt?: string
    featuredImage?: string
    tags?: string[]
    category?: string
    isPublished?: boolean
    publishedAt?: Date
    lastEditedBy?: string
  },
) {
  return await prisma.blog.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })
}

export async function deleteBlog(id: number) {
  return await prisma.blog.delete({
    where: { id },
  })
}

export async function getBlogById(id: number) {
  return await prisma.blog.findUnique({
    where: { id },
  })
}

export async function getBlogBySlug(slug: string) {
  return await prisma.blog.findUnique({
    where: { slug },
  })
}

export async function getAllBlogs(published = true) {
  return await prisma.blog.findMany({
    where: published ? { isPublished: true } : {},
    orderBy: { publishedAt: "desc" },
  })
}

export async function searchBlogs(query: string) {
  return await prisma.blog.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: [query] } },
      ],
    },
    orderBy: { publishedAt: "desc" },
  })
}

export async function getBlogsByCategory(category: string) {
  return await prisma.blog.findMany({
    where: {
      isPublished: true,
      category,
    },
    orderBy: { publishedAt: "desc" },
  })
}
