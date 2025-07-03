import { SignUp } from "@clerk/nextjs"
import '../../../styles/auth.css'

export default function SignUpPage() {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1>Join Microlearning Coach</h1>
          <p>Start your personalized learning journey today</p>
        </div>
        <SignUp
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
