import { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { SectionLabel, Section, Container } from '@/components/ui/section'

// Inline image avatars used between words in the heading
function WordImage({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="inline-block align-middle mx-1.5">
      <img
        src={src}
        alt={alt}
        className="inline-block w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full object-cover border-4 border-white shadow-lg"
      />
    </span>
  )
}

// Video Player (YouTube embed or local video)
function VideoPlayer() {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(!muted)
  }

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl group">
      {/* Video element – using a public stock agriculture video */}
      <video
        ref={videoRef}
        className="w-full aspect-video object-cover"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        poster="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80&fit=crop"
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Overlay controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
        <button
          id="about-video-play-btn"
          onClick={togglePlay}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
          aria-label={playing ? 'Pause video' : 'Play video'}
        >
          {playing
            ? <><Pause className="w-4 h-4 fill-white" /> Pause</>
            : <><Play className="w-4 h-4 fill-white" /> Play</>}
        </button>
        <button
          id="about-video-mute-btn"
          onClick={toggleMute}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 hover:scale-105"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Center Play button (idle) */}
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Play video"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/25 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse-green">
            <Play className="w-7 h-7 sm:w-9 sm:h-9 text-white fill-white ml-1" />
          </div>
        </button>
      )}

      {/* Badge */}
      <div className="absolute top-4 left-4 bg-[#1a6b35] text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-[#8bc34a] rounded-full" />
        AgFarm in Action
      </div>
    </div>
  )
}

// About stats shown below the video
const ABOUT_STATS = [
  { value: '15+', label: 'Years Experience' },
  { value: '200k+', label: 'Acres Managed' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '50+', label: 'Expert Advisors' },
]

export function AboutSection() {
  return (
    <Section id="about" className="bg-[#f8faf8]">
      <Container>
        {/* ── Top Label ── */}
        <div className="mb-10 animate-fade-in-up">
          <SectionLabel text="About Us" />
        </div>

        {/* ── Headline with embedded images (matching screenshot) ── */}
        <div className="max-w-5xl animate-fade-in-up delay-100">
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#1e2d1e] leading-[1.08] tracking-tight">
            We Help Farmers
            <WordImage
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=120&h=120&q=80&fit=crop"
              alt="Happy farmer"
            />
            <WordImage
              src="https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=120&h=120&q=80&fit=crop"
              alt="Modern farmer with tablet"
            />
            Improve Productivity
            <br />
            And Sustainability Through Innovative
            <WordImage
              src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=120&h=120&q=80&fit=crop"
              alt="Agricultural technology"
            />
            <br />
            Agricultural
            <WordImage
              src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=120&h=120&q=80&fit=crop"
              alt="Green tractor"
            />
            Solutions.
          </h2>
        </div>

        {/* ── Video ── */}
        <div className="mt-16 animate-scale-in delay-200">
          <VideoPlayer />
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {ABOUT_STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center p-6 rounded-2xl bg-white border border-[#d9e3d9] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-fade-in-up`}
              style={{ animationDelay: `${(i + 3) * 100}ms` }}
            >
              <div className="font-display font-black text-4xl text-[#1a6b35]">{stat.value}</div>
              <div className="text-[#6b7c6b] text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Two-column text below ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20 animate-fade-in-up delay-200">
          <div>
            <h3 className="font-display font-bold text-2xl text-[#1e2d1e] mb-4">
              Our Mission
            </h3>
            <p className="text-[#5a6b5a] leading-relaxed">
              AgFarm was founded on the belief that technology should empower farmers, not replace them. We develop intuitive tools that help agricultural communities make smarter decisions, reduce waste, and increase yields—all while caring for the environment.
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold text-2xl text-[#1e2d1e] mb-4">
              Our Approach
            </h3>
            <p className="text-[#5a6b5a] leading-relaxed">
              We combine cutting-edge precision agriculture technology with deep domain expertise. From soil sensors and drone imaging to AI-driven forecasting, our integrated platform gives farmers a complete picture of their operations in real time.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
