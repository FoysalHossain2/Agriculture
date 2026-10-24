import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Leaf, Mail, Lock } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { authService } from '@/services/auth.service'
import { setCredentials, setAuthError } from '@/store/slices/authSlice'

// ── Validation Schema ─────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

// ── Component ─────────────────────────────────────────────────────────────────
export function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    setServerError(null)
    try {
      const res = await authService.login(data)
      dispatch(
        setCredentials({
          user: res.data.data.user,
          accessToken: res.data.data.accessToken,
        })
      )
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setServerError(msg)
      dispatch(setAuthError(msg))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      {/* ── Left Panel ───────────────────────────────────────────────── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="auth-logo-text">GrowWise</span>
          </div>

          <div className="auth-header">
            <h1 className="auth-title">Welcome back,<br />farmer</h1>
            <p className="auth-subtitle">Log in to continue your journey</p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="auth-error-banner" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
            {/* Email */}
            <div className="auth-field">
              <div className="auth-input-wrapper">
                <Mail className="auth-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="Email address"
                  className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                  {...register('email')}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="auth-field-error">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="auth-field">
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`auth-input auth-input-padded-right ${errors.password ? 'auth-input-error' : ''}`}
                  {...register('password')}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-toggle-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="auth-field-error">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="auth-forgot">
              <Link to="/forgot-password" className="auth-forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="auth-submit-btn"
            >
              {isSubmitting ? (
                <span className="auth-spinner" />
              ) : (
                'Log in'
              )}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register" className="auth-switch-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right Panel ──────────────────────────────────────────────── */}
      <div className="auth-hero-panel">
        <img
          src="/auth-hero.jpg"
          alt="Lush green farm plantation"
          className="auth-hero-img"
        />
        <div className="auth-hero-overlay">
          <div className="auth-hero-badge">
            <div className="auth-hero-logo">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="auth-hero-tagline">
            <h2>Grow smarter,<br />farm better</h2>
            <p>Connecting farmers, buyers and experts across the country.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
