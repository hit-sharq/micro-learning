import { SignUp } from "@clerk/nextjs"
import { BackButton } from "@/components/premium"
import '../../../styles/auth.css'

export default function SignUpPage() {
  return (
    <div className="auth-container relative">
      <div className="absolute top-4 left-4 z-10 pt-2"><BackButton /></div>
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1>Join Microlearning Coach</h1>
          <p>Start your personalized learning journey today</p>
        </div>
        <SignUp
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
