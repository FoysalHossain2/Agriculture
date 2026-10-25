import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Language = 'en' | 'bn'

interface UIState {
  mobileMenuOpen: boolean
  consultationModalOpen: boolean
  language: Language
}

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ag_lang')
    if (saved === 'bn' || saved === 'en') return saved
  }
  return 'en'
}

const initialState: UIState = {
  mobileMenuOpen: false,
  consultationModalOpen: false,
  language: getInitialLanguage(),
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
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('ag_lang', action.payload)
      }
    },
    toggleLanguage(state) {
      state.language = state.language === 'en' ? 'bn' : 'en'
      if (typeof window !== 'undefined') {
        localStorage.setItem('ag_lang', state.language)
      }
    },
  },
})

export const {
  toggleMobileMenu,
  closeMobileMenu,
  openConsultationModal,
  closeConsultationModal,
  setLanguage,
  toggleLanguage,
} = uiSlice.actions

export default uiSlice.reducer
