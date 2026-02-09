import { HeroSection } from './components/HeroSection';
import { ProblemStatement } from './components/ProblemStatement';
import { SolutionOverview } from './components/SolutionOverview';
import { InteractiveDemo } from './components/InteractiveDemo';
import { FeaturesGrid } from './components/FeaturesGrid';
import { TechnicalArchitecture } from './components/TechnicalArchitecture';
import { UseCases } from './components/UseCases';
import { CompetitiveAdvantage } from './components/CompetitiveAdvantage';
import { TechnologyStack } from './components/TechnologyStack';
import { PricingSection } from './components/PricingSection';
import { DemoRequestForm } from './components/DemoRequestForm';
import { Footer } from './components/Footer';

/**
 * Marketing Landing Page
 * Main entry point for public-facing marketing site
 * 
 * Sections (in order):
 * 1. Hero - Main value proposition and CTA
 * 2. Problem Statement - Pain points we solve
 * 3. Solution Overview - How we solve them
 * 4. Interactive Demo - Live audio demo
 * 5. Features Grid - 7 key features
 * 6. Technical Architecture - System overview
 * 7. Use Cases - Real-world scenarios
 * 8. Competitive Advantage - Comparison table
 * 9. Technology Stack - Tech logos
 * 10. Pricing - Pricing tiers
 * 11. Demo Request Form - Lead generation
 * 12. Footer - Links and legal
 * 
 * TODO: Integrate user's custom skeuomorphic design
 * TODO: Add scroll animations (Framer Motion)
 * TODO: Add analytics tracking
 */
export default function MarketingPage() {
    return (
        <main className="marketing-page">
            <HeroSection />
            <ProblemStatement />
            <SolutionOverview />
            <InteractiveDemo />
            <FeaturesGrid />
            <TechnicalArchitecture />
            <UseCases />
            <CompetitiveAdvantage />
            <TechnologyStack />
            <PricingSection />
            <DemoRequestForm />
            <Footer />
        </main>
    );
}
