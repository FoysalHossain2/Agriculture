import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldAlert,
  Bug,
  Sprout,
  Layers,
  CloudRain,
  Droplets,
  DollarSign,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Section, Container, SectionLabel } from '@/components/ui/section'
import { useAppSelector } from '@/store'
import { cn } from '@/lib/utils'

export interface ChallengeItem {
  id: string
  number: string
  title: string
  titleBn: string
  problem: string
  problemBn: string
  solution: string
  solutionBn: string
  tags: string[]
  tagsBn: string[]
  icon: typeof Bug
  accentColor: string
  cardBg: string
  showcaseImage: string
  showcaseAlt: string
}

const CHALLENGES: ChallengeItem[] = [
  {
    id: 'crop-diseases',
    number: '01',
    title: 'Crop Diseases & Pest Attacks',
    titleBn: 'ফসলের রোগ ও পোকার আক্রমণ',
    problem:
      'Crop diseases and pests can spread quickly, damaging plant health and reducing harvest quality.',
    problemBn:
      'ফসলের রোগ ও ক্ষতিকারক পোকা দ্রুত ছড়িয়ে পড়ে উদ্ভিদের ক্ষতি করে এবং ফলনের মান ব্যাপকভাবে কমিয়ে দেয়।',
    solution:
      'Identify potential problems early and provide targeted crop protection recommendations.',
    solutionBn:
      'সম্ভাব্য সমস্যা প্রাথমিক পর্যায়ে শনাক্তকরণ এবং লক্ষ্যভিত্তিক ফসল সুরক্ষা ও বালাইনাশক পরামর্শ প্রদান।',
    tags: ['Early Detection', 'Crop Protection', 'AI Diagnosis'],
    tagsBn: ['প্রাথমিক শনাক্তকরণ', 'ফসল সুরক্ষা', 'এআই রোগ নির্ণয়'],
    icon: Bug,
    accentColor: '#eab308',
    cardBg:
      'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=800&q=80&fit=crop',
    showcaseImage:
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1400&q=85&fit=crop',
    showcaseAlt: 'Healthy crop leaf inspected with precision farming protection',
  },
  {
    id: 'soil-health',
    number: '02',
    title: 'Poor Soil Health & Low Yield',
    titleBn: 'অনুর্বর মাটি ও কম ফলন',
    problem:
      'Nutrient imbalances, unsuitable soil conditions, and incorrect fertilizer use can limit crop growth.',
    problemBn:
      'পুষ্টির ভারসাম্যহীনতা, মাটির প্রতিকূল পরিবেশ এবং অপরিমিত সার প্রয়োগ ফসলের স্বাভাবিক বৃদ্ধিতে বড় বাধা সৃষ্টি করে।',
    solution:
      'Soil testing guidance and crop-specific nutrient management plans.',
    solutionBn:
      'মাটি পরীক্ষার দিকনির্দেশনা এবং ফসল-নির্দিষ্ট সুষম পুষ্টি ও সার ব্যবস্থাপনা পরিকল্পনা।',
    tags: ['Soil Testing', 'Nutrient Plan', 'Organic Balance'],
    tagsBn: ['মাটি পরীক্ষা', 'পুষ্টি পরিকল্পনা', 'জৈব ভারসাম্য'],
    icon: Sprout,
    accentColor: '#8bc34a',
    cardBg:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80&fit=crop',
    showcaseImage:
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1400&q=85&fit=crop',
    showcaseAlt: 'Rich fertile soil cupped in farmer hands with fresh green seedling',
  },
  {
    id: 'water-scarcity',
    number: '03',
    title: 'Water Scarcity & Unpredictable Weather',
    titleBn: 'পানির সংকট ও অনির্ভরযোগ্য আবহাওয়া',
    problem:
      'Irregular rainfall, drought, and inefficient irrigation make farming decisions harder.',
    problemBn:
      'অনিয়মিত বৃষ্টিপাত, তীব্র খরা ও সনাতন সেচ পদ্ধতির কারণে সঠিক সময়ে চাষের সিদ্ধান্ত নেওয়া অত্যন্ত কঠিন হয়ে পড়ে।',
    solution:
      'Smarter irrigation planning, weather-aware guidance, and water conservation strategies.',
    solutionBn:
      'আধুনিক ড্রিপ ও স্মার্ট সেচ পরিকল্পনা, আবহাওয়া সচেতন পরামর্শ এবং টেকসই পানিসম্পদ সংরক্ষণ কৌশল।',
    tags: ['Smart Irrigation', 'Weather Aware', 'Water Saving'],
    tagsBn: ['স্মার্ট সেচ ব্যবস্থা', 'আবহাওয়া পূর্বাভাস', 'পানি সংরক্ষণ'],
    icon: CloudRain,
    accentColor: '#38bdf8',
    cardBg:
      'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80&fit=crop',
    showcaseImage:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1400&q=85&fit=crop',
    showcaseAlt: 'Automated agricultural sprinkler watering crops at sunrise',
  },
  {
    id: 'rising-costs',
    number: '04',
    title: 'Rising Input Costs & Uncertain Profits',
    titleBn: 'উচ্চ উৎপাদন খরচ ও অনিশ্চিত মুনাফা',
    problem:
      'Fertilizer, seeds, labor, and pesticides can consume profits when farm resources are poorly managed.',
    problemBn:
      'সার, বীজ, শ্রমিক ও বালাইনাশকের ক্রমাগত মূল্যবৃদ্ধি কৃষকের কাঙ্ক্ষিত মুনাফা কমিয়ে ফেলে যখন খামার ব্যবস্থাপনা সঠিক থাকে না।',
    solution:
      'Farm budgeting, input optimization, and cost-versus-return planning.',
    solutionBn:
      'খামার বাজেট প্রণয়ন, উপকরণের সঠিক ব্যবহার এবং খরচ বনাম সর্বোচ্চ মুনাফা অর্জনের সুস্পষ্ট পরিকল্পনা।',
    tags: ['Cost Optimization', 'Farm Budgeting', 'ROI Maximizer'],
    tagsBn: ['ব্যয় অপ্টিমাইজেশন', 'খামার বাজেট', 'মুনাফা বৃদ্ধি'],
    icon: DollarSign,
    accentColor: '#f59e0b',
    cardBg:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80&fit=crop',
    showcaseImage:
      'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1400&q=85&fit=crop',
    showcaseAlt: 'Golden ripe maize corn harvest dried in sun matching reference design',
  },
]

