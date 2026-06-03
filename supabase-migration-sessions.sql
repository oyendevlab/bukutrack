-- ============================================================
-- BukuTrack — Migration: Sesi Semakan
-- Jalankan dalam Supabase SQL Editor
-- Menggantikan sistem submissions lama
-- ============================================================

-- 1. TABLE: Sesi Semakan
CREATE TABLE IF NOT EXISTS check_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  book_id     UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  checked_at  DATE NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLE: Rekod murid dalam sesi
CREATE TABLE IF NOT EXISTS session_records (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES check_sessions(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'absent',  -- 'present' | 'absent'
  note        TEXT,
  scanned_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- 3. RLS
ALTER TABLE check_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_records ENABLE ROW LEVEL SECURITY;

-- 4. Policies
CREATE POLICY "sessions_own" ON check_sessions
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "session_records_own" ON session_records
  FOR ALL USING (
    auth.uid() = (SELECT teacher_id FROM check_sessions WHERE id = session_id)
  );

-- 5. (Pilihan) Padam submissions lama selepas berpuas hati
-- DROP TABLE IF EXISTS submissions;
