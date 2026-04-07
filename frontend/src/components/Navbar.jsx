import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <h2>IELTS 2026</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user && <Link to="/dashboard">Dashboard</Link>}
        {user && <Link to="/exam">Exam</Link>}
        {user && <Link to="/results">Results</Link>}
        {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
        {!user ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
