import { useMemo } from 'react'
import { useAppContext } from '../context/AppContext.jsx'

export function useSubmissions() {
  const {
    sessions, sessionRecords, loading,
    createSession, upsertSessionRecord, updateSessionNote, deleteSession,
  } = useAppContext()

  // Bina semula submissions-compatible array dari sessionRecords
  // "submitted" = ada session_record dengan status 'present' untuk student+book
  const submissions = useMemo(() => {
    const result = []
    const seen = new Set() // elak duplikasi student+book

    for (const rec of sessionRecords) {
      if (rec.status !== 'present') continue
      const session = sessions.find(s => s.id === rec.session_id)
      if (!session?.book_id) continue
      const key = `${rec.student_id}:${session.book_id}`
      if (seen.has(key)) continue
      seen.add(key)
      result.push({
        id: rec.id,
        student_id: rec.student_id,
        book_id: session.book_id,
        submitted_at: rec.scanned_at || session.checked_at,
      })
    }
    return result
  }, [sessionRecords, sessions])

  // toggleSubmission tidak lagi digunakan — semakan kini melalui sesi scan
  function toggleSubmission() {
    console.warn('toggleSubmission tidak lagi digunakan. Guna sesi scan untuk rekod kehadiran.')
  }

  return {
    submissions,
    toggleSubmission,
    loading,
    sessions,
    sessionRecords,
    createSession,
    upsertSessionRecord,
    updateSessionNote,
    deleteSession,
  }
}
