-- Enable Row Level Security on existing tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Lessons table policies
CREATE POLICY "Users can view their own lessons" ON lessons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lessons" ON lessons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lessons" ON lessons
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lessons" ON lessons
  FOR DELETE USING (auth.uid() = user_id);
