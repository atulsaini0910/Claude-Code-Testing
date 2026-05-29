import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { LogoCloud } from './LogoCloud';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { Stats } from './Stats';
import { Testimonials } from './Testimonials';
import { Pricing } from './Pricing';
import { FAQ } from './FAQ';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-white antialiased">
      <Navbar />
      <main>
        <Hero />
        <LogoCloud />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
