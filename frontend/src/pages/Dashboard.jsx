import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { getUser, isPremium } from '../lib/auth'

export default function Dashboard() {
  const user = getUser()
  const [stats, setStats]       = useState(null)
  const [exams, setExams]       = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    Promise.all([
      api.dashboardStats(),
      api.listExams(),
      api.dashboardAnalytics(),
    ])
      .then(([s, e, a]) => { setStats(s); setExams(e.exams || []); setAnalytics(a.analytics) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const statusBadge = (s) => {
    if (s === 'completed')   return <span className="badge badge-green">✓ Completed</span>
    if (s === 'in_progress') return <span className="badge badge-blue">● In Progress</span>
    return <span className="badge badge-gray">Draft</span>
  }

  if (loading) return (
    <div className="loading-center">
      <div className="spinner" />
      <p>Loading dashboard…</p>
    </div>
  )

  return (
    <div className="page fade-up">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Student Dashboard</h1>
          <p className="page-subtitle">
            Welcome, <strong>{user?.full_name || 'Student'}</strong> ·{' '}
            <span style={{ color: isPremium() ? 'var(--success)' : 'var(--muted)' }}>
              {isPremium() ? '⭐ Premium' : '🆓 Free Plan'}
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/exam/generate" className="btn btn-primary">+ New Exam</Link>
          {!isPremium() && <Link to="/pricing" className="btn btn-secondary">Upgrade ↑</Link>}
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-label">Total Exams</div>
          <div className="stat-value">{stats?.totalExams ?? '--'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{stats?.submittedExams ?? '--'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Latest Band</div>
          <div className="stat-value" style={{ color: 'var(--brand)' }}>{stats?.latestBand ?? '--'}</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg,#1e3a8a,#0d9488)', border: 'none', color: '#fff' }}>
          <div className="stat-label" style={{ color: 'rgba(255,255,255,.7)' }}>Avg Overall</div>
          <div className="stat-value">{analytics?.averageBands?.overall ?? '--'}</div>
          <div className="stat-note" style={{ color: 'rgba(255,255,255,.6)' }}>across all exams</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 24 }}>

        {/* Exams list */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className="section-title" style={{ margin: 0 }}>My Exams</h2>
              <Link to="/exam/generate" className="btn btn-primary btn-sm">+ Generate</Link>
            </div>
            {exams.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
                <p>No exams yet. Generate your first AI mock exam!</p>
                <Link to="/exam/generate" className="btn btn-primary" style={{ marginTop: 16 }}>Generate Exam</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {exams.map(ex => (
                  <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: '14px 16px', background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{ex.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                        {ex.difficulty_level} · {ex.topic_category} · {new Date(ex.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {statusBadge(ex.status)}
                      {ex.status === 'completed'
                        ? <Link to={`/exam/${ex.id}/results`} className="btn btn-primary btn-sm">Results</Link>
                        : <Link to={`/exam/${ex.id}`}         className="btn btn-secondary btn-sm">Open</Link>
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {analytics && (
            <div className="card">
              <h2 className="section-title">Average Band Scores</h2>
              {['reading','listening','writing','speaking'].map(mod => (
                <div key={mod} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, textTransform: 'capitalize', fontWeight: 500 }}>{mod}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand)' }}>{analytics.averageBands?.[mod] || '--'}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${((analytics.averageBands?.[mod] || 0) / 9) * 100}%` }} />
                  </div>
                </div>
              ))}
              {analytics.recommendation && (
                <div className="alert alert-info" style={{ marginTop: 16, fontSize: 13 }}>
                  💡 {analytics.recommendation}
                </div>
              )}
            </div>
          )}

          {!isPremium() && (
            <div className="card" style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', border: '1px solid #fcd34d' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>⭐</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Unlock Premium</h3>
              <p style={{ fontSize: 13, color: '#92400e', lineHeight: 1.6, marginBottom: 14 }}>
                Get unlimited AI exams, advanced writing corrections, and your personalised 30-day study plan.
              </p>
              <Link to="/pricing" className="btn btn-gold btn-full">Upgrade Now</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
