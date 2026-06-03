import { useAppContext } from '../context/AppContext.jsx'

export function useClasses() {
  const { classes, loading, addClass, updateClass, deleteClass, fetchAll } = useAppContext()
  return { classes, loading, addClass, updateClass, deleteClass, fetchClasses: fetchAll }
}
