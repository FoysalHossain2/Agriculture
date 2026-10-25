import { Outlet } from 'react-router-dom'
import { MessageSquare, Sparkles } from 'lucide-react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ConsultationModal } from '@/components/sections/ConsultationModal'
import { useAppDispatch, useAppSelector, openConsultationModal } from '@/store'

export function Layout() {
  const dispatch = useAppDispatch()
  const language = useAppSelector((s) => s.ui.language) || 'en'

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ConsultationModal />

      {/* ── Fixed Right-Side Animated Consultation Action ── */}
      <aside
        className="fixed right-4 sm:right-6 bottom-6 sm:bottom-8 z-40 animate-bounce-subtle pointer-events-auto"
        aria-label="Fixed Consultation Action"
      >
        <button
          id="fixed-floating-consultation-btn"
          type="button"
          onClick={() => dispatch(openConsultationModal())}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-[#1a6b35] via-[#228042] to-[#145328] text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl hover:shadow-[0_12px_32px_rgba(26,107,53,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-[#8bc34a]/40 hover:ring-[#8bc34a] border border-white/20 backdrop-blur-md cursor-pointer"
        >
          {/* Subtle light sweep animation */}
          <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 animate-sweep pointer-events-none rounded-full" />

          {/* Glowing Ping indicator */}
          <span className="relative flex h-3.5 w-3.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8bc34a] opacity-80" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#8bc34a]" />
          </span>

          {/* Button Text */}
          <span className="font-display font-bold text-sm tracking-wide whitespace-nowrap drop-shadow-sm">
            {language === 'bn' ? 'ফ্রি পরামর্শ নিন' : 'Get Free Consultation'}
          </span>

          {/* Icon badge */}
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
            <MessageSquare className="w-4 h-4 text-white" />
          </span>
        </button>
      </aside>
    </div>
  )
}
