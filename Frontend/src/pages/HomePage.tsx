import { HeroSection } from '@/components/sections/HeroSection'
import { FarmingChallengesSection } from '@/components/sections/FarmingChallengesSection'


export function HomePage() {
  return (
    <>
      {/* 01 — Hero & primary CTA */}
      <HeroSection />

      {/* 02 — Farming challenges */}
      <FarmingChallengesSection />


    </>
  )
}
