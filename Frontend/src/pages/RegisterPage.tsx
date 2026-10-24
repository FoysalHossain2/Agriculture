import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Leaf, User, Mail, Lock, ChevronDown } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { authService, type UserRole } from '@/services/auth.service'
import { setCredentials, setAuthError } from '@/store/slices/authSlice'

// ── Validation Schema ─────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    fullname: z.string().min(2, 'Full name must be at least 2 characters'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers & underscores'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
    role: z.enum([
      'farmer',
      'buyer',
      'service_provider',
      'agriculture_expert',
      'admin',
    ] as const),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'farmer', label: '🌾 Farmer' },
  { value: 'buyer', label: '🛒 Buyer' },
  { value: 'service_provider', label: '🔧 Service Provider' },
  { value: 'agriculture_expert', label: '🌿 Agriculture Expert' },
]

// ── Component ─────────────────────────────────────────────────────────────────
export function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'farmer' },
  })

  const password = watch('password', '')

  // Password strength
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColors = [
    '',
    'bg-red-400',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-[#245C36]',
  ]

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)
    setServerError(null)
    try {
      const res = await authService.register({
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      })
      dispatch(
        setCredentials({
          user: res.data.data.user,
          accessToken: res.data.data.accessToken,
        })
      )
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
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
            <h1 className="auth-title">Your farming journey<br />starts here</h1>
            <p className="auth-subtitle">Create your account to get started</p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="auth-error-banner" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
            {/* Full Name */}
            <div className="auth-field">
              <div className="auth-input-wrapper">
                <User className="auth-input-icon" />
                <input
                  id="reg-fullname"
                  type="text"
                  placeholder="Full name"
                  className={`auth-input ${errors.fullname ? 'auth-input-error' : ''}`}
                  {...register('fullname')}
                  autoComplete="name"
                />
              </div>
              {errors.fullname && (
                <p className="auth-field-error">{errors.fullname.message}</p>
              )}
            </div>

            {/* Username */}
            <div className="auth-field">
              <div className="auth-input-wrapper">
                <span className="auth-input-icon auth-at">@</span>
                <input
                  id="reg-username"
                  type="text"
                  placeholder="Username"
                  className={`auth-input ${errors.username ? 'auth-input-error' : ''}`}
                  {...register('username')}
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <p className="auth-field-error">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="auth-field">
              <div className="auth-input-wrapper">
                <Mail className="auth-input-icon" />
                <input
                  id="reg-email"
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

            {/* Role */}
            <div className="auth-field">
              <div className="auth-input-wrapper">
                <ChevronDown className="auth-input-icon-right" />
                <select
                  id="reg-role"
                  className="auth-input auth-select"
                  {...register('role')}
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role && (
                <p className="auth-field-error">{errors.role.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="auth-field">
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`auth-input auth-input-padded-right ${errors.password ? 'auth-input-error' : ''}`}
                  {...register('password')}
                  autoComplete="new-password"
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
              {/* Strength Bar */}
              {password && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`auth-strength-bar ${
                          i <= strength ? strengthColors[strength] : 'bg-[#d4dbc6]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="auth-strength-label">{strengthLabel}</span>
                </div>
              )}
              {errors.password && (
                <p className="auth-field-error">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" />
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm password"
                  className={`auth-input auth-input-padded-right ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                  {...register('confirmPassword')}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-toggle-btn"
                  onClick={() => setShowConfirm((p) => !p)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="auth-field-error">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="auth-submit-btn"
            >
              {isSubmitting ? (
                <span className="auth-spinner" />
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-switch-link">
              Log in
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
