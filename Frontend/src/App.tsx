import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { SolutionsPage } from '@/pages/SolutionsPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { LoginPage } from '@/pages/LoginPage'
import { GuestRoute } from '@/components/auth/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      {/* ── Public routes wrapped in main Layout ── */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="solutions" element={<SolutionsPage />} />
      </Route>

      {/* ── Guest-only routes (redirect to / if already logged in) ── */}
      <Route element={<GuestRoute />}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

