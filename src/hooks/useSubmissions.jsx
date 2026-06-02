import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

export function useSubmissions() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchSubmissions()
  }, [user])

  async function fetchSubmissions() {
    setLoading(true)
    const { data } = await supabase
      .from('submissions')
      .select(`
        *,
        students(id, name, class_id, classes(id, subject, year_name)),
        books(id, name, emoji)
      `)
      .eq('teacher_id', user.id)
      .order('submitted_at', { ascending: false })
    setSubmissions(data || [])
    setLoading(false)
  }

  async function toggleSubmission(studentId, bookId, submitted) {
    if (submitted) {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('student_id', studentId)
        .eq('book_id', bookId)
      if (!error) setSubmissions(s => s.filter(
        sub => !(sub.student_id === studentId && sub.book_id === bookId)
      ))
      return { error }
    } else {
      const { data, error } = await supabase
        .from('submissions')
        .insert({ teacher_id: user.id, student_id: studentId, book_id: bookId })
        .select(`*, students(id, name, class_id, classes(id, subject, year_name)), books(id, name, emoji)`)
        .single()
      if (!error) setSubmissions(s => [data, ...s])
      return { data, error }
    }
  }

  return { submissions, loading, fetchSubmissions, toggleSubmission }
}
