import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

export function useLanguage(userId) {
  const { i18n } = useTranslation()
  const [language, setLanguageState] = useState(i18n.language || 'bm')

  async function setLanguage(lang) {
    if (!['bm', 'bi'].includes(lang)) return
    setLanguageState(lang)
    i18n.changeLanguage(lang)
    localStorage.setItem('bukutrack-language', lang)
    if (userId) {
      await supabase.from('teachers').update({ language: lang }).eq('id', userId)
    }
  }

  return { language, setLanguage }
}
