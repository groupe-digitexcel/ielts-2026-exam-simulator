import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 72, marginBottom: 20 }}>404</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>Page Not Found</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 28 }}>This page does not exist or was moved.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  )
}
