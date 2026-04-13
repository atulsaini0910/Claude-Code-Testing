import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { OpenStatusBadge } from './OpenStatusBadge';
import { HoursTable } from './HoursTable';
import { RESTAURANT } from '@/lib/constants';

interface LocationSectionProps {
  id: string;
}

export function LocationSection({ id }: LocationSectionProps) {
  return (
    <section id={id} className="py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <SectionHeader
            title="Find Us"
            subtitle="Located next to Westfield Blacktown — easy to reach, hard to leave."
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info panel */}
          <AnimatedSection direction="left">
            <div className="flex flex-col gap-7">
              {/* Open status */}
              <OpenStatusBadge />

              {/* Address & Contact */}
              <div className="bg-dark-2 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-saffron-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-cream font-semibold text-sm">Address</p>
                    <a
                      href={RESTAURANT.address.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream/60 text-sm hover:text-saffron-400 transition-colors flex items-center gap-1 mt-0.5"
                    >
                      {RESTAURANT.address.full}
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-saffron-400 flex-shrink-0" />
                  <div>
                    <p className="text-cream font-semibold text-sm">Phone</p>
                    <a
                      href={RESTAURANT.phoneHref}
                      className="text-cream/60 text-sm hover:text-saffron-400 transition-colors mt-0.5 block"
                    >
                      {RESTAURANT.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-saffron-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-cream font-semibold text-sm mb-3">
                      Opening Hours
                    </p>
                    <HoursTable />
                  </div>
                </div>
              </div>

              {/* Delivery links */}
              <div className="flex gap-3">
                <a
                  href={RESTAURANT.delivery.uberEats}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-dark-2 border border-white/10 hover:border-saffron-500/40 rounded-xl text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  🛵 Uber Eats
                </a>
                <a
                  href={RESTAURANT.delivery.doorDash}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-dark-2 border border-white/10 hover:border-saffron-500/40 rounded-xl text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  🛵 DoorDash
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* Map */}
          <AnimatedSection direction="right" delay={0.1}>
            <div className="rounded-2xl overflow-hidden h-full min-h-80 border border-white/10 relative">
              <iframe
                src={RESTAURANT.address.googleMapsEmbed}
                title="Naughty Krishna location on Google Maps"
                className="w-full h-full min-h-80"
                style={{ filter: 'invert(90%) hue-rotate(180deg) saturate(0.8)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
