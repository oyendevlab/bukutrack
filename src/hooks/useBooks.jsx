import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

export function useBooks(classId = null) {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchBooks()
  }, [user, classId])

  async function fetchBooks() {
    setLoading(true)
    let query = supabase
      .from('books')
      .select('*')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: true })
    if (classId) query = query.or(`class_id.eq.${classId},class_id.is.null`)
    const { data } = await query
    setBooks(data || [])
    setLoading(false)
  }

  async function addBook(name, emoji = '📚', bookClassId = null) {
    const { data, error } = await supabase
      .from('books')
      .insert({ teacher_id: user.id, class_id: bookClassId, name, emoji })
      .select()
      .single()
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

  return { books, loading, fetchBooks, addBook, updateBook, deleteBook }
}
