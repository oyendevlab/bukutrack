import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

export function useClasses() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchClasses()
  }, [user])

  async function fetchClasses() {
    setLoading(true)
    const { data } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: true })
    setClasses(data || [])
    setLoading(false)
  }

  async function addClass(subject, yearName, color = 'blue') {
    const { data, error } = await supabase
      .from('classes')
      .insert({ teacher_id: user.id, subject, year_name: yearName, color })
      .select()
      .single()
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
    if (!error) setClasses(c => c.filter(cls => cls.id !== id))
    return { error }
  }

  return { classes, loading, fetchClasses, addClass, updateClass, deleteClass }
}
