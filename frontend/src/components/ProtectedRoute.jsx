import { Navigate } from 'react-router-dom'
import { isLoggedIn, isAdmin } from '../lib/auth'

export default function ProtectedRoute({ children, adminOnly = false }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin()) return <Navigate to="/dashboard" replace />
  return children
}
