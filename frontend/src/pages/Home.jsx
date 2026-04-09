import { Link } from 'react-router-dom'

const features = [
  { icon: '🧠', title: 'AI-Generated Exams', desc: 'Fresh unique questions every session — no two exams are the same.' },
  { icon: '📊', title: 'Instant Band Score', desc: 'Automatic evaluation with IELTS band scores 1–9 immediately after submission.' },
  { icon: '✍️', title: 'Writing Feedback', desc: 'Detailed scores for Task Achievement, Coherence, Lexical Resource, Grammar.' },
  { icon: '🎯', title: '2026 Format', desc: 'Up-to-date with the latest IELTS 2026 task specifications and question types.' },
  { icon: '📈', title: 'Progress Analytics', desc: 'Track your band score improvement across all four modules over time.' },
  { icon: '🔒', title: 'Premium Plans', desc: 'Unlock unlimited exams, advanced analytics, and personalised study plans.' },
]

const bands = [
  { label: 'Listening', value: 7.5, color: '#2563eb' },
  { label: 'Reading',   value: 7.0, color: '#0d9488' },
  { label: 'Writing',   value: 6.5, color: '#f59e0b' },
  { label: 'Speaking',  value: 6.5, color: '#8b5cf6' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#eff6ff 0%,#f0fdfa 100%)', padding: '80px 20px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48, alignItems: 'center' }}>
          <div className="fade-up">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dbeafe', color: '#1d4ed8', borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              🎓 IELTS 2026 · AI-Powered
            </div>
            <h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
              Master IELTS with{' '}
              <span style={{ color: 'var(--brand)' }}>AI Exam Simulation</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
              Generate unlimited IELTS mock exams, get instant band scores, and unlock premium AI-powered
              improvement strategies — all in one platform.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: 16, padding: '13px 32px' }}>
                Start Free Test →
              </Link>
              <Link to="/pricing" className="btn btn-secondary" style={{ fontSize: 16, padding: '13px 32px' }}>
                View Plans
              </Link>
            </div>
          </div>

          {/* Band Score Preview Card */}
          <div className="card fade-up" style={{ background: '#0f172a', border: 'none', color: '#fff' }}>
            <p style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 20 }}>
              Your Band Score Preview
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {bands.map(b => (
                <div key={b.label} style={{ background: 'rgba(255,255,255,.07)', borderRadius: 12, padding: '16px 14px' }}>
                  <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{b.label}</p>
                  <p style={{ fontSize: 32, fontWeight: 800, color: b.color }}>{b.value}</p>
                  <div style={{ background: 'rgba(255,255,255,.1)', borderRadius: 20, height: 4, marginTop: 8 }}>
                    <div style={{ width: `${(b.value/9)*100}%`, height: '100%', background: b.color, borderRadius: 20 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(37,99,235,.3)', border: '1px solid rgba(37,99,235,.5)', borderRadius: 12, padding: 14 }}>
              <p style={{ fontSize: 13, color: '#93c5fd', lineHeight: 1.6 }}>
                🎯 "You are 82% likely to reach Band 7 if you improve Writing Task 2 coherence."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 20px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, marginBottom: 10 }}>
              Everything You Need to Succeed
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 16 }}>
              Built like a serious international EdTech platform — not a simple school website.
            </p>
          </div>
          <div className="grid-3">
            {features.map((f, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', animationDelay: `${i * 60}ms` }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 20px', background: 'linear-gradient(135deg,#1e3a8a,#0d9488)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            Ready to Achieve Your Target Band?
          </h2>
          <p style={{ color: 'rgba(255,255,255,.8)', marginBottom: 28, fontSize: 16 }}>
            Join thousands of students preparing smarter with AI-powered IELTS simulation.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn" style={{ background: '#fff', color: 'var(--brand)', fontSize: 15, padding: '13px 32px' }}>
              Start Free Today
            </Link>
            <Link to="/pricing" className="btn" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.5)', fontSize: 15, padding: '13px 32px' }}>
              See Premium Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
