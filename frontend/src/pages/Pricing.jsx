import { Link } from 'react-router-dom'
import { isLoggedIn } from '../lib/auth'

const plans = [
  {
    name: 'Free',
    price: '0',
    period: '',
    color: '#64748b',
    features: ['1 AI mock exam starter', 'Basic dashboard access', 'Auto-scoring', 'Limited writing feedback'],
    cta: 'Start Free', link: '/register', highlight: false,
  },
  {
    name: 'Premium Monthly',
    price: '19',
    period: '/month',
    color: '#2563eb',
    features: ['Unlimited AI-generated exams', 'Advanced writing evaluation', 'Premium score analytics', 'Full band prediction', '30-day study plan', 'Priority new features'],
    cta: 'Upgrade Monthly', link: '/register', highlight: true,
  },
  {
    name: 'Premium Yearly',
    price: '149',
    period: '/year',
    color: '#0d9488',
    features: ['Everything in Monthly', 'Best value — saves $79', 'Institutional-ready', 'Extended progress tracking', 'Future speaking audio AI'],
    cta: 'Upgrade Yearly', link: '/register', highlight: false,
  },
]

export default function Pricing() {
  const loggedIn = isLoggedIn()

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <h1 className="page-title">Choose Your IELTS Success Plan</h1>
        <p className="page-subtitle" style={{ fontSize: 16, marginTop: 10 }}>
          Built for serious students who want real IELTS band improvement with AI.
        </p>
      </div>

      <div className="grid-3" style={{ alignItems: 'start', marginBottom: 40 }}>
        {plans.map(plan => (
          <div key={plan.name} className="plan-card" style={{ borderColor: plan.highlight ? plan.color : undefined, transform: plan.highlight ? 'scale(1.03)' : undefined }}>
            {plan.highlight && (
              <div style={{ background: plan.color, color: '#fff', textAlign: 'center', padding: '5px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, marginBottom: 20, letterSpacing: 1 }}>
                ⭐ MOST POPULAR
              </div>
            )}
            <h2 style={{ fontWeight: 800, fontSize: 18, marginBottom: 12 }}>{plan.name}</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
              <span className="plan-price" style={{ color: plan.color }}>${plan.price}</span>
              <span style={{ color: 'var(--muted)', fontSize: 15 }}>{plan.period}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 28 }}>
              {plan.features.map(f => (
                <div key={f} className="plan-feature">
                  <span className="check">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <Link to={loggedIn ? '/dashboard' : plan.link} className="btn btn-full" style={{
              background: plan.highlight ? plan.color : 'var(--surface)',
              color: plan.highlight ? '#fff' : plan.color,
              border: `1px solid ${plan.color}`,
              justifyContent: 'center',
            }}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Payment info */}
      <div className="card" style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', border: 'none', color: '#fff', textAlign: 'center' }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>💳 Payment via MTN MoMo & Orange Money</h3>
        <p style={{ opacity: .85, lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
          We support MTN Mobile Money and Orange Money for Cameroon students.
          After registration, contact the admin to activate your premium plan manually.
          Stripe integration coming in the next phase.
        </p>
      </div>
    </div>
  )
}
