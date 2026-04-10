import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getUser, clearAuth, isLoggedIn, isAdmin } from '../lib/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()
  const loggedIn = isLoggedIn()

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  const active = (path) =>
    location.pathname === path ? 'nav-link active' : 'nav-link'

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">🎓 IELTS Master AI 2026</Link>

        <div className="navbar-links">
          <Link to="/pricing" className={active('/pricing')}>Pricing</Link>

          {loggedIn ? (
            <>
              <Link to="/dashboard" className={active('/dashboard')}>Dashboard</Link>
              <Link to="/exam/generate" className={active('/exam/generate')}>New Exam</Link>
              {isAdmin() && <Link to="/admin" className={active('/admin')}>Admin</Link>}
              <button onClick={logout} className="btn btn-secondary btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className={active('/login')}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
