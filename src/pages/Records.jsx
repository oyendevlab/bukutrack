import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout.jsx'
import useRecords from '../hooks/useRecords.jsx'
import { useBooks } from '../hooks/useBooks.jsx'
import { useSubmissions } from '../hooks/useSubmissions.jsx'
import StudentRecordsTable from '../components/features/records/StudentRecordsTable.jsx'
import BookRecordsTable from '../components/features/records/BookRecordsTable.jsx'
import { exportToExcel, exportToCsv, exportToPdf } from '../lib/export.js'

export default function Records() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('student')

  const {
    filterClassId, setFilterClassId,
    filterStatus, setFilterStatus,
    filterSearch, setFilterSearch,
    studentRecords, bookRecords,
    classes, loading,
    totalStudents, totalComplete, totalIncomplete,
  } = useRecords()

  const { books } = useBooks()
  const { toggleSubmission } = useSubmissions()

  const STATUS_LABELS = {
    all: t('common.all'),
    complete: t('records.complete'),
    partial: t('records.partial'),
    none: t('records.none'),
  }

  const activeClassName = filterClassId
    ? (classes.find(c => c.id === filterClassId)?.year_name || 'Semua Kelas')
    : 'Semua Kelas'

  return (
    <Layout title={t('records.title')} breadcrumb={t('records.title')}>
      {/* Stats strip */}
      <div className="stats-strip">
        <div className="stat-cell" style={{ '--sc': 'var(--ink)' }}>
          <div className="stat-label">{t('records.totalStudents')}</div>
          <div className="stat-num">{totalStudents}</div>
        </div>
        <div className="stat-cell" style={{ '--sc': 'var(--green)' }}>
          <div className="stat-label">{t('records.complete')}</div>
          <div className="stat-num">{totalComplete}</div>
          <div className="stat-note">{totalStudents ? Math.round((totalComplete / totalStudents) * 100) : 0}%</div>
        </div>
        <div className="stat-cell" style={{ '--sc': 'var(--amber)' }}>
          <div className="stat-label">{t('records.incomplete')}</div>
          <div className="stat-num">{totalIncomplete}</div>
          <div className="stat-note">{totalStudents ? Math.round((totalIncomplete / totalStudents) * 100) : 0}%</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div
          className={`filter-chip${!filterClassId ? ' active' : ''}`}
          onClick={() => setFilterClassId(null)}
        >
          {t('records.allClasses') || 'Semua Kelas'}
        </div>
        {classes.map(cls => (
          <div
            key={cls.id}
            className={`filter-chip${filterClassId === cls.id ? ' active' : ''}`}
            onClick={() => setFilterClassId(cls.id)}
          >
            {cls.year_name}
          </div>
        ))}

        {Object.entries(STATUS_LABELS).map(([s, label]) => (
          <div
            key={s}
            className={`filter-chip${filterStatus === s ? ' active' : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            {label}
          </div>
        ))}

        <input
          className="filter-input"
          placeholder={t('records.search')}
          value={filterSearch}
          onChange={e => setFilterSearch(e.target.value)}
        />

        <div className="export-group">
          <button className="export-btn" onClick={() => exportToExcel(studentRecords, books, activeClassName)}>
            ↓ {t('records.exportExcel')}
          </button>
          <button className="export-btn" onClick={() => exportToCsv(studentRecords, books, activeClassName)}>
            ↓ {t('records.exportCsv')}
          </button>
          <button className="export-btn" onClick={() => exportToPdf(studentRecords, books, activeClassName)}>
            ↓ {t('records.exportPdf')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab${activeTab === 'student' ? ' active' : ''}`}
          onClick={() => setActiveTab('student')}
        >
          {t('records.byStudent')}
        </button>
        <button
          className={`tab${activeTab === 'book' ? ' active' : ''}`}
          onClick={() => setActiveTab('book')}
        >
          {t('records.byBook')}
        </button>
      </div>

      {/* Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            {activeTab === 'student' ? t('records.byStudent') : t('records.byBook')}
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>{t('common.loading')}</div>
          ) : activeTab === 'student' ? (
            <StudentRecordsTable studentRecords={studentRecords} books={books} onToggle={toggleSubmission} />
          ) : (
            <BookRecordsTable bookRecords={bookRecords} />
          )}
        </div>
      </div>
    </Layout>
  )
}
