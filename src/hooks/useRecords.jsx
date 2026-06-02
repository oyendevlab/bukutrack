import { useState, useMemo } from 'react';
import { useClasses } from './useClasses';
import { useStudents } from './useStudents';
import { useBooks } from './useBooks';
import { useSubmissions } from './useSubmissions';

export default function useRecords() {
  const { classes, loading: loadingClasses } = useClasses();
  const { students, loading: loadingStudents } = useStudents();
  const { books, loading: loadingBooks } = useBooks();
  const { submissions, loading: loadingSubmissions } = useSubmissions();

  const [filterClassId, setFilterClassId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');

  const loading = loadingClasses || loadingStudents || loadingBooks || loadingSubmissions;

  // Build a map of student_id -> Set of submitted book_ids for O(1) lookups
  const submissionsByStudent = useMemo(() => {
    const map = new Map();
    for (const s of submissions) {
      if (!map.has(s.student_id)) map.set(s.student_id, new Set());
      map.get(s.student_id).add(s.book_id);
    }
    return map;
  }, [submissions]);

  const studentRecords = useMemo(() => {
    if (loading) return [];

    const lowerSearch = filterSearch.toLowerCase();

    return students
      .map((student) => {
        const cls = classes.find((c) => c.id === student.class_id) ?? null;
        const studentBooks = books.filter(
          (b) => b.class_id === student.class_id || b.class_id === null
        );
        const submittedBookIds = submissionsByStudent.get(student.id) ?? new Set();
        const totalBooks = studentBooks.length;
        const submittedCount = studentBooks.filter((b) => submittedBookIds.has(b.id)).length;

        let status;
        if (totalBooks === 0) status = 'n/a';
        else if (submittedCount === totalBooks) status = 'complete';
        else if (submittedCount === 0) status = 'none';
        else status = 'partial';

        return { student, cls, books: studentBooks, submittedBookIds, status, submittedCount, totalBooks };
      })
      .filter((record) => {
        if (filterClassId && record.student.class_id !== filterClassId) return false;
        if (filterStatus !== 'all' && record.status !== filterStatus) return false;
        if (lowerSearch && !record.student.name.toLowerCase().includes(lowerSearch)) return false;
        return true;
      });
  }, [students, classes, books, submissionsByStudent, filterClassId, filterStatus, filterSearch, loading]);

  const bookRecords = useMemo(() => {
    if (loading) return [];

    return books
      .filter(book => !filterClassId || book.class_id === null || book.class_id === filterClassId)
      .map((book) => {
        const cls = book.class_id ? classes.find((c) => c.id === book.class_id) ?? null : null;
        const bookStudents =
          book.class_id === null
            ? students
            : students.filter((s) => s.class_id === book.class_id);
        const totalStudents = bookStudents.length;
        const studentsStatus = bookStudents.map((student) => {
          const submitted = (submissionsByStudent.get(student.id) ?? new Set()).has(book.id);
          return { student, submitted };
        });
        const submittedCount = studentsStatus.filter((s) => s.submitted).length;
        const pct = totalStudents > 0 ? (submittedCount / totalStudents) * 100 : 0;

        return { book, cls, totalStudents, submittedCount, pct, studentsStatus };
      });
  }, [books, students, classes, submissionsByStudent, filterClassId, loading]);

  const totalStudents = studentRecords.length;

  const totalComplete = useMemo(
    () => studentRecords.filter((r) => r.status === 'complete').length,
    [studentRecords]
  );

  const totalIncomplete = useMemo(
    () => studentRecords.filter((r) => r.status !== 'complete' && r.status !== 'n/a').length,
    [studentRecords]
  );

  return {
    filterClassId,
    setFilterClassId,
    filterStatus,
    setFilterStatus,
    filterSearch,
    setFilterSearch,
    studentRecords,
    bookRecords,
    classes,
    loading,
    totalStudents,
    totalComplete,
    totalIncomplete,
  };
}
