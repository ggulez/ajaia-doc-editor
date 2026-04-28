import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import Editor from '../components/Editor'
import ShareModal from '../components/ShareModal'

export default function Document({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [docData, setDocData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchDoc = async () => {
      const ref = doc(db, 'documents', id)
      const snap = await getDoc(ref)
      if (!snap.exists()) { setNotFound(true); return }
      const data = snap.data()
      const isOwner = data.ownerId === user.uid
      const isShared = data.sharedWith?.includes(user.email)
      if (!isOwner && !isShared) { setNotFound(true); return }
      setDocData({ id: snap.id, ...data })
    }
    fetchDoc()
  }, [id, user])

  const handleSave = async (content) => {
    setSaving(true)
    await updateDoc(doc(db, 'documents', id), { content, updatedAt: serverTimestamp() })
    setSaving(false)
  }

  if (notFound) return (
    <div style={styles.center}>
      <p>Document not found or access denied.</p>
      <button onClick={() => navigate('/')}>Back to Dashboard</button>
    </div>
  )

  if (!docData) return <div style={styles.center}>Loading document...</div>

  const isOwner = docData.ownerId === user.uid

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>Back</button>
        <div style={styles.titleArea}>
          <h2 style={styles.title}>{docData.title}</h2>
          {!isOwner && <span style={styles.sharedBadge}>Shared with you</span>}
        </div>
        <div style={styles.headerRight}>
          {saving && <span style={styles.saving}>Saving...</span>}
          {isOwner && <button style={styles.shareBtn} onClick={() => setShowShare(true)}>Share</button>}
        </div>
      </div>
      <Editor initialContent={docData.content} onSave={handleSave} readOnly={!isOwner} />
      {showShare && <ShareModal docId={id} docData={docData} onClose={() => setShowShare(false)} />}
    </div>
  )
}

const styles = {
  container: { minHeight:'100vh', background:'#f8f9fa' },
  header: { background:'white', padding:'0.75rem 2rem', display:'flex', alignItems:'center', gap:'1rem', boxShadow:'0 1px 3px rgba(0,0,0,0.1)' },
  backBtn: { background:'transparent', border:'none', cursor:'pointer', fontSize:'0.9rem', color:'#2563eb' },
  titleArea: { flex:1, display:'flex', alignItems:'center', gap:'0.75rem' },
  title: { margin:0, fontSize:'1.1rem' },
  sharedBadge: { fontSize:'0.7rem', background:'#fef3c7', color:'#92400e', padding:'0.2rem 0.5rem', borderRadius:'99px' },
  headerRight: { display:'flex', alignItems:'center', gap:'1rem' },
  saving: { fontSize:'0.85rem', color:'#999' },
  shareBtn: { padding:'0.5rem 1rem', background:'#2563eb', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' },
  center: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', gap:'1rem' }
}