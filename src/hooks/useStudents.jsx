import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

export function useStudents(classId = null) {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchStudents()
  }, [user, classId])

  async function fetchStudents() {
    setLoading(true)
    let query = supabase
      .from('students')
      .select('*')
      .eq('teacher_id', user.id)
      .order('name', { ascending: true })
    if (classId) query = query.eq('class_id', classId)
    const { data } = await query
    setStudents(data || [])
    setLoading(false)
  }

  async function addStudent(name, classId, studentNo = '') {
    const { data, error } = await supabase
      .from('students')
      .insert({ teacher_id: user.id, class_id: classId, name, student_no: studentNo })
      .select()
      .single()
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

  return { students, loading, fetchStudents, addStudent, updateStudent, deleteStudent }
}
