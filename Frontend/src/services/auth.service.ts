import api from '@/lib/api'

export type UserRole =
  | 'farmer'
  | 'buyer'
  | 'service_provider'
  | 'agriculture_expert'
  | 'admin'

export interface RegisterPayload {
  username: string
  email: string
  fullname: string
  password: string
  role: UserRole
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  _id: string
  username: string
  email: string
  fullname: string
  role: UserRole
  avatar?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: AuthUser
    accessToken: string
    refreshToken: string
  }
}

export const authService = {
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', payload),

  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload),

  logout: () =>
    api.post('/auth/logout'),

  refreshToken: () =>
    api.post('/auth/refresh-token'),
}
