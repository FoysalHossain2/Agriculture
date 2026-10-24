import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/services/auth.service'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
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
    },
    clearCredentials(state) {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
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
