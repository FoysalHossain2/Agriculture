import { Link } from 'react-router-dom'
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react'

const FOOTER_LINKS = {
  Company: ['About Us', 'Our Team', 'Careers', 'Press', 'Blog'],
  Solutions: ['Crop Management', 'Smart Irrigation', 'Soil Analysis', 'Precision Farming', 'Agri Analytics'],
  Support: ['Help Center', 'Documentation', 'API Reference', 'Community', 'Contact'],
}

const SOCIALS = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
]

export function Footer() {
  return (
    <footer className="bg-[#0f1a0f] text-white">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-[#1a6b35] to-[#28a745]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
            © {new Date().getFullYear()} AgFarm. All rights reserved.
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
