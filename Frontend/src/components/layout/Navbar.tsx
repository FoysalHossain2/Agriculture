import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Leaf } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { toggleMobileMenu, closeMobileMenu, openConsultationModal } from '@/store/slices/uiSlice'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/#about' },
  { label: 'Solutions', to: '/#solutions' },
  { label: 'Innovation', to: '/#innovation' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Contact', to: '/#contact' },
] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const dispatch = useDispatch()
  const mobileOpen = useSelector((s: RootState) => s.ui.mobileMenuOpen)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = () => dispatch(closeMobileMenu())

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-md'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={handleNavClick}
          >
            <div className="w-9 h-9 rounded-xl bg-[#1a6b35] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span
              className={cn(
                'font-display font-bold text-xl transition-colors duration-300',
                scrolled ? 'text-[#1a6b35]' : 'text-white',
              )}
            >
              AgFarm
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={handleNavClick}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  scrolled
                    ? 'text-[#1e2d1e] hover:text-[#1a6b35] hover:bg-[#eef2ee]'
                    : 'text-white/90 hover:text-white hover:bg-white/15',
                )}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              variant={scrolled ? 'default' : 'outline'}
              size="md"
              onClick={() => dispatch(openConsultationModal())}
            >
              Get Free Consultation
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors duration-200',
              scrolled ? 'text-[#1a6b35]' : 'text-white',
            )}
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-400 ease-in-out bg-white/95 backdrop-blur-xl border-t border-[#d9e3d9]',
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-4 py-6 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={handleNavClick}
              className="px-4 py-3 rounded-xl text-[#1e2d1e] font-medium hover:bg-[#eef2ee] hover:text-[#1a6b35] transition-colors duration-200"
            >
              {link.label}
            </NavLink>
          ))}
          <Button
            variant="default"
            size="lg"
            className="mt-4"
            onClick={() => {
              dispatch(openConsultationModal())
              dispatch(closeMobileMenu())
            }}
          >
            Get Free Consultation
          </Button>
        </div>
      </div>
    </header>
  )
}
