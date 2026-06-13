import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

/**
 * Wraps routes that require authentication.
 * Redirects to /login if the user is not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    // Preserve the page they tried to visit so we can redirect back
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}