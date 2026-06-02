import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const THEMES = ['blue', 'sage', 'lavender', 'rose', 'ivory']

export function useTheme(userId) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem('bukutrack-theme') || 'blue'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  async function setTheme(value) {
    if (!THEMES.includes(value)) return
    setThemeState(value)
    localStorage.setItem('bukutrack-theme', value)
    document.documentElement.setAttribute('data-theme', value)
    if (userId) {
      await supabase.from('teachers').update({ theme: value }).eq('id', userId)
    }
  }

  return { theme, setTheme, themes: THEMES }
}
