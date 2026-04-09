import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { getUser } from '../lib/auth'

const PLANS = ['free','premium_monthly','premium_quarterly','premium_yearly','institutional']

export default function Admin() {
  const user = getUser()
  const [users, setUsers]   = useState([])
  const [exams, setExams]   = useState([])
  const [stats, setStats]   = useState(null)
  const [tab, setTab]       = useState('users')
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const [msg, setMsg]       = useState('')

  useEffect(() => {
    Promise.all([api.adminUsers(), api.adminExams(), api.dashboardStats()])
      .then(([u, e, s]) => { setUsers(u.users || []); setExams(e.exams || []); setStats(s) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const updatePlan = async (userId, plan) => {
    try {
      await api.updatePlan(userId, plan)
      setUsers(us => us.map(u => u.id === userId ? { ...u, subscription_plan: plan } : u))
      setMsg('Plan updated ✓')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) { setError(err.message) }
  }

  if (loading) return <div className="loading-center"><div className="spinner" /><p>Loading admin…</p></div>

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', borderRadius: 16, padding: '28px 28px', color: '#fff', marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Admin Dashboard</h1>
        <p style={{ opacity: .8 }}>Welcome {user?.full_name} · IELTS Master AI 2026 Control Panel</p>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}
      {msg   && <div className="alert alert-success" style={{ marginBottom: 20 }}>{msg}</div>}

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          ['Total Users', stats?.totalUsers ?? '--', '#2563eb'],
          ['Total Exams', stats?.totalExams ?? '--', '#0d9488'],
          ['Completed',   stats?.submittedExams ?? '--', '#f59e0b'],
          ['Latest Band', stats?.latestBand ?? '--', '#8b5cf6'],
        ].map(([label, value, color]) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label}</div>
            <div className="stat-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[['users','👥 Users'],['exams','📝 Exams']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} className="btn" style={{
            background: tab===id ? 'var(--brand)' : 'var(--surface)',
            color: tab===id ? '#fff' : 'var(--muted)',
            border: `1px solid ${tab===id ? 'var(--brand)' : 'var(--border)'}`,
          }}>{label}</button>
        ))}
      </div>

      {/* Users table */}
      {tab === 'users' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h3 className="section-title">All Users ({users.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {['ID','Name','Email','Role','Plan','Registered','Change Plan'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 12px', color: 'var(--muted)' }}>#{u.id}</td>
                  <td style={{ padding: '12px 12px', fontWeight: 600 }}>{u.full_name}</td>
                  <td style={{ padding: '12px 12px', color: 'var(--muted)' }}>{u.email}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <span className={`badge ${u.role==='admin' ? 'badge-blue' : 'badge-gray'}`}>{u.role}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span className={`badge ${u.subscription_plan==='free' ? 'badge-gray' : 'badge-gold'}`}>{u.subscription_plan}</span>
                  </td>
                  <td style={{ padding: '12px 12px', color: 'var(--muted)' }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <select
                      value={u.subscription_plan}
                      onChange={e => updatePlan(u.id, e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, cursor: 'pointer', background: 'var(--surface)' }}
                    >
                      {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Exams table */}
      {tab === 'exams' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h3 className="section-title">All Exams ({exams.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {['ID','Title','Student','Difficulty','Status','Date'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exams.map(ex => (
                <tr key={ex.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 12px', color: 'var(--muted)' }}>#{ex.id}</td>
                  <td style={{ padding: '12px 12px', fontWeight: 600 }}>{ex.title}</td>
                  <td style={{ padding: '12px 12px', color: 'var(--muted)' }}>{ex.full_name}</td>
                  <td style={{ padding: '12px 12px' }}><span className="badge badge-blue">{ex.difficulty_level}</span></td>
                  <td style={{ padding: '12px 12px' }}>
                    <span className={`badge ${ex.status==='completed' ? 'badge-green' : ex.status==='in_progress' ? 'badge-blue' : 'badge-gray'}`}>{ex.status}</span>
                  </td>
                  <td style={{ padding: '12px 12px', color: 'var(--muted)' }}>
                    {new Date(ex.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
