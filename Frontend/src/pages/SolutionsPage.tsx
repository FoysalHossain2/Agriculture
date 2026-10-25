import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  Bug,
  Sprout,
  CloudRain,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  Calendar,
  Sparkles,
  Leaf,
  Layers,
  HelpCircle,
} from 'lucide-react'
import { Container, Section, SectionLabel } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector, openConsultationModal } from '@/store'

interface SolutionDetail {
  id: string
  title: string
  titleBn: string
  challenge: string
  challengeBn: string
  summary: string
  summaryBn: string
  icon: typeof Bug
  tag: string
  image: string
  deliverables: { en: string; bn: string }[]
  metrics: { value: string; label: string; labelBn: string }[]
}

const SOLUTIONS_DATA: SolutionDetail[] = [
  {
    id: 'crop-diseases',
    title: 'Precision Crop Protection & Early Pest Defense',
    titleBn: 'ফসল সুরক্ষা ও প্রাথমিক বালাইনাশক প্রতিরক্ষা',
    challenge: 'Crop Diseases & Pest Attacks',
    challengeBn: 'ফসলের রোগ ও পোকার আক্রমণ',
    summary:
      'We combine drone hyperspectral imaging, AI computer vision disease diagnosis, and targeted biological pest control to stop infestations before they impact yield.',
    summaryBn:
      'ড্রোন স্পেকট্রাল ইমেজিং এবং এআই রোগ নির্ণয়ের মাধ্যমে ক্ষতিকারক পোকা ও রোগ দ্রুত শনাক্ত করে সুনির্দিষ্ট সুরক্ষা ব্যবস্থা গ্রহণ করা হয়।',
    icon: Bug,
    tag: 'Disease Management',
    image:
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&q=80&fit=crop',
    deliverables: [
      {
        en: 'Automated smartphone camera leaf disease diagnosis with instant cure advisory',
        bn: 'স্মার্টফোন ক্যামেরার মাধ্যমে তাৎক্ষণিক পাতার রোগ নির্ণয় ও প্রতিকারের পরামর্শ',
      },
      {
        en: 'Drone-assisted field scouting map showing infection hotspots in real-time',
        bn: 'ড্রোন ভিত্তিক ফিল্ড স্কাউটিং ম্যাপের মাধ্যমে আক্রান্ত এলাকা রিয়েল-টাইমে প্রদর্শন',
      },
      {
        en: 'Biological pest management protocols that minimize chemical residues by 65%',
        bn: 'জৈব বালাইনাশক ব্যবস্থাপনার মাধ্যমে রাসায়নিক কীটনাশকের ব্যবহার ৬৫% হ্রাস',
      },
      {
        en: 'Weather-correlated fungal spore outbreak alerts 48 hours in advance',
        bn: 'আবহাওয়ার পূর্বাভাসের ভিত্তিতে ছত্রাকজনিত আক্রমণের ৪৮ ঘণ্টা আগে সতর্কবার্তা',
      },
    ],
    metrics: [
      { value: '94%', label: 'Early Detection Accuracy', labelBn: 'শনাক্তকরণের নির্ভুলতা' },
      { value: '38%', label: 'Pesticide Cost Reduction', labelBn: 'কীটনাশক খরচ সাশ্রয়' },
      { value: '+22%', label: 'Average Quality Grade Lift', labelBn: 'ফসলের গুণগত মান বৃদ্ধি' },
    ],
  },
  {
    id: 'soil-health',
    title: 'Scientific Soil Testing & Customized Nutrient Management',
    titleBn: 'বিজ্ঞানসম্মত মাটি পরীক্ষা ও সুষম পুষ্টি ব্যবস্থাপনা',
    challenge: 'Poor Soil Health & Low Yield',
    challengeBn: 'অনুর্বর মাটি ও কম ফলন',
    summary:
      'Turn nutrient-depleted fields into powerhouse soils with precision N-P-K testing, micro-nutrient mapping, and organic matter enrichment plans.',
    summaryBn:
      'নাইট্রোজেন, ফসফরাস ও পটাশিয়ামের সুনির্দিষ্ট পরীক্ষা এবং মাটির অণুজীব বৃদ্ধিপূর্বক মাটির উর্বরতা ও ফলন বহুগুণ বৃদ্ধি।',
    icon: Sprout,
    tag: 'Soil Vitality',
    image:
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=80&fit=crop',
    deliverables: [
      {
        en: 'Comprehensive 14-parameter soil laboratory analysis with digital fertility scorecard',
        bn: '১৪টি সূচকে বিস্তারিত মৃত্তিকা ল্যাব পরীক্ষা এবং ডিজিটাল ফার্টিলিটি স্কোরকার্ড',
      },
      {
        en: 'Customized seasonal fertilizer prescription tailored to your target crop and soil pH',
        bn: 'আপনার নির্দিষ্ট ফসল ও মাটির পিএইচ অনুযায়ী পরিমিত সার প্রয়োগের ব্যবস্থাপত্র',
      },
      {
        en: 'Cover cropping & regenerative organic compost formulation guide',
        bn: 'সবুজ সার ও জৈব কম্পোস্ট তৈরির বিস্তারিত প্রণালী ও প্রয়োগ কৌশল',
      },
      {
        en: 'Soil microbiome regeneration tracking across consecutive growing cycles',
        bn: 'পরপর প্রতিটি ফসলি মৌসুমে মাটির উপকারী ব্যাকটেরিয়া ও উর্বরতা পর্যবেক্ষণ',
      },
    ],
    metrics: [
      { value: '+30%', label: 'Crop Yield Increase', labelBn: 'ফসল উৎপাদন বৃদ্ধি' },
      { value: '45%', label: 'Fertilizer Waste Cut', labelBn: 'সারের অপচয় রোধ' },
      { value: '100%', label: 'Custom Tailored Plans', labelBn: 'ব্যক্তিগতকৃত পুষ্টি নির্দেশিকা' },
    ],
  },
  {
    id: 'water-scarcity',
    title: 'Smart Drip Irrigation & Weather-Aware Water Conservation',
    titleBn: 'স্মার্ট সেচ ব্যবস্থাপনা ও পানি সংরক্ষণ কৌশল',
    challenge: 'Water Scarcity & Unpredictable Weather',
    challengeBn: 'পানির সংকট ও অনির্ভরযোগ্য আবহাওয়া',
    summary:
      'Optimize every drop with soil moisture IoT sensors, localized micro-weather forecasts, and automated solar drip irrigation scheduling.',
    summaryBn:
      'আইওটি আর্দ্রতা সেন্সর ও স্থানীয় আবহাওয়ার তথ্যের ভিত্তিতে স্বয়ংক্রিয় স্মার্ট সেচ প্রদান যা পানির অপচয় সর্বনিম্ন রাখে।',
    icon: CloudRain,
    tag: 'Water Optimization',
    image:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&q=80&fit=crop',
    deliverables: [
      {
        en: 'IoT soil moisture depth probes providing live soil hydration levels to your phone',
        bn: 'আইওটি ভিত্তিক মাটির আর্দ্রতা সেন্সর যা মোবাইলে নিয়মিত আর্দ্রতা মাত্রা পাঠায়',
      },
      {
        en: 'Hyperlocal 7-day microclimate rain prediction synced with automated valves',
        bn: 'অতি-স্থানীয় ৭ দিনের বৃষ্টিপাতের পূর্বাভাসের সাথে স্বয়ংক্রিয় সেচ ভালভ সংযোগ',
      },
      {
        en: 'Subsurface drip irrigation architecture tailored for drought-resistant farming',
        bn: 'খরা-প্রতিরোধী ফসলের জন্য আধুনিক ভূগর্ভস্থ ড্রিপ সেচ কাঠামোর নকশা',
      },
      {
        en: 'Farm pond rainwater catchment engineering and seasonal water budgeting',
        bn: 'বৃষ্টির পানি সংরক্ষণে খামার পুকুর খনন ও পানি ব্যবহারের সুষম বাজেট',
      },
    ],
    metrics: [
      { value: '55%', label: 'Water Consumption Saved', labelBn: 'পানি সাশ্রয়' },
      { value: '40%', label: 'Energy Cost Savings', labelBn: 'সেচের জ্বালানি খরচ হ্রাস' },
      { value: '24/7', label: 'Automated Soil Monitoring', labelBn: 'সার্বক্ষণিক মনিটরিং' },
    ],
  },
  {
    id: 'rising-costs',
    title: 'Input Cost Optimization & Farm Profitability Planning',
    titleBn: 'উৎপাদন ব্যয় সাশ্রয় ও মুনাফা বৃদ্ধি পরিকল্পনা',
    challenge: 'Rising Input Costs & Uncertain Profits',
    challengeBn: 'উচ্চ উৎপাদন খরচ ও অনিশ্চিত মুনাফা',
    summary:
      'Take control of farm finances with bulk procurement coordination, precision input dosage, labor tracking, and guaranteed wholesale market linkages.',
    summaryBn:
      'উপকরণ ক্রয়ে সাশ্রয়, সঠিক ডোজ প্রয়োগ এবং সরাসরি পাইকারি বাজার সংযোগের মাধ্যমে কৃষকের নিট মুনাফা নিশ্চিতকরণ।',
    icon: DollarSign,
    tag: 'Financial ROI',
    image:
      'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1200&q=80&fit=crop',
    deliverables: [
      {
        en: 'End-to-end crop expense calculator with break-even forecasting before planting',
        bn: 'চাষের আগেই প্রতি একরে সামগ্রিক খরচ ও সম্ভাব্য মুনাফা হিসাবের ক্যালকুলেটর',
      },
      {
        en: 'Collective cooperative input purchasing to secure wholesale bulk pricing on certified seeds',
        bn: 'কৃষক দলের মাধ্যমে সরাসরি পাইকারি মূল্যে উন্নত মানের বীজ ও সার ক্রয়ের সুযোগ',
      },
      {
        en: 'Farm machinery sharing schedules that eliminate idle equipment capital expenditure',
        bn: 'যৌথ যন্ত্রপাতি ব্যবহার সূচি যার ফলে অতিরিক্ত মূলধনী ব্যয় বাঁচানো সম্ভব হয়',
      },
      {
        en: 'Direct-to-buyer transparent contract pricing protecting against harvest season market dumps',
        bn: 'মধ্যস্বত্বভোগী ছাড়াই সরাসরি পাইকারি ও করপোরেট ক্রেতার কাছে ন্যায্যমূল্যে বিক্রয়',
      },
    ],
    metrics: [
      { value: '+35%', label: 'Net Profit Margin Boost', labelBn: 'নিট মুনাফা বৃদ্ধি' },
      { value: '25%', label: 'Input Cost Savings', labelBn: 'উপকরণ ব্যয় হ্রাস' },
      { value: '100%', label: 'Transparent Market Access', labelBn: 'স্বচ্ছ বাজার প্রবেশাধিকার' },
    ],
  },
]

