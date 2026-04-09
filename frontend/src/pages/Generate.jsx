import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

const difficulties = ['beginner','intermediate','advanced','band6','band7','band8']
const topics       = ['education','technology','environment','business','travel','science','health','society']
const modules      = ['full','reading','listening','writing','speaking']

export default function Generate() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ difficulty: 'intermediate', topic: 'education', module: 'full', timeMode: 'real' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await api.generateExam(form)
      navigate(`/exam/${data.exam.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 680, margin: '0 auto' }}>
      <h1 className="page-title fade-up">Generate AI IELTS Exam</h1>
      <p className="page-subtitle" style={{ marginBottom: 32 }}>
        Create a custom IELTS 2026 mock exam — every session generates unique questions.
      </p>

      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

      <form onSubmit={submit} className="card fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

        <div className="form-group">
          <label className="label">Module</label>
          <select className="input" value={form.module} onChange={set('module')}>
            <option value="full">🎓 Full Exam (All 4 sections)</option>
            <option value="reading">📖 Reading Only</option>
            <option value="listening">🎧 Listening Only</option>
            <option value="writing">✍️ Writing Only</option>
            <option value="speaking">🎙️ Speaking Only</option>
          </select>
        </div>

        <div className="form-group">
          <label className="label">Difficulty / Target Band</label>
          <select className="input" value={form.difficulty} onChange={set('difficulty')}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="band6">Band 6 Target</option>
            <option value="band7">Band 7 Target</option>
            <option value="band8">Band 8+ Target</option>
          </select>
        </div>

        <div className="form-group">
          <label className="label">Topic</label>
          <select className="input" value={form.topic} onChange={set('topic')}>
            <option value="education">Education</option>
            <option value="technology">Technology</option>
            <option value="environment">Environment</option>
            <option value="business">Business</option>
            <option value="travel">Travel</option>
            <option value="science">Science</option>
            <option value="health">Health</option>
            <option value="society">Society</option>
          </select>
        </div>

        <div className="form-group">
          <label className="label">Time Mode</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {[['real','⏱ Real Exam Time'],['speed','⚡ Speed Practice']].map(([v,l]) => (
              <label key={v} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', border: `1px solid ${form.timeMode===v ? 'var(--brand)':'var(--border)'}`, borderRadius: 10, cursor: 'pointer', background: form.timeMode===v ? 'var(--brand-light)':'var(--surface)', transition: 'all .2s' }}>
                <input type="radio" name="timeMode" value={v} checked={form.timeMode===v} onChange={set('timeMode')} style={{ accentColor: 'var(--brand)' }} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{l}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-full" disabled={loading} style={{ fontSize: 16, padding: '14px 0' }}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              Generating exam…
            </span>
          ) : 'Generate My Exam →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
          Generation takes ~3 seconds. Your exam is saved automatically.
        </p>
      </form>
    </div>
  )
}
