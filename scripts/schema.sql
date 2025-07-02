-- Create database schema for Microlearning Coach

-- Users table (Clerk handles auth, this stores additional user data)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories for organizing lessons
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    type TEXT NOT NULL CHECK (type IN ('text', 'video', 'quiz')),
    video_url TEXT,
    quiz_data JSONB,
    category_id INTEGER REFERENCES categories(id),
    difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_duration INTEGER DEFAULT 5, -- in minutes
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    lesson_id INTEGER REFERENCES lessons(id),
    completed BOOLEAN DEFAULT false,
    score INTEGER, -- for quizzes
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Daily streaks tracking
CREATE TABLE IF NOT EXISTS user_streaks (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(id) UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name, description, color) VALUES
('Programming', 'Learn coding fundamentals and advanced concepts', '#3B82F6'),
('Data Science', 'Master data analysis and machine learning', '#8B5CF6'),
('Design', 'UI/UX design principles and tools', '#EC4899'),
('Business', 'Leadership, strategy, and entrepreneurship', '#10B981'),
('Marketing', 'Digital marketing and growth strategies', '#F59E0B');

-- Insert sample lessons
INSERT INTO lessons (title, description, content, type, category_id, difficulty, estimated_duration, is_published) VALUES
('JavaScript Basics', 'Learn the fundamentals of JavaScript programming', 'JavaScript is a versatile programming language used for web development. In this lesson, we''ll cover variables, functions, and basic syntax.', 'text', 1, 'beginner', 5, true),
('React Components', 'Understanding React functional components', 'React components are the building blocks of React applications. Learn how to create and use functional components effectively.', 'text', 1, 'intermediate', 7, true),
('Data Visualization', 'Introduction to data visualization principles', 'Learn the key principles of effective data visualization and how to choose the right chart types for your data.', 'text', 2, 'beginner', 6, true),
('CSS Flexbox Quiz', 'Test your knowledge of CSS Flexbox', '', 'quiz', 1, 'intermediate', 3, true);

-- Insert sample quiz data
UPDATE lessons SET quiz_data = '{
  "questions": [
    {
      "question": "What does ''justify-content: center'' do in Flexbox?",
      "options": ["Centers items vertically", "Centers items horizontally", "Distributes space evenly", "Aligns items to the start"],
      "correct": 1
    },
    {
      "question": "Which property controls the main axis in Flexbox?",
      "options": ["align-items", "justify-content", "flex-direction", "flex-wrap"],
      "correct": 1
    }
  ]
}' WHERE title = 'CSS Flexbox Quiz';
