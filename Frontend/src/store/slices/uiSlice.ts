import { createSlice } from '@reduxjs/toolkit'

interface UIState {
  mobileMenuOpen: boolean
  consultationModalOpen: boolean
}

const initialState: UIState = {
  mobileMenuOpen: false,
  consultationModalOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false
    },
    openConsultationModal(state) {
      state.consultationModalOpen = true
    },
    closeConsultationModal(state) {
      state.consultationModalOpen = false
    },
  },
})

export const {
  toggleMobileMenu,
  closeMobileMenu,
  openConsultationModal,
  closeConsultationModal,
} = uiSlice.actions

export default uiSlice.reducer
