import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const STYLES = ['minimal', 'sage', 'bubbly', 'sunset', 'ocean']

export function useStyle(userId) {
  const [style, setStyleState] = useState(
    () => localStorage.getItem('bukutrack-style') || 'minimal'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-style', style)
  }, [style])

  async function setStyle(value) {
    if (!STYLES.includes(value)) return
    setStyleState(value)
    localStorage.setItem('bukutrack-style', value)
    document.documentElement.setAttribute('data-style', value)
    if (userId) {
      await supabase.from('teachers').update({ style: value }).eq('id', userId)
    }
  }

  return { style, setStyle, styles: STYLES }
}
