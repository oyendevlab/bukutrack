import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import bm from './bm.json'
import bi from './bi.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      bm: { translation: bm },
      bi: { translation: bi },
    },
    lng: localStorage.getItem('bukutrack-language') || 'bm',
    fallbackLng: 'bm',
    interpolation: { escapeValue: false },
  })

export default i18n
