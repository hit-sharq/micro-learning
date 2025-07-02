import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your learning journey</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "auth-button",
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