export function FarmingChallengesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const language = useAppSelector((s) => s.ui.language) || 'en'

  const activeChallenge = CHALLENGES[activeIndex]

  // Auto-play progress cycle
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CHALLENGES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const handleNext = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev + 1) % CHALLENGES.length)
  }

  const handlePrev = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev - 1 + CHALLENGES.length) % CHALLENGES.length)
  }

  const handleSelect = (index: number) => {
    setIsAutoPlaying(false)
    setActiveIndex(index)
  }

  return (
    <Section
      id="challenges"
      className="bg-[#0f1d13] text-white py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1a6b35]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8bc34a]/10 rounded-full blur-[120px] pointer-events-none" />

      <Container>
        {/* ── Top Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1a6b35]/60 border border-[#8bc34a]/30 text-[#8bc34a] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span>
                {language === 'bn' ? 'বাস্তব কৃষি চ্যালেঞ্জ ও সমাধান' : 'Farming Challenges & Real Solutions'}
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              {language === 'bn' ? (
                <>
                  কৃষকদের প্রতিদিনের চ্যালেঞ্জ,{' '}
                  <span className="text-[#8bc34a]">আমাদের আধুনিক সমাধান</span>
                </>
              ) : (
                <>
                  Overcome Critical Farming Challenges with{' '}
                  <span className="text-[#8bc34a]">Actionable Solutions</span>
                </>
              )}
            </h2>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-[#8bc34a] bg-white/5 hover:bg-[#8bc34a]/20 flex items-center justify-center text-white transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Previous challenge"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-sm font-display font-bold text-white/70 px-2">
              <span className="text-[#8bc34a]">{activeChallenge.number}</span> / 04
            </div>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-[#8bc34a] bg-white/5 hover:bg-[#8bc34a]/20 flex items-center justify-center text-white transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Next challenge"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Main Layout: Left Cards Stack & Right Featured Showcase ── */}
        <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ──── LEFT COLUMN: Interactive Challenge Cards (5 Cols) ──── */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {CHALLENGES.map((item, index) => {
              const isActive = index === activeIndex
              const Icon = item.icon

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(index)}
                  className={cn(
                    'group relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-500 cursor-pointer border overflow-hidden',
                    isActive
                      ? 'border-[#8bc34a] shadow-[0_12px_40px_rgba(26,107,53,0.4)] scale-[1.01]'
                      : 'border-white/10 hover:border-white/25 hover:bg-white/[0.04] opacity-85 hover:opacity-100',
                  )}
                  style={{
                    backgroundColor: isActive ? 'rgba(26, 60, 34, 0.88)' : 'rgba(18, 30, 20, 0.7)',
                  }}
                >
                  {/* Subtle Background Photo with Gradient Mask (Matching Reference Design) */}
                  <div
                    className={cn(
                      'absolute inset-0 bg-cover bg-center transition-opacity duration-700 pointer-events-none',
                      isActive ? 'opacity-20 scale-105' : 'opacity-10 group-hover:opacity-15',
                    )}
                    style={{ backgroundImage: `url(${item.cardBg})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0f1d13]/90 via-[#0f1d13]/80 to-transparent pointer-events-none" />

                  {/* Content Container */}
                  <div className="relative z-10 flex flex-col gap-3">
                    {/* Header Row: Dot Indicator, Icon & Title */}
                    <div className="flex items-start gap-3">
                      {/* Dot indicator (matching reference screenshot) */}
                      <span
                        className={cn(
                          'w-2.5 h-2.5 rounded-full mt-2 transition-all duration-300 flex-shrink-0',
                          isActive
                            ? 'bg-[#8bc34a] shadow-[0_0_10px_#8bc34a] ring-4 ring-[#8bc34a]/30'
                            : 'bg-white/40 group-hover:bg-white/80',
                        )}
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cn(
                              'p-1.5 rounded-lg transition-colors',
                              isActive ? 'bg-[#8bc34a]/20 text-[#8bc34a]' : 'bg-white/10 text-white/70',
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="text-xs uppercase tracking-wider font-semibold text-white/50">
                            Challenge {item.number}
                          </span>
                        </div>

                        {/* Title: Bold with yellow/gold or green highlight when active (matching screenshot) */}
                        <h3
                          className={cn(
                            'font-display font-bold text-lg sm:text-xl transition-colors duration-300',
                            isActive ? 'text-[#eab308] sm:text-[22px]' : 'text-white group-hover:text-white',
                          )}
                        >
                          {language === 'bn' ? item.titleBn : item.title}
                        </h3>
                      </div>
                    </div>

                    {/* Problem Description */}
                    <p className="text-sm text-white/80 pl-5.5 leading-relaxed">
                      {language === 'bn' ? item.problemBn : item.problem}
                    </p>

                    {/* Solution Callout Box */}
                    <div
                      className={cn(
                        'mt-1 pl-4 py-2.5 pr-3 rounded-xl border-l-3 transition-all duration-300',
                        isActive
                          ? 'bg-[#1a4f28]/70 border-[#8bc34a] text-white'
                          : 'bg-white/5 border-white/20 text-white/70',
                      )}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#8bc34a] uppercase tracking-wider mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8bc34a]" />
                        <span>{language === 'bn' ? 'আমাদের সমাধান' : 'Our Solution'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-white/90 leading-snug">
                        {language === 'bn' ? item.solutionBn : item.solution}
                      </p>
                    </div>

                    {/* Tags & Action Button Row (Matching Reference Pills & Button) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pl-5.5">
                      {/* Pill Badges (Matching screenshot's "Bulk Supply", "Maize Production" pills) */}
                      <div className="flex flex-wrap gap-1.5">
                        {(language === 'bn' ? item.tagsBn : item.tags).map((tag) => (
                          <span
                            key={tag}
                            className={cn(
                              'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                              isActive
                                ? 'bg-white/15 border-white/30 text-white'
                                : 'bg-black/20 border-white/10 text-white/60',
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Every card will be button which is link solution page */}
                      <Link
                        to={`/solutions#${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300',
                          isActive
                            ? 'bg-[#8bc34a] text-[#0d2814] shadow-md hover:bg-[#9ccc65] hover:scale-105'
                            : 'bg-white/10 text-white/90 hover:bg-white/20 hover:text-white',
                        )}
                      >
                        <span>{language === 'bn' ? 'সমাধান দেখুন' : 'Explore Solution'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ──── RIGHT COLUMN: Reference Design Featured Showcase (7 Cols) ──── */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 w-full min-h-[500px] lg:min-h-[640px] rounded-[2.5rem] overflow-hidden border-2 border-white/15 shadow-2xl bg-[#142316] group">
              
              {/* Dynamic Images with Smooth Crossfade Animation */}
              {CHALLENGES.map((item, index) => {
                const isCurrent = index === activeIndex
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'absolute inset-0 transition-all duration-700 ease-in-out',
                      isCurrent
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-105 z-0 pointer-events-none',
                    )}
                  >
                    <img
                      src={item.showcaseImage}
                      alt={item.showcaseAlt}
                      className="w-full h-full object-cover object-center"
                      loading="eager"
                    />
                    {/* Multi-layer cinematic overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                  </div>
                )
              })}

              {/* ── Top-Right Inverted Tab with Number (01, 02, 03, 04) - EXACTLY MATCHING USER SCREENSHOT ── */}
              <div className="absolute top-0 right-0 z-30">
                <div className="bg-[#0f1d13] text-[#8bc34a] px-8 sm:px-10 py-4 sm:py-5 rounded-bl-[2rem] border-l-2 border-b-2 border-white/15 flex items-center justify-center shadow-xl">
                  <span className="font-display font-light text-3xl sm:text-4xl md:text-5xl tracking-widest text-[#8bc34a] select-none">
                    {activeChallenge.number}
                  </span>
                </div>
              </div>

              {/* ── Bottom Overlay Card: Active Challenge Info & Action ── */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a6b35]/80 backdrop-blur-md text-[#8bc34a] text-xs font-bold uppercase tracking-wider mb-3 border border-[#8bc34a]/30">
                      <activeChallenge.icon className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? activeChallenge.titleBn : activeChallenge.title}</span>
                    </div>

                    <h4 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-white mb-2 leading-snug">
                      {language === 'bn' ? activeChallenge.solutionBn : activeChallenge.solution}
                    </h4>

                    <p className="text-white/70 text-sm line-clamp-2">
                      {language === 'bn' ? activeChallenge.problemBn : activeChallenge.problem}
                    </p>
                  </div>

                  {/* Primary CTA linking to Solution Page */}
                  <Link
                    to={`/solutions#${activeChallenge.id}`}
                    className="flex-shrink-0 inline-flex items-center gap-2 bg-[#8bc34a] hover:bg-[#9ccc65] text-[#0d2814] font-display font-bold px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 text-sm whitespace-nowrap"
                  >
                    <span>{language === 'bn' ? 'সম্পূর্ণ সমাধান দেখুন' : 'Explore Detailed Solution'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Progress bar line */}
                <div className="mt-6 w-full h-1 bg-white/20 rounded-full overflow-hidden flex">
                  {CHALLENGES.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelect(i)}
                      className="flex-1 h-full cursor-pointer transition-colors relative"
                    >
                      <div
                        className={cn(
                          'h-full transition-all duration-500',
                          i === activeIndex
                            ? 'bg-[#8bc34a] w-full'
                            : i < activeIndex
                              ? 'bg-white/60 w-full'
                              : 'bg-transparent w-0',
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </Section>
  )
}
