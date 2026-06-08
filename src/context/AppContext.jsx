import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth.jsx'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { user } = useAuth()

  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [books, setBooks] = useState([])
  const [sessions, setSessions] = useState([])
  const [sessionRecords, setSessionRecords] = useState([])
  const [loading, setLoading] = useState(true)

  const userId = user?.id ?? null

  const fetchAll = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const [clsRes, stuRes, bkRes, sesRes, recRes] = await Promise.all([
      supabase.from('classes').select('*').eq('teacher_id', userId).order('created_at', { ascending: true }),
      supabase.from('students').select('*').eq('teacher_id', userId).order('name', { ascending: true }),
      supabase.from('books').select('*').eq('teacher_id', userId).order('created_at', { ascending: true }),
      supabase.from('check_sessions')
        .select('*, books(id,name,emoji), classes(id,subject,year_name)')
        .eq('teacher_id', userId)
        .order('checked_at', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100),
      supabase.from('session_records').select('*'),
    ])
    setClasses(clsRes.data || [])
    setStudents(stuRes.data || [])
    setBooks(bkRes.data || [])
    setSessions(sesRes.data || [])
    setSessionRecords(recRes.data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    if (userId) fetchAll()
    else {
      setClasses([]); setStudents([]); setBooks([])
      setSessions([]); setSessionRecords([])
      setLoading(false)
    }
  }, [userId, fetchAll])

  // ===== CLASSES =====
  async function addClass(subject, yearName, color = 'blue') {
    const { data, error } = await supabase
      .from('classes').insert({ teacher_id: user.id, subject, year_name: yearName, color })
      .select().single()
    if (!error) setClasses(c => [...c, data])
    return { data, error }
  }
  async function updateClass(id, updates) {
    const { error } = await supabase.from('classes').update(updates).eq('id', id)
    if (!error) setClasses(c => c.map(cls => cls.id === id ? { ...cls, ...updates } : cls))
    return { error }
  }
  async function deleteClass(id) {
    const { error } = await supabase.from('classes').delete().eq('id', id)
    if (!error) {
      setClasses(c => c.filter(cls => cls.id !== id))
      setStudents(s => s.filter(st => st.class_id !== id))
    }
    return { error }
  }

  // ===== STUDENTS =====
  async function addStudent(name, classId, studentNo = '') {
    const { data, error } = await supabase
      .from('students').insert({ teacher_id: user.id, class_id: classId, name, student_no: studentNo })
      .select().single()
    if (!error) setStudents(s => [...s, data].sort((a, b) => a.name.localeCompare(b.name)))
    return { data, error }
  }
  async function updateStudent(id, updates) {
    const { error } = await supabase.from('students').update(updates).eq('id', id)
    if (!error) setStudents(s => s.map(st => st.id === id ? { ...st, ...updates } : st))
    return { error }
  }
  async function deleteStudent(id) {
    const { error } = await supabase.from('students').delete().eq('id', id)
    if (!error) setStudents(s => s.filter(st => st.id !== id))
    return { error }
  }

  // ===== BOOKS =====
  async function addBook(name, emoji = '📚', bookClassId = null) {
    const { data, error } = await supabase
      .from('books').insert({ teacher_id: user.id, class_id: bookClassId, name, emoji })
      .select().single()
    if (!error) setBooks(b => [...b, data])
    return { data, error }
  }
  async function updateBook(id, updates) {
    const { error } = await supabase.from('books').update(updates).eq('id', id)
    if (!error) setBooks(b => b.map(bk => bk.id === id ? { ...bk, ...updates } : bk))
    return { error }
  }
  async function deleteBook(id) {
    const { error } = await supabase.from('books').delete().eq('id', id)
    if (!error) setBooks(b => b.filter(bk => bk.id !== id))
    return { error }
  }

  // ===== SESSIONS =====
  async function createSession(classId, bookId, checkedAt, notes = '') {
    const { data, error } = await supabase
      .from('check_sessions')
      .insert({ teacher_id: user.id, class_id: classId, book_id: bookId, checked_at: checkedAt, notes })
      .select('*, books(id,name,emoji), classes(id,subject,year_name)')
      .single()
    if (!error) setSessions(s => [data, ...s])
    return { data, error }
  }

  // Upsert rekod murid (present semasa scan, absent pada selesai sesi)
  async function upsertSessionRecord(sessionId, studentId, status, note = null, scannedAt = null) {
    const payload = { session_id: sessionId, student_id: studentId, status, note }
    if (scannedAt) payload.scanned_at = scannedAt
    const { data, error } = await supabase
      .from('session_records')
      .upsert(payload, { onConflict: 'session_id,student_id' })
      .select().single()
    if (!error) {
      setSessionRecords(r => {
        const exists = r.find(x => x.session_id === sessionId && x.student_id === studentId)
        return exists
          ? r.map(x => x.session_id === sessionId && x.student_id === studentId ? data : x)
          : [...r, data]
      })
    }
    return { data, error }
  }

  // Kemaskini nota murid absent
  async function updateSessionNote(sessionId, studentId, note) {
    const { error } = await supabase
      .from('session_records')
      .update({ note })
      .eq('session_id', sessionId)
      .eq('student_id', studentId)
    if (!error) {
      setSessionRecords(r => r.map(x =>
        x.session_id === sessionId && x.student_id === studentId ? { ...x, note } : x
      ))
    }
    return { error }
  }

  async function deleteSession(id) {
    const { error } = await supabase.from('check_sessions').delete().eq('id', id)
    if (!error) {
      setSessions(s => s.filter(x => x.id !== id))
      setSessionRecords(r => r.filter(x => x.session_id !== id))
    }
    return { error }
  }

  return (
    <AppContext.Provider value={{
      classes, students, books, sessions, sessionRecords, loading,
      addClass, updateClass, deleteClass,
      addStudent, updateStudent, deleteStudent,
      addBook, updateBook, deleteBook,
      createSession, upsertSessionRecord, updateSessionNote, deleteSession,
      fetchAll,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext mesti digunakan dalam AppProvider')
  return ctx
}
