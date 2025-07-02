// Email notification service (needs implementation)

interface EmailTemplate {
  to: string
  subject: string
  html: string
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const template: EmailTemplate = {
    to: userEmail,
    subject: "Welcome to Microlearning Coach! 🎯",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Welcome to Microlearning Coach!</h1>
        <p>Hi ${userName},</p>
        <p>We're excited to have you join our learning community! Get ready to master new skills in just minutes a day.</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>🚀 Get Started:</h3>
          <ul>
            <li>Complete your profile setup</li>
            <li>Browse our lesson library</li>
            <li>Start your first lesson</li>
            <li>Build your learning streak</li>
          </ul>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Start Learning
        </a>
      </div>
    `,
  }

  // TODO: Implement with email service (SendGrid, Resend, etc.)
  console.log("Would send email:", template)
}

export async function sendStreakReminder(userEmail: string, userName: string, streak: number) {
  const template: EmailTemplate = {
    to: userEmail,
    subject: `Don't break your ${streak}-day streak! 🔥`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F59E0B;">Your streak is at risk! 🔥</h1>
        <p>Hi ${userName},</p>
        <p>You've built an amazing ${streak}-day learning streak. Don't let it end today!</p>
        <p>Complete just one quick lesson to keep your momentum going.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/lessons" 
           style="background: #F59E0B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Continue Streak
        </a>
      </div>
    `,
  }

  console.log("Would send streak reminder:", template)
}

export async function sendAchievementEmail(userEmail: string, userName: string, achievement: any) {
  const template: EmailTemplate = {
    to: userEmail,
    subject: `🏆 Achievement Unlocked: ${achievement.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">Achievement Unlocked! 🏆</h1>
        <p>Hi ${userName},</p>
        <p>Congratulations! You've unlocked the <strong>${achievement.name}</strong> achievement.</p>
        <p>${achievement.description}</p>
        <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">${achievement.icon}</div>
          <h3>${achievement.name}</h3>
          <p>+${achievement.points} points earned!</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/achievements" 
           style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View All Achievements
        </a>
      </div>
    `,
  }

  console.log("Would send achievement email:", template)
}
