-- ============================================================
-- BukuTrack — Supabase Database Setup
-- Jalankan SQL ini dalam Supabase SQL Editor (satu kali sahaja)
-- ============================================================

-- 1. JADUAL

CREATE TABLE IF NOT EXISTS teachers (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  school_name TEXT,
  language    TEXT DEFAULT 'bm',
  theme       TEXT DEFAULT 'blue',
  style       TEXT DEFAULT 'minimal',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject    TEXT NOT NULL,
  year_name  TEXT NOT NULL,
  color      TEXT DEFAULT 'blue',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id   UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  student_no TEXT,
  qr_code    TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id   UUID REFERENCES classes(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  emoji      TEXT DEFAULT '📚',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id   UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  book_id      UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, book_id)
);

-- 2. ROW LEVEL SECURITY

ALTER TABLE teachers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE students    ENABLE ROW LEVEL SECURITY;
ALTER TABLE books       ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES

CREATE POLICY "teachers_own" ON teachers
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "classes_own" ON classes
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "students_own" ON students
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "books_own" ON books
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "submissions_own" ON submissions
  FOR ALL USING (auth.uid() = teacher_id);

-- 4. AUTO-CREATE TEACHER PROFILE SELEPAS DAFTAR
-- Trigger ini mencipta rekod dalam teachers selepas user mendaftar

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.teachers (id, name, email, school_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'school_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
