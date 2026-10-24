import { useDispatch, useSelector } from 'react-redux'
import { X, Send } from 'lucide-react'
import type { RootState } from '@/store/store'
import { closeConsultationModal } from '@/store/slices/uiSlice'
import { useState } from 'react'

export function ConsultationModal() {
  const dispatch = useDispatch()
  const isOpen = useSelector(
    (state: RootState) => state.ui.consultationModalOpen,
  )
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      dispatch(closeConsultationModal())
    }, 2000)
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) dispatch(closeConsultationModal())
      }}
    >
      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a6b35] to-[#28a745] px-8 py-6">
          <h2
            id="consultation-modal-title"
            className="font-display font-bold text-2xl text-white"
          >
            Free Consultation
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Our experts will get back to you within 24 hours.
          </p>
          <button
            id="consultation-modal-close-btn"
            onClick={() => dispatch(closeConsultationModal())}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-200 hover:scale-110"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="consult-name"
                className="block text-sm font-medium text-[#1e2d1e] mb-1"
              >
                Full Name
              </label>
              <input
                id="consult-name"
                type="text"
                required
                placeholder="John Doe"
                className="w-full border border-[#d0ddd0] rounded-xl px-4 py-2.5 text-sm text-[#1e2d1e] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#1a6b35] transition"
              />
            </div>
            <div>
              <label
                htmlFor="consult-phone"
                className="block text-sm font-medium text-[#1e2d1e] mb-1"
              >
                Phone Number
              </label>
              <input
                id="consult-phone"
                type="tel"
                placeholder="+1 555 000 0000"
                className="w-full border border-[#d0ddd0] rounded-xl px-4 py-2.5 text-sm text-[#1e2d1e] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#1a6b35] transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="consult-email"
              className="block text-sm font-medium text-[#1e2d1e] mb-1"
            >
              Email Address
            </label>
            <input
              id="consult-email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full border border-[#d0ddd0] rounded-xl px-4 py-2.5 text-sm text-[#1e2d1e] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#1a6b35] transition"
            />
          </div>

          <div>
            <label
              htmlFor="consult-topic"
              className="block text-sm font-medium text-[#1e2d1e] mb-1"
            >
              Topic
            </label>
            <select
              id="consult-topic"
              className="w-full border border-[#d0ddd0] rounded-xl px-4 py-2.5 text-sm text-[#1e2d1e] focus:outline-none focus:ring-2 focus:ring-[#1a6b35] transition bg-white"
            >
              <option value="">Select a topic…</option>
              <option value="soil">Soil Health</option>
              <option value="irrigation">Irrigation</option>
              <option value="crop">Crop Planning</option>
              <option value="pest">Pest Management</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="consult-message"
              className="block text-sm font-medium text-[#1e2d1e] mb-1"
            >
              Message
            </label>
            <textarea
              id="consult-message"
              rows={3}
              placeholder="Tell us about your farm and what you need help with…"
              className="w-full border border-[#d0ddd0] rounded-xl px-4 py-2.5 text-sm text-[#1e2d1e] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#1a6b35] transition resize-none"
            />
          </div>

          <button
            id="consultation-submit-btn"
            type="submit"
            disabled={submitted}
            className="w-full flex items-center justify-center gap-2 bg-[#1a6b35] hover:bg-[#0f4021] disabled:bg-[#6aaa7f] text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
          >
            {submitted ? (
              'Request Sent ✓'
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
