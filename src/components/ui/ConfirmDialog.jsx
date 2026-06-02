export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal" style={{ maxWidth: '360px' }}>
        <div className="modal-head">
          <div className="modal-init" style={{ background: 'var(--red)', fontSize: '20px' }}>!</div>
          <div>
            <div className="modal-sname">Sahkan Tindakan</div>
            <div className="modal-smeta">Tindakan ini tidak boleh dibalik</div>
          </div>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onCancel}>Batal</button>
          <button className="btn" style={{ flex: 1, justifyContent: 'center', background: 'var(--red)', color: '#fff', border: '1.5px solid var(--red)' }} onClick={onConfirm}>Padam</button>
        </div>
      </div>
    </div>
  )
}
