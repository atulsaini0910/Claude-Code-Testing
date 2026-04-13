import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SpiceDecor } from '@/components/ui/SpiceDecor';
import { ReservationForm } from './ReservationForm';
import { CalendarDays, Users, Clock } from 'lucide-react';

interface ReservationSectionProps {
  id: string;
}

export function ReservationSection({ id }: ReservationSectionProps) {
  return (
    <section id={id} className="py-20 md:py-28 px-4 md:px-8 relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 0% 50%, rgba(153,27,27,0.12) 0%, transparent 70%)',
        }}
      />
      <SpiceDecor
        variant="mandala"
        className="absolute -left-24 top-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <AnimatedSection direction="left">
            <SectionHeader
              title="Reserve a Table"
              subtitle="Book your table for a memorable dining experience. We accommodate groups of all sizes — from intimate dinners to birthday celebrations."
              align="left"
            />

            <div className="flex flex-col gap-5 mt-8">
              {[
                {
                  icon: CalendarDays,
                  title: 'Open Daily',
                  desc: 'Monday through Sunday, 10:00 AM to 10:00 PM',
                },
                {
                  icon: Users,
                  title: 'Groups Welcome',
                  desc: 'We cater for groups up to 20 people. Larger groups? Contact us directly.',
                },
                {
                  icon: Clock,
                  title: 'Quick Confirmation',
                  desc: "We'll confirm your reservation within 1 hour via phone or email.",
                },
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-saffron-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <feature.icon size={18} className="text-saffron-400" />
                  </div>
                  <div>
                    <p className="text-cream font-semibold text-sm">{feature.title}</p>
                    <p className="text-cream/50 text-sm mt-0.5">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative image placeholder */}
            <div className="mt-10 rounded-2xl overflow-hidden h-48 relative">
              <img
                src="https://picsum.photos/seed/restaurantinterior/800/400"
                alt="Naughty Krishna restaurant dining area"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-xs text-saffron-400 font-semibold uppercase tracking-widest">
                  Dine With Us
                </span>
                <p className="text-cream font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                  16 Westfield Place
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Right — Form */}
          <AnimatedSection direction="right" delay={0.15}>
            <div className="bg-dark-2 border border-white/10 rounded-2xl p-6 md:p-8">
              <ReservationForm />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
