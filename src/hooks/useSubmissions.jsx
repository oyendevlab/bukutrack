import { useAppContext } from '../context/AppContext.jsx'

export function useSubmissions() {
  const { sessions, sessionRecords, createSession, upsertSessionRecord, updateSessionNote, deleteSession } = useAppContext()
  return { sessions, sessionRecords, createSession, upsertSessionRecord, updateSessionNote, deleteSession }
}
