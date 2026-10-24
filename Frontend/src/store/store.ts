import { configureStore } from '@reduxjs/toolkit'
import uiSlice from './slices/uiSlice'
import authSlice from './slices/authSlice'

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    auth: authSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

