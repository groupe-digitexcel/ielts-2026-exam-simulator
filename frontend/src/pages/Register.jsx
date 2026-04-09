import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { saveAuth } from '../lib/auth'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ full_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try {
      const data = await api.register(form)
      saveAuth(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)' }}>
      <div className="card fade-up" style={{ width: '100%', maxWidth: 440 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Create Your Account</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>
          Start your IELTS 2026 AI exam preparation journey — free.
        </p>

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input className="input" type="text" value={form.full_name} onChange={set('full_name')} required placeholder="Paul Mbarga" />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={set('email')} required placeholder="you@email.com" />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" value={form.password} onChange={set('password')} required placeholder="Min. 6 characters" />
          </div>
          <button className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
