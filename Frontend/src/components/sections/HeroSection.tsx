import { ArrowRight, Play, Users, Globe, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Hero statistics
const STATS = [
  { value: '48k+', label: 'Farmers Joined' },
  { value: '35+', label: 'Languages' },
  { value: '120+', label: 'Countries' },
]

export function HeroSection() {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col"
      aria-label="AgFarm Hero"
    >
      {/* ── Background Image ── */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80&auto=format&fit=crop"
          alt="Tractor spraying crops on a green farm field"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative flex-1 flex items-end pb-20 lg:pb-28 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">

            {/* Left: Main Copy */}
            <div>
              {/* Label */}
              <div className="inline-flex items-center gap-2 bg-[#1a6b35]/80 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6 animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-[#8bc34a] animate-pulse" />
                Smart Agriculture Platform
              </div>

              {/* Headline */}
              <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl text-white leading-[1.05] tracking-tight animate-fade-in-up delay-100">
                Smart Agriculture
                <br />
                <span className="text-[#8bc34a]">for a Greener</span>
                <br />
                Future
              </h1>

              {/* Sub-copy */}
              <p className="text-white/80 text-lg md:text-xl mt-6 max-w-md leading-relaxed animate-fade-in-up delay-200">
                We help farmers improve productivity and sustainability through
                innovative agricultural solutions.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mt-8 animate-fade-in-up delay-300">
                <Button
                  id="hero-explore-btn"
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Solutions
                </Button>
                <Button
                  id="hero-consult-btn"
                  variant="accent"
                  size="lg"
                >
                  Free Consultation
                </Button>
              </div>

              {/* Stats row */}
              <div className="flex gap-8 mt-10 animate-fade-in-up delay-400">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Training Card */}
            <div className="flex lg:justify-end animate-scale-in delay-400">
              <div className="glass-card rounded-2xl p-4 flex items-center gap-4 max-w-xs w-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1551836022-8b2858c9c69b?w=120&q=80&fit=crop"
                    alt="Agricultural training session"
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    Live
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-[#1e2d1e] text-sm">Free Online Training</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-[#555]">
                    <Users className="w-3 h-3" />
                    <span>48k+ Joined</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-[#555]">
                    <Globe className="w-3 h-3" />
                    <span>35+ Languages</span>
                  </div>
                </div>

                {/* Join CTA */}
                <button
                  id="training-join-btn"
                  className="flex-shrink-0 bg-[#1a6b35] hover:bg-[#0f4021] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-all duration-200 hover:scale-105"
                >
                  Join <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div className="relative flex justify-center pb-8">
        <button
          onClick={scrollToAbout}
          className="text-white/60 hover:text-white transition-colors duration-200 animate-float"
          aria-label="Scroll to about section"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* ── Play video strip ── */}
      <div className="relative bg-gradient-to-r from-[#1a6b35] to-[#28a745] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-white font-medium text-sm">
              Watch how AgFarm transforms modern agriculture
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
