import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/lessons",
  "/lessons/(.*)",
  "/api/lessons",
  "/api/lessons/(.*)",
  "/api/webhooks/(.*)",
])

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Handle admin routes
  if (isAdminRoute(req)) {
    if (!userId) {
      if (req.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    // Check if user is admin
    const adminUserIds = process.env.ADMIN_USER_IDS?.split(",") || []
    if (!adminUserIds.includes(userId)) {
      if (req.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Handle protected routes
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
