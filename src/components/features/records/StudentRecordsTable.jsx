import { useTranslation } from 'react-i18next';

export default function StudentRecordsTable({ studentRecords = [], books = [], onToggle }) {
  const { t } = useTranslation();

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t('records.student')}</th>
            {books.map((book) => (
              <th key={book.id}>{book.emoji} {book.name}</th>
            ))}
            <th>{t('records.status')}</th>
          </tr>
        </thead>
        <tbody>
          {studentRecords.length === 0 ? (
            <tr>
              <td colSpan={3 + books.length} style={{ textAlign: 'center' }}>
                — tiada rekod —
              </td>
            </tr>
          ) : (
            studentRecords.map((rec, idx) => {
              const initials = (rec.student?.name || '')
                .split(' ')
                .filter(Boolean)
                .map((w) => w[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <tr key={rec.student?.id ?? idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <div className="s-name">
                      <div className="s-init">{initials}</div>
                      {rec.student?.name}
                    </div>
                  </td>
                  {books.map((book) => {
                    const submitted = rec.submittedBookIds?.has(book.id);
                    return (
                      <td key={book.id}>
                        <span
                          className={`tick ${submitted ? 'tick-yes' : 'tick-no'}`}
                          onClick={() => onToggle?.(rec.student?.id, book.id, submitted)}
                          style={{ cursor: 'pointer' }}
                        >
                          {submitted ? '✓' : '–'}
                        </span>
                      </td>
                    );
                  })}
                  <td>
                    {rec.status === 'n/a' ? (
                      'n/a'
                    ) : (
                      <span
                        className={`badge ${
                          rec.status === 'complete'
                            ? 'badge-ok'
                            : rec.status === 'partial'
                            ? 'badge-partial'
                            : 'badge-none'
                        }`}
                      >
                        {rec.status}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
