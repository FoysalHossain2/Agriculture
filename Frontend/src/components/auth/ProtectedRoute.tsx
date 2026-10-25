import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/store'

interface Props {
  redirectTo?: string
}

export function ProtectedRoute({ redirectTo = '/login' }: Props) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />
}

/** Redirect already-authenticated users away from auth pages */
export function GuestRoute({ redirectTo = '/' }: Props) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />
}
