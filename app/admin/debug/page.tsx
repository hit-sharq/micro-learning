import { auth } from "@clerk/nextjs/server"
import { isAdmin, isAdminUser } from "@/lib/admin"
import { BackButton } from "@/components/back-button"

export default async function AdminDebugPage() {
  const { userId } = await auth()
  const adminCheck = await isAdmin()
  const directCheck = userId ? isAdminUser(userId) : false

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Debug Information</h1>
          <BackButton href="/admin" />
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4 mb-8">
          <div>
            <strong>Current User ID:</strong>
            <p className="text-gray-600 break-all">{userId || "Not logged in"}</p>
          </div>

          <div>
            <strong>Environment ADMIN_USER_IDS:</strong>
            <p className="text-gray-600 break-all">{process.env.ADMIN_USER_IDS || "Not set"}</p>
          </div>

          <div>
            <strong>Parsed Admin IDs:</strong>
            <p className="text-gray-600 break-all">
              {JSON.stringify(process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || [])}
            </p>
          </div>

          <div>
            <strong>isAdmin() result:</strong>
            <p className="text-gray-600">{adminCheck ? "true" : "false"}</p>
          </div>

          <div>
            <strong>Direct isAdminUser() result:</strong>
            <p className="text-gray-600">{directCheck ? "true" : "false"}</p>
          </div>

          <div>
            <strong>User ID in admin list:</strong>
            <p className="text-gray-600">
              {userId &&
              process.env.ADMIN_USER_IDS?.split(",")
                .map((id) => id.trim())
                .includes(userId)
                ? "Yes"
                : "No"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm sm:text-base">
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
