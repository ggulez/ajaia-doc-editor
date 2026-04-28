import { useState } from 'react'
import { db } from '../firebase'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'

export default function ShareModal({ docId, docData, onClose }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const handleShare = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('')
    if (email === docData.ownerEmail) { setError('You cannot share with yourself.'); return }
    if (docData.sharedWith?.includes(email)) { setError('Already shared with this user.'); return }
    try {
      await updateDoc(doc(db, 'documents', docId), { sharedWith: arrayUnion(email) })
      setStatus('Shared with ' + email)
      setEmail('')
    } catch (err) {
      setError('Failed to share. Try again.')
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Share Document</h3>
          <button style={styles.closeBtn} onClick={onClose}>X</button>
        </div>
        <form onSubmit={handleShare} style={styles.form}>
          <input style={styles.input} type="email" placeholder="Enter email address" value={email} onChange={e => setEmail(e.target.value)} required />
          <button style={styles.shareBtn} type="submit">Share</button>
        </form>
        {status && <p style={styles.success}>{status}</p>}
        {error && <p style={styles.error}>{error}</p>}
        {docData.sharedWith?.length > 0 && (
          <div style={styles.sharedList}>
            <p style={styles.sharedTitle}>Shared with:</p>
            {docData.sharedWith.map(e => <div key={e} style={styles.sharedItem}>{e}</div>)}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 },
  modal: { background:'white', borderRadius:'8px', padding:'1.5rem', width:'400px', boxShadow:'0 4px 20px rgba(0,0,0,0.15)' },
  modalHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' },
  modalTitle: { margin:0, fontSize:'1.1rem' },
  closeBtn: { background:'transparent', border:'none', fontSize:'1.1rem', cursor:'pointer', color:'#666' },
  form: { display:'flex', gap:'0.5rem', marginBottom:'1rem' },
  input: { flex:1, padding:'0.6rem', border:'1px solid #ddd', borderRadius:'4px', fontSize:'0.9rem' },
  shareBtn: { padding:'0.6rem 1rem', background:'#2563eb', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' },
  success: { color:'green', fontSize:'0.85rem' },
  error: { color:'red', fontSize:'0.85rem' },
  sharedList: { marginTop:'1rem', borderTop:'1px solid #eee', paddingTop:'1rem' },
  sharedTitle: { fontSize:'0.85rem', color:'#666', marginBottom:'0.5rem' },
  sharedItem: { fontSize:'0.9rem', padding:'0.3rem 0', color:'#333' }
}