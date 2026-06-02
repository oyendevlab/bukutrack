export default function BookRecordsTable({ bookRecords = [] }) {
  if (bookRecords.length === 0) {
    return <div style={{ textAlign: 'center' }}>— tiada rekod —</div>;
  }

  return (
    <div>
      {bookRecords.map((rec, idx) => {
        if (!rec.book) return null;
        const pctFill = Math.min(rec.pct ?? 0, 100);
        const fillClass =
          pctFill >= 100 ? 'ok' : pctFill >= 70 ? 'warn' : 'danger';

        return (
          <div className="book-row" key={rec.book?.id ?? idx}>
            <span>
              {rec.book?.emoji} {rec.book?.name}
            </span>
            <span>
              {rec.submittedCount ?? 0} / {rec.totalStudents ?? 0}
            </span>
            <div className="prog-bar">
              <div
                className={`prog-fill ${fillClass}`}
                style={{ width: `${pctFill}%` }}
              />
            </div>
            <span>{Math.round(pctFill)}%</span>
          </div>
        );
      })}
    </div>
  );
}
