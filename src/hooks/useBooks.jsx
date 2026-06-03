import { useAppContext } from '../context/AppContext.jsx'

export function useBooks(classId = null) {
  const { books: all, loading, addBook, updateBook, deleteBook, fetchAll } = useAppContext()
  const books = classId
    ? all.filter(b => b.class_id === classId || b.class_id === null)
    : all
  return { books, loading, addBook, updateBook, deleteBook, fetchBooks: fetchAll }
}
