import { useAppContext } from '../context/AppContext.jsx'

export function useStudents(classId = null) {
  const { students: all, loading, addStudent, addStudentsBulk, updateStudent, deleteStudent, fetchAll } = useAppContext()
  const students = classId ? all.filter(s => s.class_id === classId) : all
  return { students, loading, addStudent, addStudentsBulk, updateStudent, deleteStudent, fetchStudents: fetchAll }
}
