import {
  PencilSimple, Trash, DownloadSimple, UploadSimple,
  Printer, ArrowSquareOut, FileXls, FilePdf, FileCsv,
} from '@phosphor-icons/react'

export function EditBtn({ onClick, title }) {
  return (
    <button className="icon-btn" onClick={onClick} title={title || 'Edit'}>
      <PencilSimple size={13} weight="bold" />
    </button>
  )
}

export function DeleteBtn({ onClick, title }) {
  return (
    <button className="icon-btn del" onClick={onClick} title={title || 'Padam'}>
      <Trash size={13} weight="bold" />
    </button>
  )
}

export function ExportBtn({ onClick, type = 'download', label }) {
  const icons = {
    excel: <FileXls size={13} weight="bold" />,
    pdf:   <FilePdf size={13} weight="bold" />,
    csv:   <FileCsv size={13} weight="bold" />,
    download: <DownloadSimple size={13} weight="bold" />,
  }
  return (
    <button className="export-btn" onClick={onClick}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {icons[type] || icons.download}
        {label}
      </span>
    </button>
  )
}

export function UploadBtn({ onClick, label }) {
  return (
    <button className="btn btn-ghost btn-sm" onClick={onClick}>
      <UploadSimple size={14} weight="bold" />
      <span>{label}</span>
    </button>
  )
}

export function PrintBtn({ onClick, label }) {
  return (
    <button className="btn btn-primary btn-sm" onClick={onClick}>
      <Printer size={14} weight="bold" />
      <span>{label}</span>
    </button>
  )
}

export function ExternalBtn({ onClick, label }) {
  return (
    <button className="btn btn-ghost btn-sm" onClick={onClick}>
      <ArrowSquareOut size={14} weight="bold" />
      <span>{label}</span>
    </button>
  )
}
