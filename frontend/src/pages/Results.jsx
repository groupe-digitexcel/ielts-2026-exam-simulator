import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

function BandCard({ label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 20, textAlign: 'center', boxShadow: 'var(--shadow)' }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</p>
      <div style={{ fontSize: 48, fontWeight: 800, color: color || 'var(--brand)', lineHeight: 1 }}>{value || '--'}</div>
      <div style={{ marginTop: 10 }}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((parseFloat(value)||0)/9)*100}%`, background: color || 'var(--brand)' }} />
        </div>
      </div>
      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>out of 9</p>
    </div>
  )
}

export default function Results() {
  const { id } = useParams()
  const [result, setResult]       = useState(null)
  const [feedback, setFeedback]   = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    api.getResult(id)
      .then(data => {
        setResult(data.result)
        if (data.feedback) {
          setFeedback({
            writing: JSON.parse(data.feedback.writing_feedback_json || '{}'),
            speaking: JSON.parse(data.feedback.speaking_feedback_json || '[]'),
          })
        }
        setPrediction(data.prediction)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading-center"><div className="spinner" /><p>Loading results…</p></div>
  if (error)   return <div className="page"><div className="alert alert-error">{error}</div></div>

  const overall = result?.overall_band
  const overallColor = overall >= 7 ? 'var(--success)' : overall >= 5.5 ? 'var(--gold)' : 'var(--danger)'

  return (
    <div className="page fade-up">
      {/* Overall band hero */}
      <div style={{ textAlign: 'center', padding: '40px 20px', background: 'linear-gradient(135deg,#1e3a8a,#0d9488)', borderRadius: 20, marginBottom: 32, color: '#fff' }}>
        <p style={{ fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', opacity: .8, marginBottom: 12 }}>
          IELTS Exam Results
        </p>
        <h1 style={{ fontSize: 'clamp(20px,4vw,32px)', fontWeight: 800, marginBottom: 20 }}>Your Overall Band Score</h1>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, background: 'rgba(255,255,255,.15)', borderRadius: 20, padding: '12px 36px' }}>
          <span style={{ fontSize: 72, fontWeight: 900, lineHeight: 1 }}>{overall || '--'}</span>
          <span style={{ fontSize: 20, opacity: .7 }}>/9</span>
        </div>
        <p style={{ marginTop: 16, opacity: .85, fontSize: 15 }}>
          {overall >= 7 ? '🎉 Excellent! C1 level — University ready.' : overall >= 6 ? '👍 Good performance. B2 level — Keep improving.' : '💪 Keep practising. Consistency is key.'}
        </p>
      </div>

      {/* Band score grid */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <BandCard label="Reading"   value={result?.reading_band}   color="#2563eb" />
        <BandCard label="Listening" value={result?.listening_band} color="#0d9488" />
        <BandCard label="Writing"   value={result?.writing_band}   color="#f59e0b" />
        <BandCard label="Speaking"  value={result?.speaking_band}  color="#8b5cf6" />
      </div>

      {/* Raw scores */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="card">
          <h3 className="section-title">Reading Score</h3>
          <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--brand)' }}>
            {result?.reading_score ?? '--'} <span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 400 }}>correct answers</span>
          </p>
        </div>
        <div className="card">
          <h3 className="section-title">Listening Score</h3>
          <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>
            {result?.listening_score ?? '--'} <span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 400 }}>correct answers</span>
          </p>
        </div>
      </div>

      {/* Writing feedback */}
      {feedback?.writing && Object.keys(feedback.writing).length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="section-title">✍️ Writing Feedback</h3>
          {feedback.writing.taskAchievement !== undefined && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 16 }}>
              {[
                ['Task Achievement', feedback.writing.taskAchievement],
                ['Coherence',        feedback.writing.coherence],
                ['Lexical Resource', feedback.writing.lexical],
                ['Grammar',          feedback.writing.grammar],
              ].map(([label, val]) => (
                <div key={label} style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{label}</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand)' }}>{val || '--'}</p>
                </div>
              ))}
            </div>
          )}
          {Array.isArray(feedback.writing.feedback) && feedback.writing.feedback.length > 0 && (
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Improvement Points:</p>
              <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {feedback.writing.feedback.map((f,i) => (
                  <li key={i} style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Speaking feedback */}
      {Array.isArray(feedback?.speaking) && feedback.speaking.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="section-title">🎙️ Speaking Feedback</h3>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {feedback.speaking.map((f,i) => (
              <li key={i} style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Band prediction */}
      {prediction && (
        <div className="card" style={{ marginBottom: 28, background: 'linear-gradient(135deg,#fefce8,#fef3c7)', border: '1px solid #fcd34d' }}>
          <h3 className="section-title">🎯 Target Band Prediction</h3>
          <p style={{ fontSize: 13, color: '#92400e', marginBottom: 16 }}>Your probability of achieving each target band:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              ['Band 6',   prediction.band6_probability],
              ['Band 6.5', prediction.band65_probability],
              ['Band 7',   prediction.band7_probability],
              ['Band 7.5', prediction.band75_probability],
              ['Band 8',   prediction.band8_probability],
            ].map(([label, prob]) => (
              <div key={label} style={{
                background: prob==='High' ? '#dcfce7' : prob==='Medium' ? '#fef3c7' : '#fee2e2',
                border: `1px solid ${prob==='High' ? '#bbf7d0' : prob==='Medium' ? '#fde68a' : '#fecaca'}`,
                color: prob==='High' ? '#15803d' : prob==='Medium' ? '#b45309' : '#b91c1c',
                borderRadius: 10, padding: '10px 16px', textAlign: 'center'
              }}>
                <p style={{ fontSize: 12, fontWeight: 600 }}>{label}</p>
                <p style={{ fontSize: 16, fontWeight: 800 }}>{prob}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/exam/generate" className="btn btn-primary" style={{ fontSize: 15, padding: '13px 28px' }}>
          Take Another Exam
        </Link>
        <Link to="/dashboard" className="btn btn-secondary" style={{ fontSize: 15, padding: '13px 28px' }}>
          Back to Dashboard
        </Link>
        <Link to="/pricing" className="btn btn-gold" style={{ fontSize: 15, padding: '13px 28px' }}>
          ⭐ Upgrade for AI Coaching
        </Link>
      </div>
    </div>
  )
}
