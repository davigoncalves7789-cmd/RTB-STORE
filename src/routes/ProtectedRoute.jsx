import { Navigate } from 'react-router-dom'
import { useUserStore } from '../store/userStore'

/**
 * Wrapper de rota protegida.
 *
 * Ainda não é usado em nenhuma rota nesta fase (não existe login real
 * ainda), mas já fica pronto: quando o Firebase Auth popular `userStore`,
 * basta envolver a rota desejada com <ProtectedRoute> em AppRoutes.jsx.
 *
 * `role` é opcional — usado futuramente pelo painel administrativo
 * (ex: <ProtectedRoute role="admin">).
 */
export function ProtectedRoute({ children, role }) {
  const { isAuthenticated, usuario } = useUserStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role && usuario?.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}
