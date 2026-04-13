import { useRef } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CateringPackageCard } from './CateringPackageCard';
import { CateringInquiryForm } from './CateringInquiryForm';
import { CATERING_PACKAGES } from '@/data/cateringPackages';

interface CateringSectionProps {
  id: string;
}

export function CateringSection({ id }: CateringSectionProps) {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id={id} className="py-20 md:py-28 px-4 md:px-8 bg-dark-2">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <SectionHeader
            title="Catering Services"
            subtitle="From intimate office lunches to grand weddings — we bring authentic Indian flavours to your event with live cooking stations and professional service."
          />
        </AnimatedSection>

        {/* Package cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {CATERING_PACKAGES.map((pkg, i) => (
            <AnimatedSection key={pkg.id} delay={i * 0.1}>
              <CateringPackageCard pkg={pkg} onSelect={scrollToForm} />
            </AnimatedSection>
          ))}
        </div>

        {/* Inquiry form */}
        <AnimatedSection>
          <div ref={formRef} className="bg-dark border border-white/10 rounded-2xl p-6 md:p-10 max-w-3xl mx-auto">
            <h3
              className="text-2xl font-bold text-cream mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Request a Catering Quote
            </h3>
            <p className="text-cream/50 text-sm mb-8">
              Fill in the details below and we'll get back to you within 24 hours with a personalised quote.
            </p>
            <CateringInquiryForm />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
