import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/services/auth.service'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null
let storedUser: AuthUser | null = null
try {
  if (storedUserStr) {
    storedUser = JSON.parse(storedUserStr)
  }
} catch {
  storedUser = null
}

const initialState: AuthState = {
  user: storedUser,
  accessToken: storedToken,
  isAuthenticated: Boolean(storedToken),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>
    ) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isAuthenticated = true
      state.error = null

      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', action.payload.accessToken)
        localStorage.setItem('authUser', JSON.stringify(action.payload.user))
      }
    },
    clearCredentials(state) {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.error = null

      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('authUser')
      }
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const { setCredentials, clearCredentials, setAuthLoading, setAuthError } =
  authSlice.actions

export default authSlice.reducer
