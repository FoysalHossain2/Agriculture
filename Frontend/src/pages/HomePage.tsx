import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { FarmingChallengesSection } from '@/components/sections/FarmingChallengesSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FarmingChallengesSection />
    </>
  )
}
