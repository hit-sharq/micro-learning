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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3B82F6; margin-bottom: 10px;">Welcome to Microlearning Coach!</h1>
          <p style="color: #6B7280; font-size: 16px;">Start your learning journey today</p>
        </div>
        
        <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin-bottom: 15px;">Hi ${userName},</p>
          <p style="margin-bottom: 15px;">We're excited to have you join our learning community! Get ready to master new skills in just minutes a day.</p>
          
          <div style="background: #EFF6FF; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="color: #1E40AF; margin-bottom: 10px;">🚀 Get Started:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li>Complete your profile setup</li>
              <li>Browse our lesson library</li>
              <li>Start your first lesson</li>
              <li>Build your learning streak</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" 
             style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
            Start Learning Now
          </a>
        </div>
        
        <div style="text-align: center; color: #6B7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
          <p>Happy learning!</p>
          <p>The Microlearning Coach Team</p>
        </div>
      </div>
    `,
  }

  // In a real app, you would use a service like SendGrid, Resend, or Nodemailer
  console.log("📧 Welcome email would be sent:", template)

  // Simulate email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✅ Welcome email sent to ${userEmail}`)
      resolve(true)
    }, 100)
  })
}

export async function sendStreakReminder(userEmail: string, userName: string, streak: number) {
  const template: EmailTemplate = {
    to: userEmail,
    subject: `Don't break your ${streak}-day streak! 🔥`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #F59E0B; margin-bottom: 10px;">Your streak is at risk! 🔥</h1>
        </div>
        
        <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin-bottom: 15px;">Hi ${userName},</p>
          <p style="margin-bottom: 15px;">You've built an amazing <strong>${streak}-day learning streak</strong>. Don't let it end today!</p>
          <p style="margin-bottom: 0;">Complete just one quick lesson to keep your momentum going.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/lessons" 
             style="background: #F59E0B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
            Continue Streak
          </a>
        </div>
      </div>
    `,
  }

  console.log("📧 Streak reminder would be sent:", template)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✅ Streak reminder sent to ${userEmail}`)
      resolve(true)
    }, 100)
  })
}

export async function sendAchievementEmail(userEmail: string, userName: string, achievement: any) {
  const template: EmailTemplate = {
    to: userEmail,
    subject: `🏆 Achievement Unlocked: ${achievement.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10B981; margin-bottom: 10px;">Achievement Unlocked! 🏆</h1>
        </div>
        
        <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin-bottom: 15px;">Hi ${userName},</p>
          <p style="margin-bottom: 15px;">Congratulations! You've unlocked the <strong>${achievement.name}</strong> achievement.</p>
          <p style="margin-bottom: 0;">${achievement.description}</p>
        </div>
        
        <div style="background: #ECFDF5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #10B981;">
          <div style="font-size: 48px; margin-bottom: 10px;">${achievement.icon}</div>
          <h3 style="color: #065F46; margin-bottom: 5px;">${achievement.name}</h3>
          <p style="color: #047857; font-weight: 500; margin: 0;">+${achievement.points} points earned!</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/achievements" 
             style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
            View All Achievements
          </a>
        </div>
      </div>
    `,
  }

  console.log("📧 Achievement email would be sent:", template)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✅ Achievement email sent to ${userEmail}`)
      resolve(true)
    }, 100)
  })
}

export async function sendDailyDigest(userEmail: string, userName: string, stats: any) {
  const template: EmailTemplate = {
    to: userEmail,
    subject: "Your Daily Learning Summary 📊",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3B82F6; text-align: center; margin-bottom: 20px;">Daily Learning Summary</h1>
        
        <p>Hi ${userName},</p>
        <p>Here's your learning progress for today:</p>
        
        <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #3B82F6;">${stats.lessonsCompleted}</div>
              <div style="color: #6B7280; font-size: 14px;">Lessons Completed</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #10B981;">${stats.timeSpent}m</div>
              <div style="color: #6B7280; font-size: 14px;">Time Spent</div>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" 
             style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Continue Learning
          </a>
        </div>
      </div>
    `,
  }

  console.log("📧 Daily digest would be sent:", template)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`✅ Daily digest sent to ${userEmail}`)
      resolve(true)
    }, 100)
  })
}
