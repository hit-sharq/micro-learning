import { auth } from "@clerk/nextjs/server"

export function isAdmin(userId: string): boolean {
  const adminIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []
  return adminIds.includes(userId)
}

export async function requireAdmin() {
  const { userId } = await auth()

  if (!userId || !isAdmin(userId)) {
    throw new Error("Unauthorized: Admin access required")
  }

  return userId
}

export async function checkAdminAccess(): Promise<boolean> {
  try {
    const { userId } = await auth()
    return userId ? isAdmin(userId) : false
  } catch {
    return false
  }
}
