import { auth } from "@clerk/nextjs/server"

export function isAdminUser(userId: string): boolean {
  const adminIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []
  console.log("Admin IDs from env:", adminIds)
  console.log("Checking user ID:", userId)
  return adminIds.includes(userId)
}

export async function requireAdmin() {
  const { userId } = await auth()
  console.log("RequireAdmin - User ID:", userId)

  if (!userId) {
    throw new Error("Not authenticated")
  }

  if (!isAdminUser(userId)) {
    console.log("User is not admin:", userId)
    throw new Error("Unauthorized: Admin access required")
  }

  console.log("Admin access granted for:", userId)
  return userId
}

export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth()
    console.log("IsAdmin check - User ID:", userId)

    if (!userId) {
      console.log("No user ID found")
      return false
    }

    const result = isAdminUser(userId)
    console.log("Admin check result:", result)
    return result
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

export async function checkAdminAccess(): Promise<boolean> {
  try {
    await requireAdmin()
    return true
  } catch {
    return false
  }
}
