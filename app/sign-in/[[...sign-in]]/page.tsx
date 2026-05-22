import { SignIn } from "@clerk/nextjs"
import { BackButton } from "@/components/premium"
import '../../../styles/auth.css'

export default function SignInPage() {
  return (
    <div className="auth-container relative">
      <div className="absolute top-4 left-4 z-10 pt-2"><BackButton /></div>
      <div className="auth-wrapper">
        <div className="auth-header">
          <p>Sign in to continue your learning journey</p>
        </div>
        <SignIn
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: "btn btn-primary",
              card: "auth-card",
              headerTitle: "auth-title",
              headerSubtitle: "auth-subtitle",
            },
          }}
        />
      </div>
    </div>
  )
}
