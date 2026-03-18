import HeroSection from '../../components/landing/HeroSection'
import FourthAgeSection from '../../components/landing/FourthAgeSection'
import TiersSection from '../../components/landing/TiersSection'
import HowItWorksSection from '../../components/landing/HowItWorksSection'
import AgentTeamSection from '../../components/landing/AgentTeamSection'
import ParentTrustSection from '../../components/landing/ParentTrustSection'
import AssessmentCTA from '../../components/landing/AssessmentCTA'
import PricingTeaser from '../../components/landing/PricingTeaser'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FourthAgeSection />
      <TiersSection />
      <HowItWorksSection />
      <AgentTeamSection />
      <ParentTrustSection />
      <AssessmentCTA />
      <PricingTeaser />
    </main>
  )
}
