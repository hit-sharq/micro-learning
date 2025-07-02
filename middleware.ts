import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"])
const isAdminRoute = createRouteMatcher(["/admin(.*)"])

export default clerkMiddleware(async (auth, req) => {
  console.log("Middleware - Path:", req.nextUrl.pathname)

  // Allow public routes
  if (isPublicRoute(req)) {
    console.log("Public route, allowing access")
    return
  }

  // Get user info
  const { userId } = await auth()
  console.log("Middleware - User ID:", userId)

  if (!userId) {
    console.log("No user ID, redirecting to sign-in")
    return auth().redirectToSignIn()
  }

  // Check admin routes
  if (isAdminRoute(req)) {
    console.log("Admin route detected")
    const adminIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []
    console.log("Admin IDs:", adminIds)
    console.log("Current user ID:", userId)

    if (!adminIds.includes(userId)) {
      console.log("User is not admin, redirecting to dashboard")
      return Response.redirect(new URL("/dashboard", req.url))
    }

    console.log("Admin access granted")
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
