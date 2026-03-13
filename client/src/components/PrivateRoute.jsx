import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

/**
 * Wraps any route that requires authentication.
 * - Shows a spinner while auth state is loading from localStorage.
 * - Redirects to "/" if the user is not logged in.
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth)

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg,#fffbef 0%,#f0fdf4 50%,#eff6ff 100%)',
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3.5px solid #e5e7eb',
          borderTopColor: '#f59e0b',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  return user ? children : <Navigate to="/" replace />
}

export default PrivateRoute
