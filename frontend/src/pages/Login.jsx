import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>📄 DocEditor</h1>
        <p style={styles.subtitle}>Collaborative Document Editing</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} style={styles.form}>
          <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={styles.button} type="submit">Sign In</button>
        </form>
        <div style={styles.hint}>
          <p>Test accounts:</p>
          <p>user1@ajaia.test / Test1234!</p>
          <p>user2@ajaia.test / Test1234!</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f5f5' },
  box: { background:'white', padding:'2rem', borderRadius:'8px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', width:'360px' },
  title: { margin:'0 0 0.25rem', fontSize:'1.8rem' },
  subtitle: { margin:'0 0 1.5rem', color:'#666', fontSize:'0.9rem' },
  form: { display:'flex', flexDirection:'column', gap:'0.75rem' },
  input: { padding:'0.6rem 0.8rem', border:'1px solid #ddd', borderRadius:'4px', fontSize:'1rem' },
  button: { padding:'0.7rem', background:'#2563eb', color:'white', border:'none', borderRadius:'4px', fontSize:'1rem', cursor:'pointer' },
  error: { color:'red', fontSize:'0.85rem', marginBottom:'0.5rem' },
  hint: { marginTop:'1.5rem', fontSize:'0.75rem', color:'#999', lineHeight:'1.6' }
}
