-- Seed achievements data
INSERT INTO achievements (name, description, icon, type, criteria, points, is_active) VALUES
('First Steps', 'Complete your first lesson', '🎯', 'COMPLETION', '{"lessonsRequired": 1}', 10, true),
('Getting Started', 'Complete 5 lessons', '🚀', 'COMPLETION', '{"lessonsRequired": 5}', 25, true),
('Dedicated Learner', 'Complete 25 lessons', '📚', 'COMPLETION', '{"lessonsRequired": 25}', 100, true),
('Knowledge Seeker', 'Complete 50 lessons', '🧠', 'COMPLETION', '{"lessonsRequired": 50}', 250, true),
('Master Student', 'Complete 100 lessons', '🎓', 'COMPLETION', '{"lessonsRequired": 100}', 500, true),

('Day One', 'Start your learning streak', '🔥', 'STREAK', '{"streakRequired": 1}', 5, true),
('Week Warrior', 'Maintain a 7-day streak', '⚡', 'STREAK', '{"streakRequired": 7}', 50, true),
('Consistency King', 'Maintain a 30-day streak', '👑', 'STREAK', '{"streakRequired": 30}', 200, true),
('Unstoppable', 'Maintain a 100-day streak', '🏆', 'STREAK', '{"streakRequired": 100}', 1000, true),

('Perfect Score', 'Get 100% on any quiz', '💯', 'SCORE', '{"scoreRequired": 100, "countRequired": 1}', 20, true),
('Quiz Master', 'Get 90%+ on 10 quizzes', '🧩', 'SCORE', '{"scoreRequired": 90, "countRequired": 10}', 100, true),
('Excellence', 'Get 95%+ on 25 quizzes', '⭐', 'SCORE', '{"scoreRequired": 95, "countRequired": 25}', 300, true),

('Speed Learner', 'Complete 5 lessons in one day', '💨', 'SPECIAL', '{"dailyLessons": 5}', 75, true),
('Night Owl', 'Complete a lesson after 10 PM', '🦉', 'SPECIAL', '{"timeAfter": "22:00"}', 15, true),
('Early Bird', 'Complete a lesson before 7 AM', '🐦', 'SPECIAL', '{"timeBefore": "07:00"}', 15, true);
