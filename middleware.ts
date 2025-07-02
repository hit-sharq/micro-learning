import { NextResponse, NextRequest } from "next/server"
import { clerkMiddleware, createRouteMatcher, getAuth } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/lessons(.*)",
  "/progress(.*)",
  "/achievements(.*)",
  "/bookmarks(.*)",
  "/profile(.*)",
  "/admin(.*)",
  "/api/lessons(.*)",
  "/api/progress(.*)",
  "/api/bookmarks(.*)",
])

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) return NextResponse.next()

  // Protect all other routes
  if (isProtectedRoute(req)) {
    const authState = await auth()
    if (!authState.userId) {
      // Redirect to sign-in if not authenticated
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }
  }
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
