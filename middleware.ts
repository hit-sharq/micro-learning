import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

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

export default clerkMiddleware((auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) return

  // Protect all other routes
  if (isProtectedRoute(req)) {
    auth().protect()
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
