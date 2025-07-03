import { SignIn } from "@clerk/nextjs"
import '../../../styles/auth.css'

export default function SignInPage() {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <p>Sign in to continue your learning journey</p>
        </div>
        <SignIn
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
