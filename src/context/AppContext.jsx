import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth.jsx'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { user } = useAuth()

  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [books, setBooks] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch semua data serentak (parallel) sekali sahaja selepas login
  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const [clsRes, stuRes, bkRes, subRes] = await Promise.all([
      supabase.from('classes').select('*').eq('teacher_id', user.id).order('created_at', { ascending: true }),
      supabase.from('students').select('*').eq('teacher_id', user.id).order('name', { ascending: true }),
      supabase.from('books').select('*').eq('teacher_id', user.id).order('created_at', { ascending: true }),
      supabase.from('submissions')
        .select('*, students(id,name,class_id,classes(id,subject,year_name)), books(id,name,emoji)')
        .eq('teacher_id', user.id)
        .order('submitted_at', { ascending: false }),
    ])
    setClasses(clsRes.data || [])
    setStudents(stuRes.data || [])
    setBooks(bkRes.data || [])
    setSubmissions(subRes.data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (user) fetchAll()
    else {
      setClasses([]); setStudents([]); setBooks([]); setSubmissions([])
      setLoading(false)
    }
  }, [user, fetchAll])

  // ===== CLASSES CRUD =====
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

  // ===== STUDENTS CRUD =====
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

  // ===== BOOKS CRUD =====
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

  // ===== SUBMISSIONS CRUD =====
  async function toggleSubmission(studentId, bookId, submitted) {
    if (submitted) {
      const { error } = await supabase.from('submissions')
        .delete().eq('student_id', studentId).eq('book_id', bookId)
      if (!error) setSubmissions(s => s.filter(
        sub => !(sub.student_id === studentId && sub.book_id === bookId)
      ))
      return { error }
    } else {
      const { data, error } = await supabase.from('submissions')
        .insert({ teacher_id: user.id, student_id: studentId, book_id: bookId })
        .select('*, students(id,name,class_id,classes(id,subject,year_name)), books(id,name,emoji)')
        .single()
      if (!error) setSubmissions(s => [data, ...s])
      return { data, error }
    }
  }

  return (
    <AppContext.Provider value={{
      classes, students, books, submissions, loading,
      addClass, updateClass, deleteClass,
      addStudent, updateStudent, deleteStudent,
      addBook, updateBook, deleteBook,
      toggleSubmission, fetchAll,
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