export function SolutionsPage() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const language = useAppSelector((s) => s.ui.language) || 'en'
  const [selectedSolution, setSelectedSolution] = useState(SOLUTIONS_DATA[0].id)

  // Scroll to hash if provided (e.g., #crop-diseases)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const found = SOLUTIONS_DATA.find((s) => s.id === id)
      if (found) {
        setSelectedSolution(found.id)
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.hash])

  return (
    <div className="pt-24 pb-28 bg-[#f5f7f0]">
      {/* ── Hero Banner ── */}
      <section className="bg-gradient-to-b from-[#0f1d13] to-[#173d24] text-white py-20 relative overflow-hidden">
        <Container>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[#8bc34a]/20 border border-[#8bc34a]/30 text-[#8bc34a] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span>
                {language === 'bn'
                  ? 'কৃষকদের জন্য পূর্ণাঙ্গ সমাধান'
                  : 'Comprehensive Agricultural Solutions'}
              </span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
              {language === 'bn' ? (
                <>
                  কৃষি সমস্যার স্থায়ী সমাধান,{' '}
                  <span className="text-[#8bc34a]">সর্বোচ্চ ফলন ও মুনাফা</span>
                </>
              ) : (
                <>
                  Actionable Technology and Advisory for{' '}
                  <span className="text-[#8bc34a]">Every Farm Challenge</span>
                </>
              )}
            </h1>
            <p className="text-white/80 text-lg sm:text-xl mt-6 leading-relaxed max-w-2xl">
              {language === 'bn'
                ? 'ফসলের রোগ নিয়ন্ত্রণ, মাটির সুষম পুষ্টি, স্মার্ট সেচ এবং উৎপাদন ব্যয় সাশ্রয়ে আমাদের প্রমাণিত সমাধান আপনার খামারকে করবে আরও লাভজনক।'
                : 'Explore our modular suite of solutions designed to address crop diseases, poor soil health, water shortages, and rising costs.'}
            </p>
          </div>
        </Container>
      </section>

      {/* ── Main Solution Deep Dives ── */}
      <Container className="mt-16">
        <div className="flex flex-col gap-20">
          {SOLUTIONS_DATA.map((solution, idx) => {
            const Icon = solution.icon
            const isReversed = idx % 2 === 1

            return (
              <article
                key={solution.id}
                id={solution.id}
                className="scroll-mt-28 bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#d9e3d9] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                    isReversed ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Text Details (7 cols) */}
                  <div className={`lg:col-span-7 ${isReversed ? 'lg:col-start-6' : ''}`}>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#1a6b35]/10 text-[#1a6b35] text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full mb-4">
                      <Icon className="w-4 h-4" />
                      <span>{solution.tag}</span>
                    </div>

                    <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#1e2d1e] tracking-tight leading-tight">
                      {language === 'bn' ? solution.titleBn : solution.title}
                    </h2>

                    {/* Challenge tag */}
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#eab308] bg-[#fefce8] border border-[#fef08a] px-3 py-1.5 rounded-lg w-fit">
                      <span className="font-bold text-[#854d0e]">
                        {language === 'bn' ? 'সমাধানকৃত চ্যালেঞ্জ:' : 'Resolves Challenge:'}
                      </span>
                      <span className="text-[#a16207]">
                        {language === 'bn' ? solution.challengeBn : solution.challenge}
                      </span>
                    </div>

                    <p className="mt-4 text-[#5a6b5a] text-base sm:text-lg leading-relaxed">
                      {language === 'bn' ? solution.summaryBn : solution.summary}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="mt-6 flex flex-col gap-3">
                      <h3 className="font-display font-bold text-base text-[#1e2d1e]">
                        {language === 'bn' ? 'কী কী অন্তর্ভুক্ত রয়েছে:' : 'Key Deliverables & Action Plan:'}
                      </h3>
                      {solution.deliverables.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#1a6b35] flex-shrink-0 mt-0.5" />
                          <span className="text-sm sm:text-base text-[#374151]">
                            {language === 'bn' ? item.bn : item.en}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#e5ece5]">
                      {solution.metrics.map((m, i) => (
                        <div key={i}>
                          <div className="font-display font-black text-2xl sm:text-3xl text-[#1a6b35]">
                            {m.value}
                          </div>
                          <div className="text-xs sm:text-sm text-[#6b7c6b] font-medium mt-0.5">
                            {language === 'bn' ? m.labelBn : m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Button
                        size="md"
                        variant="default"
                        onClick={() => dispatch(openConsultationModal())}
                        className="flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {language === 'bn'
                            ? 'এই সমাধানের জন্য পরামর্শ নিন'
                            : 'Request Consultation for this Solution'}
                        </span>
                      </Button>
                      <Link
                        to="/#challenges"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a6b35] hover:underline"
                      >
                        <span>{language === 'bn' ? 'সব চ্যালেঞ্জ দেখুন' : 'View in Challenges'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Visual Image Showcase (5 cols) */}
                  <div className={`lg:col-span-5 ${isReversed ? 'lg:col-start-1' : ''}`}>
                    <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 sm:aspect-square group border border-[#d8e3d8]">
                      <img
                        src={solution.image}
                        alt={solution.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <span className="inline-block bg-[#8bc34a] text-[#0d2814] text-xs font-bold px-3 py-1 rounded-full mb-2">
                          AgFarm Certified
                        </span>
                        <p className="font-display font-bold text-lg sm:text-xl">
                          {language === 'bn' ? solution.titleBn : solution.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </div>
  )
}
