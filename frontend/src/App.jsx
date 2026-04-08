import { Link, Route, Routes } from 'react-router-dom'

function HomePage() {
  return (
    <div className="page">
      <h1>IELTS 2026</h1>
      <p>Your complete exam preparation platform.</p>

      <div className="nav-links">
        <Link to="/practice">Go to Practice</Link>
        <Link to="/dashboard">Go to Dashboard</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  )
}

function LoginPage() {
  return (
    <div className="page">
      <h1>Login</h1>
      <p>Access your IELTS 2026 student account.</p>
      <Link to="/">← Back Home</Link>
    </div>
  )
}

function DashboardPage() {
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Track your progress, mock tests, and study performance.</p>
      <Link to="/">← Back Home</Link>
    </div>
  )
}

function PracticePage() {
  return (
    <div className="page">
      <h1>Practice Tests</h1>
      <p>Start listening, reading, writing, and speaking practice here.</p>
      <Link to="/">← Back Home</Link>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">← Return Home</Link>
    </div>
  )
}

export default function App() {
  const appName = import.meta.env.VITE_APP_NAME || 'IELTS 2026'

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h2>{appName}</h2>
          <p>Built for serious IELTS success</p>
        </div>
        <nav className="top-nav">
          <Link to="/">Home</Link>
          <Link to="/practice">Practice</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} {appName}. All rights reserved.</p>
      </footer>
    </div>
  )
}
