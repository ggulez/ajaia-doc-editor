import { useEffect, useState } from 'react'
import { db, auth } from '../firebase'
import { collection, addDoc, onSnapshot, query, where, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import UploadModal from '../components/UploadModal'

export default function Dashboard({ user }) {
  const [docs, setDocs] = useState([])
  const [sharedDocs, setSharedDocs] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const ownedQ = query(collection(db, 'documents'), where('ownerId', '==', user.uid))
    const unsubOwned = onSnapshot(ownedQ, snap => {
      setDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    const sharedQ = query(collection(db, 'documents'), where('sharedWith', 'array-contains', user.email))
    const unsubShared = onSnapshot(sharedQ, snap => {
      setSharedDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => { unsubOwned(); unsubShared() }
  }, [user])

  const createDoc = async () => {
    const ref = await addDoc(collection(db, 'documents'), {
      title: 'Untitled Document',
      content: '',
      ownerId: user.uid,
      ownerEmail: user.email,
      sharedWith: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    navigate('/doc/' + ref.id)
  }

  const startRename = (d) => {
    setRenamingId(d.id)
    setRenameValue(d.title)
  }

  const saveRename = async (id) => {
    await updateDoc(doc(db, 'documents', id), { title: renameValue })
    setRenamingId(null)
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this document?')) return
    await deleteDoc(doc(db, 'documents', id))
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>DocEditor</h1>
        <div style={styles.headerRight}>
          <span style={styles.userEmail}>{user.email}</span>
          <button style={styles.logoutBtn} onClick={() => signOut(auth)}>Sign Out</button>
        </div>
      </div>
      <div style={styles.content}>
        <div style={styles.toolbar}>
          <button style={styles.primaryBtn} onClick={createDoc}>+ New Document</button>
          <button style={styles.secondaryBtn} onClick={() => setShowUpload(true)}>Upload File</button>
        </div>
        <h2 style={styles.sectionTitle}>My Documents</h2>
        {docs.length === 0 && <p style={styles.empty}>No documents yet. Create one above.</p>}
        <div style={styles.docGrid}>
          {docs.map(d => (
            <div key={d.id} style={styles.docCard}>
              {renamingId === d.id ? (
                <div style={styles.renameRow}>
                  <input
                    style={styles.renameInput}
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveRename(d.id)}
                    autoFocus
                  />
                  <button style={styles.saveBtn} onClick={() => saveRename(d.id)}>Save</button>
                </div>
              ) : (
                <div style={styles.docTitle} onClick={() => navigate('/doc/' + d.id)}>{d.title}</div>
              )}
              <div style={styles.docMeta}>
                <span style={styles.ownerBadge}>Owner</span>
                <div style={{display:'flex', gap:'0.5rem'}}>
                  <button style={styles.renameBtn} onClick={(e) => { e.stopPropagation(); startRename(d) }}>Rename</button>
                  <button style={styles.deleteBtn} onClick={(e) => handleDelete(d.id, e)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {sharedDocs.length > 0 && (
          <>
            <h2 style={styles.sectionTitle}>Shared With Me</h2>
            <div style={styles.docGrid}>
              {sharedDocs.map(d => (
                <div key={d.id} style={styles.docCard} onClick={() => navigate('/doc/' + d.id)}>
                  <div style={styles.docTitle}>{d.title}</div>
                  <div style={styles.docMeta}>
                    <span style={styles.sharedBadge}>Shared by {d.ownerEmail}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {showUpload && <UploadModal user={user} onClose={() => setShowUpload(false)} onDocCreated={(id) => navigate('/doc/' + id)} />}
    </div>
  )
}

const styles = {
  container: { minHeight:'100vh', background:'#f8f9fa' },
  header: { background:'white', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 1px 3px rgba(0,0,0,0.1)' },
  logo: { margin:0, fontSize:'1.4rem' },
  headerRight: { display:'flex', alignItems:'center', gap:'1rem' },
  userEmail: { color:'#666', fontSize:'0.9rem' },
  logoutBtn: { padding:'0.4rem 0.8rem', background:'transparent', border:'1px solid #ddd', borderRadius:'4px', cursor:'pointer' },
  content: { maxWidth:'900px', margin:'0 auto', padding:'2rem' },
  toolbar: { display:'flex', gap:'1rem', marginBottom:'2rem' },
  primaryBtn: { padding:'0.6rem 1.2rem', background:'#2563eb', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'0.95rem' },
  secondaryBtn: { padding:'0.6rem 1.2rem', background:'white', color:'#333', border:'1px solid #ddd', borderRadius:'4px', cursor:'pointer', fontSize:'0.95rem' },
  sectionTitle: { fontSize:'1rem', color:'#666', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1rem' },
  empty: { color:'#999', fontStyle:'italic' },
  docGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1rem', marginBottom:'2rem' },
  docCard: { background:'white', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'1rem', cursor:'pointer' },
  docTitle: { fontWeight:'500', marginBottom:'0.5rem', fontSize:'0.95rem' },
  docMeta: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  ownerBadge: { fontSize:'0.7rem', background:'#dbeafe', color:'#1d4ed8', padding:'0.2rem 0.5rem', borderRadius:'99px' },
  sharedBadge: { fontSize:'0.7rem', background:'#fef3c7', color:'#92400e', padding:'0.2rem 0.5rem', borderRadius:'99px' },
  renameBtn: { fontSize:'0.75rem', background:'transparent', border:'none', color:'#2563eb', cursor:'pointer' },
  deleteBtn: { fontSize:'0.75rem', background:'transparent', border:'none', color:'#dc2626', cursor:'pointer' },
  renameRow: { display:'flex', gap:'0.5rem', marginBottom:'0.5rem' },
  renameInput: { flex:1, padding:'0.3rem', border:'1px solid #ddd', borderRadius:'4px', fontSize:'0.9rem' },
  saveBtn: { padding:'0.3rem 0.6rem', background:'#2563eb', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'0.8rem' }
}
