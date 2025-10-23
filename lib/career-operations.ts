import { prisma } from "./prisma"

export async function createCareer(data: {
  title: string
  slug: string
  description: string
  content: string
  department: string
  location: string
  jobType?: string
  experience?: string
  salary?: string
  requirements?: string[]
  benefits?: string[]
  createdBy: string
}) {
  return await prisma.career.create({
    data: {
      ...data,
      requirements: data.requirements || [],
      benefits: data.benefits || [],
    },
  })
}

export async function updateCareer(
  id: number,
  data: {
    title?: string
    slug?: string
    description?: string
    content?: string
    department?: string
    location?: string
    jobType?: string
    experience?: string
    salary?: string
    requirements?: string[]
    benefits?: string[]
    isPublished?: boolean
    publishedAt?: Date
    expiresAt?: Date
    lastEditedBy?: string
  },
) {
  return await prisma.career.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })
}

export async function deleteCareer(id: number) {
  return await prisma.career.delete({
    where: { id },
  })
}

export async function getCareerById(id: number) {
  return await prisma.career.findUnique({
    where: { id },
  })
}

export async function getCareerBySlug(slug: string) {
  return await prisma.career.findUnique({
    where: { slug },
  })
}

export async function getAllCareers(published = true) {
  const where: any = {}
  if (published) {
    where.isPublished = true
    where.expiresAt = { gte: new Date() }
  }
  return await prisma.career.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  })
}

export async function searchCareers(query: string) {
  return await prisma.career.findMany({
    where: {
      isPublished: true,
      expiresAt: { gte: new Date() },
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { department: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { publishedAt: "desc" },
  })
}

export async function getCareersByDepartment(department: string) {
  return await prisma.career.findMany({
    where: {
      isPublished: true,
      expiresAt: { gte: new Date() },
      department,
    },
    orderBy: { publishedAt: "desc" },
  })
}

export async function getCareersByLocation(location: string) {
  return await prisma.career.findMany({
    where: {
      isPublished: true,
      expiresAt: { gte: new Date() },
      location,
    },
    orderBy: { publishedAt: "desc" },
  })
}
