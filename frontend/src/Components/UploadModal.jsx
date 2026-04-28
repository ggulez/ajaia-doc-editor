import { useState } from 'react'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function UploadModal({ user, onClose, onDocCreated }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const processFile = async (file) => {
    setError('')
    if (!file.name.match(/\.(txt|md)$/i)) { setError('Only .txt and .md files are supported.'); return }
    setLoading(true)
    try {
      const text = await file.text()
      const title = file.name.replace(/\.(txt|md)$/i, '') || 'Uploaded Document'
      const content = '<p>' + text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') + '</p>'
      const ref = await addDoc(collection(db, 'documents'), {
        title, content, ownerId: user.uid, ownerEmail: user.email,
        sharedWith: [], createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      })
      onDocCreated(ref.id)
    } catch (err) {
      setError('Failed to upload file.')
    }
    setLoading(false)
  }

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) processFile(file) }
  const handleFileInput = (e) => { const file = e.target.files[0]; if (file) processFile(file) }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Upload File</h3>
          <button style={styles.closeBtn} onClick={onClose}>X</button>
        </div>
        <div style={{...styles.dropzone, ...(dragging ? styles.dragging : {})}}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}>
          <p style={styles.dropText}>Drag and drop a file here</p>
          <p style={styles.dropSub}>Supported: .txt and .md files only</p>
          <label style={styles.browseBtn}>
            {loading ? 'Processing...' : 'Browse Files'}
            <input type="file" accept=".txt,.md" onChange={handleFileInput} style={{display:'none'}} />
          </label>
        </div>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  )
}

const styles = {
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 },
  modal: { background:'white', borderRadius:'8px', padding:'1.5rem', width:'420px', boxShadow:'0 4px 20px rgba(0,0,0,0.15)' },
  modalHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' },
  modalTitle: { margin:0, fontSize:'1.1rem' },
  closeBtn: { background:'transparent', border:'none', fontSize:'1.1rem', cursor:'pointer', color:'#666' },
  dropzone: { border:'2px dashed #d1d5db', borderRadius:'8px', padding:'2rem', textAlign:'center' },
  dragging: { borderColor:'#2563eb', background:'#eff6ff' },
  dropText: { margin:'0 0 0.25rem', fontWeight:'500' },
  dropSub: { margin:'0 0 1rem', fontSize:'0.85rem', color:'#999' },
  browseBtn: { display:'inline-block', padding:'0.5rem 1.2rem', background:'#2563eb', color:'white', borderRadius:'4px', cursor:'pointer', fontSize:'0.9rem' },
  error: { color:'red', fontSize:'0.85rem', marginTop:'0.75rem' }
}