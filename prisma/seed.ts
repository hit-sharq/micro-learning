const { PrismaClient, AchievementType } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const achievements = [
    {
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      type: AchievementType.COMPLETION,
      criteria: { lessonsRequired: 1 },
      points: 10,
      isActive: true,
    },
    {
      name: 'Getting Started',
      description: 'Complete 5 lessons',
      icon: '🚀',
      type: AchievementType.COMPLETION,
      criteria: { lessonsRequired: 5 },
      points: 25,
      isActive: true,
    },
    {
      name: 'Dedicated Learner',
      description: 'Complete 25 lessons',
      icon: '📚',
      type: AchievementType.COMPLETION,
      criteria: { lessonsRequired: 25 },
      points: 100,
      isActive: true,
    },
    {
      name: 'Knowledge Seeker',
      description: 'Complete 50 lessons',
      icon: '🧠',
      type: AchievementType.COMPLETION,
      criteria: { lessonsRequired: 50 },
      points: 250,
      isActive: true,
    },
    {
      name: 'Master Student',
      description: 'Complete 100 lessons',
      icon: '🎓',
      type: AchievementType.COMPLETION,
      criteria: { lessonsRequired: 100 },
      points: 500,
      isActive: true,
    },
    {
      name: 'Day One',
      description: 'Start your learning streak',
      icon: '🔥',
      type: AchievementType.STREAK,
      criteria: { streakRequired: 1 },
      points: 5,
      isActive: true,
    },
    {
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '⚡',
      type: AchievementType.STREAK,
      criteria: { streakRequired: 7 },
      points: 50,
      isActive: true,
    },
    {
      name: 'Consistency King',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      type: AchievementType.STREAK,
      criteria: { streakRequired: 30 },
      points: 200,
      isActive: true,
    },
    {
      name: 'Unstoppable',
      description: 'Maintain a 100-day streak',
      icon: '🏆',
      type: AchievementType.STREAK,
      criteria: { streakRequired: 100 },
      points: 1000,
      isActive: true,
    },
    {
      name: 'Perfect Score',
      description: 'Get 100% on any quiz',
      icon: '💯',
      type: AchievementType.SCORE,
      criteria: { scoreRequired: 100, countRequired: 1 },
      points: 20,
      isActive: true,
    },
    {
      name: 'Quiz Master',
      description: 'Get 90%+ on 10 quizzes',
      icon: '🧩',
      type: AchievementType.SCORE,
      criteria: { scoreRequired: 90, countRequired: 10 },
      points: 100,
      isActive: true,
    },
    {
      name: 'Excellence',
      description: 'Get 95%+ on 25 quizzes',
      icon: '⭐',
      type: AchievementType.SCORE,
      criteria: { scoreRequired: 95, countRequired: 25 },
      points: 300,
      isActive: true,
    },
    {
      name: 'Speed Learner',
      description: 'Complete 5 lessons in one day',
      icon: '💨',
      type: AchievementType.SPECIAL,
      criteria: { dailyLessons: 5 },
      points: 75,
      isActive: true,
    },
    {
      name: 'Night Owl',
      description: 'Complete a lesson after 10 PM',
      icon: '🦉',
      type: AchievementType.SPECIAL,
      criteria: { timeAfter: '22:00' },
      points: 15,
      isActive: true,
    },
    {
      name: 'Early Bird',
      description: 'Complete a lesson before 7 AM',
      icon: '🐦',
      type: AchievementType.SPECIAL,
      criteria: { timeBefore: '07:00' },
      points: 15,
      isActive: true,
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
