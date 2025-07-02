import { auth } from "@clerk/nextjs/server"
import { isAdmin, isAdminUser } from "@/lib/admin"

export default async function AdminDebugPage() {
  const { userId } = await auth()
  const adminCheck = await isAdmin()
  const directCheck = userId ? isAdminUser(userId) : false

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Debug Information</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <strong>Current User ID:</strong> {userId || "Not logged in"}
          </div>

          <div>
            <strong>Environment ADMIN_USER_IDS:</strong> {process.env.ADMIN_USER_IDS || "Not set"}
          </div>

          <div>
            <strong>Parsed Admin IDs:</strong>{" "}
            {JSON.stringify(process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || [])}
          </div>

          <div>
            <strong>isAdmin() result:</strong> {adminCheck ? "true" : "false"}
          </div>

          <div>
            <strong>Direct isAdminUser() result:</strong> {directCheck ? "true" : "false"}
          </div>

          <div>
            <strong>User ID in admin list:</strong>{" "}
            {userId &&
            process.env.ADMIN_USER_IDS?.split(",")
              .map((id) => id.trim())
              .includes(userId)
              ? "Yes"
              : "No"}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Make sure your .env.local file has ADMIN_USER_IDS set</li>
            <li>The format should be: ADMIN_USER_IDS=user_abc123,user_def456</li>
            <li>Use your actual Clerk user ID (found in Clerk dashboard)</li>
            <li>Restart your development server after changing .env.local</li>
            <li>Check the console logs for debugging information</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
