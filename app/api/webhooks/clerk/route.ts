import type { NextRequest } from "next/server"
import { Webhook } from "svix"
import { createUserInDatabase } from "@/lib/database-operations"
import { sendWelcomeEmail } from "@/lib/email-service"

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local")
  }

  // Get the headers
  const headerPayload = req.headers
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error occured", {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === "user.created") {
    try {
      const user = await createUserInDatabase(evt.data)

      // Send welcome email
      if (user.email) {
        await sendWelcomeEmail(user.email, user.name)
      }

      console.log("User created successfully:", user.id)
    } catch (error) {
      console.error("Error creating user:", error)
      return new Response("Error creating user", { status: 500 })
    }
  }

  if (eventType === "user.updated") {
    try {
      // Update user in database if needed
      console.log("User updated:", evt.data.id)
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  return new Response("", { status: 200 })
}
