import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Leaf, Globe } from 'lucide-react'
import { LogIn, LogOut, User as UserIcon } from 'lucide-react'
import {
  useAppDispatch,
  useAppSelector,
  toggleMobileMenu,
  closeMobileMenu,
  openConsultationModal,
  clearCredentials,
  setLanguage,
  type Language,
} from '@/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home', labelBn: 'হোম', to: '/' },
  { label: 'About Us', labelBn: 'আমাদের সম্পর্কে', to: '/#about' },
  { label: 'Challenges', labelBn: 'চ্যালেঞ্জসমূহ', to: '/#challenges' },
  { label: 'Solutions', labelBn: 'সমাধান', to: '/solutions' },
  { label: 'Innovation', labelBn: 'উদ্ভাবন', to: '/#innovation' },
  { label: 'Projects', labelBn: 'প্রকল্প', to: '/#projects' },
  { label: 'Contact', labelBn: 'যোগাযোগ', to: '/#contact' },
] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const dispatch = useAppDispatch()
  const mobileOpen = useAppSelector((s) => s.ui.mobileMenuOpen)
  const language = useAppSelector((s) => s.ui.language) || 'en'
  const { user, isAuthenticated } = useAppSelector((s) => s.auth)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = () => dispatch(closeMobileMenu())
  const handleLogout = () => {
    dispatch(clearCredentials())
    dispatch(closeMobileMenu())
  }

  const handleLanguageChange = (lang: Language) => {
    dispatch(setLanguage(lang))
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-[#e5ece5]'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={handleNavClick}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#1a6b35] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span
              className={cn(
                'font-display font-black text-2xl transition-colors duration-300 tracking-tight',
                scrolled ? 'text-[#1a6b35]' : 'text-white',
              )}
            >
              AgFarm
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={handleNavClick}
                className={cn(
                  'px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  scrolled
                    ? 'text-[#1e2d1e] hover:text-[#1a6b35] hover:bg-[#eef2ee]'
                    : 'text-white/90 hover:text-white hover:bg-white/15',
                )}
              >
                {language === 'bn' ? link.labelBn : link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher (English / Bangla) */}
            <div
              className={cn(
                'flex items-center rounded-full p-1 border text-xs font-semibold transition-all duration-300 shadow-sm',
                scrolled
                  ? 'bg-[#f4f7f4] border-[#d8e2d8]'
                  : 'bg-white/15 border-white/25 text-white backdrop-blur-md',
              )}
            >
              <button
                type="button"
                id="lang-btn-en"
                onClick={() => handleLanguageChange('en')}
                className={cn(
                  'px-2.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1 cursor-pointer',
                  language === 'en'
                    ? 'bg-[#1a6b35] text-white shadow-sm font-bold'
                    : scrolled
                      ? 'text-[#4a5e44] hover:text-[#1a6b35]'
                      : 'text-white/80 hover:text-white',
                )}
                title="Switch to English"
              >
                <Globe className="w-3 h-3" />
                EN
              </button>
              <button
                type="button"
                id="lang-btn-bn"
                onClick={() => handleLanguageChange('bn')}
                className={cn(
                  'px-2.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1 cursor-pointer',
                  language === 'bn'
                    ? 'bg-[#1a6b35] text-white shadow-sm font-bold'
                    : scrolled
                      ? 'text-[#4a5e44] hover:text-[#1a6b35]'
                      : 'text-white/80 hover:text-white',
                )}
                title="Switch to বাংলা"
              >
                বাংলা
              </button>
            </div>

            {/* Auth / Farmer Login */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-full',
                    scrolled
                      ? 'bg-[#1a6b35]/10 text-[#1a6b35]'
                      : 'bg-white/20 text-white backdrop-blur-sm',
                  )}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{user?.fullname || user?.username || 'User'}</span>
                </span>
                <Button
                  variant={scrolled ? 'outline' : 'outline'}
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  {language === 'bn' ? 'লগআউট' : 'Logout'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  id="navbar-login-btn"
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border',
                    scrolled
                      ? 'border-[#1a6b35]/30 text-[#1a6b35] hover:bg-[#eef2ee]'
                      : 'border-white/30 text-white hover:bg-white/20 backdrop-blur-sm',
                  )}
                >
                  <LogIn className="w-4 h-4 text-[#8bc34a]" />
                  <span>{language === 'bn' ? 'কৃষক লগইন' : 'Farmer Login'}</span>
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Right Bar: Language Switcher + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => handleLanguageChange(language === 'en' ? 'bn' : 'en')}
              className={cn(
                'px-2.5 py-1 text-xs font-bold rounded-full border flex items-center gap-1',
                scrolled
                  ? 'border-[#1a6b35] text-[#1a6b35] bg-[#eef2ee]'
                  : 'border-white/40 text-white bg-white/20',
              )}
            >
              <Globe className="w-3 h-3" />
              {language === 'en' ? 'বাংলা' : 'EN'}
            </button>
            <button
              id="mobile-menu-toggle"
              className={cn(
                'p-2 rounded-lg transition-colors duration-200',
                scrolled ? 'text-[#1a6b35]' : 'text-white',
              )}
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
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
              {language === 'bn' ? link.labelBn : link.label}
            </NavLink>
          ))}

          {/* Auth in Mobile */}
          <div className="pt-2 border-t border-[#e2e8e2] flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-[#1a6b35] flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4" /> {user?.fullname || user?.username}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-1" /> {language === 'bn' ? 'লগআউট' : 'Logout'}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="flex items-center justify-center gap-1.5 border border-[#1a6b35] text-[#1a6b35] py-2.5 rounded-xl font-semibold text-sm text-center"
                >
                  <LogIn className="w-4 h-4" /> {language === 'bn' ? 'কৃষক লগইন' : 'Farmer Login'}
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
