import { Link } from 'react-router-dom'
import { Leaf, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.69-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

const FOOTER_LINKS = {
  Company: ['About Us', 'Our Team', 'Careers', 'Press', 'Blog'],
  Solutions: ['Crop Management', 'Smart Irrigation', 'Soil Analysis', 'Precision Farming', 'Agri Analytics'],
  Support: ['Help Center', 'Documentation', 'API Reference', 'Community', 'Contact'],
}

const SOCIALS = [
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
  { icon: TwitterIcon, href: '#', label: 'Twitter' },
  { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
]

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="bg-[#0f1a0f] text-white">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-[#1a6b35] to-[#28a745]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white">
              Ready to Transform Your Farm?
            </h3>
            <p className="text-white/80 mt-1">
              Join 48,000+ farmers already using AgFarm solutions.
            </p>
          </div>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 bg-white text-[#1a6b35] font-semibold px-8 py-3 rounded-full hover:bg-[#eef2ee] transition-colors duration-200 whitespace-nowrap"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#1a6b35] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">AgFarm</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              We help farmers improve productivity and sustainability through innovative agricultural solutions worldwide.
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/60">
              <a href="mailto:hello@agfarm.com" className="flex items-center gap-2 hover:text-[#8bc34a] transition-colors">
                <Mail className="w-4 h-4" /> hello@agfarm.com
              </a>
              <a href="tel:+18005551234" className="flex items-center gap-2 hover:text-[#8bc34a] transition-colors">
                <Phone className="w-4 h-4" /> +1 800 555 1234
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> 123 Green Ave, AgCity, USA
              </span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-semibold text-white mb-4">{heading}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      to="#"
                      className="text-white/55 text-sm hover:text-[#8bc34a] transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {CURRENT_YEAR} AgFarm. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-[#1a6b35] hover:text-white transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
