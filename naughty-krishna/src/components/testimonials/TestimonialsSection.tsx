import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TestimonialCarousel } from './TestimonialCarousel';

interface TestimonialsSectionProps {
  id: string;
}

export function TestimonialsSection({ id }: TestimonialsSectionProps) {
  return (
    <section id={id} className="py-20 md:py-28 px-4 md:px-8 bg-dark-2">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <SectionHeader
            title="What People Say"
            subtitle="Hear from our customers across Blacktown, Parramatta, and greater Western Sydney."
          />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <TestimonialCarousel />
        </AnimatedSection>

        {/* Rating summary */}
        <AnimatedSection delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-14 pt-10 border-t border-white/10">
            {[
              { platform: '🌐 Google', rating: '4.9', reviews: '120+' },
              { platform: '📘 Facebook', rating: '5.0', reviews: '85+' },
              { platform: '🛵 Uber Eats', rating: '4.8', reviews: '200+' },
            ].map((r) => (
              <div key={r.platform} className="text-center">
                <p className="text-cream/50 text-sm mb-1">{r.platform}</p>
                <p
                  className="text-3xl font-black text-gradient"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {r.rating}★
                </p>
                <p className="text-cream/40 text-xs">{r.reviews} reviews</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
