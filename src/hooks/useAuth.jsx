import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchTeacher(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchTeacher(session.user.id)
      else { setTeacher(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchTeacher(id) {
    const { data } = await supabase.from('teachers').select('*').eq('id', id).single()
    setTeacher(data)
    if (data?.style) document.documentElement.setAttribute('data-style', data.style)
    if (data?.theme) document.documentElement.setAttribute('data-theme', data.theme)
    if (data?.language) {
      localStorage.setItem('bukutrack-language', data.language)
      const { default: i18n } = await import('../i18n/index.js')
      i18n.changeLanguage(data.language)
    }
    setLoading(false)
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signUp(email, password, name, schoolName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, school_name: schoolName } },
    })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, teacher, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
