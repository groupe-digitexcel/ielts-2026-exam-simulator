import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

function Timer({ seconds }) {
  const m = Math.floor(seconds / 60), s = seconds % 60
  const warn = seconds < 300
  return (
    <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: warn ? 'var(--danger)' : 'var(--brand)', background: warn ? '#fef2f2' : 'var(--brand-light)', border: `1px solid ${warn ? '#fecaca' : '#bfdbfe'}`, borderRadius: 8, padding: '6px 14px' }}>
      ⏱ {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
    </div>
  )
}

export default function ExamPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [exam, setExam]           = useState(null)
  const [sections, setSections]   = useState([])
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers]     = useState({})
  const [task1, setTask1]         = useState('')
  const [task2, setTask2]         = useState('')
  const [speaking, setSpeaking]   = useState('')
  const [timeLeft, setTimeLeft]   = useState(3600)
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    api.startExam(id)
      .then(data => {
        setExam(data.exam)
        setSections(data.sections || [])
        setQuestions(data.questions || [])
        const mins = data.sections?.reduce((sum,s) => sum + (s.duration_minutes||0), 0) || 60
        setTimeLeft(mins * 60)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!exam) return
    const t = setInterval(() => setTimeLeft(s => { if (s <= 1) { clearInterval(t); handleSubmit(); return 0 } return s - 1 }), 1000)
    return () => clearInterval(t)
  }, [exam])

  const saveAnswer = useCallback(async (questionId, value, sectionType) => {
    setAnswers(a => ({ ...a, [questionId]: value }))
    try { await api.saveAnswer(id, { questionId, answerText: value, sectionType }) } catch {}
  }, [id])

  const handleSubmit = useCallback(async () => {
    setSubmitting(true)
    try {
      await api.saveWriting(id, { task1Text: task1, task2Text: task2 })
      await api.saveSpeaking(id, { transcript: speaking })
      await api.submitExam(id)
      navigate(`/exam/${id}/results`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }, [id, task1, task2, speaking, navigate])

  if (loading) return <div className="loading-center"><div className="spinner" /><p>Loading exam…</p></div>
  if (error)   return <div className="page"><div className="alert alert-error">{error}</div></div>

  const sec = sections[activeSection]
  const secData = sec ? JSON.parse(sec.section_data || '{}') : null
  const secQuestions = questions.filter(q => q.section_id === sec?.id)

  const wc1 = task1.trim().split(/\s+/).filter(Boolean).length
  const wc2 = task2.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="page">
      {/* Exam header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>{exam?.title}</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>{exam?.difficulty_level} · {exam?.topic_category}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Timer seconds={timeLeft} />
          <button className="btn btn-success" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Exam →'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {/* Section tabs */}
      {sections.length > 1 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {sections.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSection(i)} style={{
              padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeSection === i ? 'var(--brand)' : 'var(--surface)',
              color: activeSection === i ? '#fff' : 'var(--muted)',
              fontWeight: activeSection === i ? 700 : 400, fontSize: 14,
              boxShadow: activeSection === i ? '0 2px 8px rgba(37,99,235,.3)' : 'none',
              border: `1px solid ${activeSection === i ? 'var(--brand)' : 'var(--border)'}`,
              transition: 'all .2s'
            }}>
              {s.section_type === 'reading'   && '📖'} 
              {s.section_type === 'listening' && '🎧'}
              {s.section_type === 'writing'   && '✍️'}
              {s.section_type === 'speaking'  && '🎙️'}
              {' '}{s.title}
            </button>
          ))}
        </div>
      )}

      {sec && (
        <div>
          {/* Instructions */}
          <div className="alert alert-info" style={{ marginBottom: 20, fontSize: 13 }}>
            📋 <strong>{sec.title}</strong> — {sec.instructions} · {sec.duration_minutes} minutes
          </div>

          {/* READING / LISTENING */}
          {(sec.section_type === 'reading' || sec.section_type === 'listening') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
              {/* Passage / Transcript */}
              <div className="card" style={{ maxHeight: 600, overflowY: 'auto' }}>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
                  {sec.section_type === 'reading' ? '📄 Passage' : '📻 Audio Script'}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 14 }}>{secData?.title || secData?.transcript?.slice(0,60)}</h3>
                <p className="passage-text">{secData?.content || secData?.transcript}</p>
              </div>

              {/* Questions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {secQuestions.map((q, i) => (
                  <div key={q.id} className="question-block">
                    <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                      <span className="question-number">{i+1}</span>
                      <p style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{q.question_text}</p>
                    </div>
                    {q.options_json ? (
                      JSON.parse(q.options_json).map(opt => (
                        <label key={opt} className="option-label">
                          <input type="radio" name={`q-${q.id}`} value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => saveAnswer(q.id, opt, sec.section_type)} />
                          <span style={{ fontSize: 14 }}>{opt}</span>
                        </label>
                      ))
                    ) : (
                      <input className="input" placeholder="Your answer…"
                        value={answers[q.id] || ''}
                        onChange={e => saveAnswer(q.id, e.target.value, sec.section_type)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WRITING */}
          {sec.section_type === 'writing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {secData?.tasks?.map((task, i) => (
                <div key={i} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>Task {i+1}</h3>
                    <span style={{ fontSize: 12, color: i===0 ? (wc1>=150?'var(--success)':'var(--muted)') : (wc2>=250?'var(--success)':'var(--muted)') }}>
                      {i===0 ? wc1 : wc2} / {i===0?'150':'250'} words min
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 16, padding: '14px 16px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    {task.prompt}
                  </p>
                  <textarea className="input" rows={i===0?8:12}
                    placeholder={i===0 ? 'Write your Task 1 response here (min 150 words)…' : 'Write your Task 2 essay here (min 250 words)…'}
                    value={i===0 ? task1 : task2}
                    onChange={e => i===0 ? setTask1(e.target.value) : setTask2(e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {/* SPEAKING */}
          {sec.section_type === 'speaking' && (
            <div className="card">
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Speaking Interview</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>Write your spoken responses below (simulating speaking practice)</p>
              
              {secData?.tasks?.part1 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontWeight: 600, marginBottom: 10, color: 'var(--brand)' }}>Part 1 — Introduction Questions</h4>
                  {secData.tasks.part1.map((q,i) => <p key={i} style={{ fontSize: 14, padding: '8px 0', borderBottom: '1px solid var(--border)', color: '#374151' }}>• {q}</p>)}
                </div>
              )}
              {secData?.tasks?.part2 && (
                <div style={{ marginBottom: 20, padding: 16, background: 'var(--brand-light)', borderRadius: 12, border: '1px solid #bfdbfe' }}>
                  <h4 style={{ fontWeight: 600, marginBottom: 8, color: 'var(--brand-dark)' }}>Part 2 — Cue Card</h4>
                  <p style={{ fontSize: 14, whiteSpace: 'pre-wrap', color: '#1e3a8a' }}>{secData.tasks.part2.cueCard}</p>
                </div>
              )}
              {secData?.tasks?.part3 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontWeight: 600, marginBottom: 10, color: 'var(--brand)' }}>Part 3 — Discussion Questions</h4>
                  {secData.tasks.part3.map((q,i) => <p key={i} style={{ fontSize: 14, padding: '8px 0', borderBottom: '1px solid var(--border)', color: '#374151' }}>• {q}</p>)}
                </div>
              )}

              <label className="label" style={{ marginBottom: 8, display: 'block' }}>Your Full Response (write as if speaking)</label>
              <textarea className="input" rows={10}
                placeholder="Write your responses to all parts here. Speak naturally, use examples, and develop your ideas fully…"
                value={speaking}
                onChange={e => setSpeaking(e.target.value)} />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
                {speaking.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
          )}
        </div>
      )}

      {/* Submit bottom */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting} style={{ fontSize: 16, padding: '14px 48px' }}>
          {submitting ? 'Submitting…' : 'Submit Exam & Get Band Score →'}
        </button>
      </div>
    </div>
  )
}
