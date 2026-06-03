import { useAppContext } from '../context/AppContext.jsx'

export function useSubmissions() {
  const { submissions, loading, toggleSubmission, fetchAll } = useAppContext()
  return { submissions, loading, toggleSubmission, fetchSubmissions: fetchAll }
}
