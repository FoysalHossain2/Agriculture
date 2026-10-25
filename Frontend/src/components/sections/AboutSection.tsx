import { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { SectionLabel, Section, Container } from '@/components/ui/section'
import { useAppSelector } from '@/store'

// Inline video capsules used between words in the heading
function WordVideo({
  src,
  poster,
  alt,
}: {
  src: string
  poster: string
  alt: string
}) {
  return (
    <span className="inline-flex align-middle mx-1.5 sm:mx-2 md:mx-3 my-1 sm:my-1.5 group select-none">
      <span className="relative inline-block w-16 h-10 sm:w-20 sm:h-12 md:w-28 md:h-16 lg:w-32 lg:h-18 rounded-full overflow-hidden border-2 sm:border-4 border-white shadow-xl ring-2 ring-[#1a6b35]/30 group-hover:ring-[#8bc34a] group-hover:scale-105 transition-all duration-300">
        <video
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          aria-label={alt}
        />
        <span className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors duration-300" />
        <span className="absolute bottom-1 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#8bc34a] animate-pulse" />
      </span>
    </span>
  )
}

// Video Player
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
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl group border border-[#d8e3d8]">




    </div>
  )
}



export function AboutSection() {
  const language = useAppSelector((s) => s.ui.language) || 'en'

  return (
    <Section id="about" className="bg-[#f8faf8] overflow-hidden">
      <Container>
        {/* ── Top Label ── */}
        <div className="mb-8 animate-fade-in-up">
          <SectionLabel text={language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'} />
        </div>

        {/* ── Full Width Expanded Typography with Embedded Looping Videos ── */}
        <div className="w-full max-w-none animate-fade-in-up delay-100">
          {language === 'bn' ? (
            <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl text-[#1e2d1e] leading-[1.2] tracking-tight w-full">
              আমরা কৃষকদের
              <WordVideo
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                poster="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80&fit=crop"
                alt="কৃষক মাঠে কাজ করছেন"
              />
              সাহায্য করি
              <WordVideo
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                poster="https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=400&q=80&fit=crop"
                alt="স্মার্ট কৃষক ও আধুনিক প্রযুক্তি"
              />
              উৎপাদনশীলতা বৃদ্ধি করতে

              এবং টেকসই উদ্ভাবনী
              <WordVideo
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                poster="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=400&q=80&fit=crop"
                alt="আধুনিক কৃষি প্রযুক্তি"
              />

              কৃষি
              <WordVideo
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                poster="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80&fit=crop"
                alt="সবুজ ট্র‍্যাক্টর ও ফসল"
              />
              সমাধানের মাধ্যমে।
            </h2>
          ) : (
            <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#1e2d1e] leading-[1.14] tracking-tight w-full">
              We Help Farmers
              <WordVideo
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                poster="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80&fit=crop"
                alt="Happy farmer in field"
              />
              <WordVideo
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                poster="https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=400&q=80&fit=crop"
                alt="Smart farming digital tablet"
              />
              Improve Productivity

              And Sustainability Through Innovative
              <WordVideo
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                poster="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=400&q=80&fit=crop"
                alt="Precision agricultural technology"
              />

              Agricultural
              <WordVideo
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                poster="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80&fit=crop"
                alt="Green tractor harvest in field"
              />
              Solutions.
            </h2>
          )}
        </div>

      </Container>
    </Section>
  )
}
