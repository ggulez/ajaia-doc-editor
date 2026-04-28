import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Document from './pages/Document'

function App() {
  const [user, setUser] = useState(undefined)
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u))
  }, [])
  if (user === undefined) return <div style={{padding:'2rem'}}>Loading...</div>
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/doc/:id" element={user ? <Document user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App