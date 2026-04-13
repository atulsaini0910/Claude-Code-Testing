import { Instagram, Facebook, Phone, MapPin } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactForm } from './ContactForm';
import { RESTAURANT } from '@/lib/constants';

interface ContactSectionProps {
  id: string;
}

export function ContactSection({ id }: ContactSectionProps) {
  return (
    <section id={id} className="py-20 md:py-28 px-4 md:px-8 bg-dark-2">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <SectionHeader
            title="Get in Touch"
            subtitle="Have a question, suggestion, or just want to say hello? We'd love to hear from you."
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: contact info */}
          <AnimatedSection direction="left">
            <div className="flex flex-col gap-8">
              <div>
                <h3
                  className="text-xl font-bold text-cream mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Say Hello
                </h3>
                <p className="text-cream/60 text-sm leading-relaxed">
                  Whether you have feedback about your meal, questions about
                  catering, or need help with a reservation — our team is here
                  to help. We respond within 24 hours.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href={RESTAURANT.phoneHref}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-saffron-500/15 flex items-center justify-center group-hover:bg-saffron-500/25 transition-colors">
                    <Phone size={16} className="text-saffron-400" />
                  </div>
                  <div>
                    <p className="text-xs text-cream/40 uppercase tracking-wider">Call Us</p>
                    <p className="text-cream text-sm font-semibold group-hover:text-saffron-400 transition-colors">
                      {RESTAURANT.phone}
                    </p>
                  </div>
                </a>

                <a
                  href={RESTAURANT.address.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-saffron-500/15 flex items-center justify-center group-hover:bg-saffron-500/25 transition-colors">
                    <MapPin size={16} className="text-saffron-400" />
                  </div>
                  <div>
                    <p className="text-xs text-cream/40 uppercase tracking-wider">Visit Us</p>
                    <p className="text-cream text-sm font-semibold group-hover:text-saffron-400 transition-colors">
                      {RESTAURANT.address.full}
                    </p>
                  </div>
                </a>
              </div>

              <div>
                <p className="text-xs text-cream/40 uppercase tracking-wider mb-3">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  <a
                    href={RESTAURANT.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark border border-white/10 hover:border-saffron-500/40 text-cream/60 hover:text-cream transition-colors text-sm"
                  >
                    <Instagram size={15} />
                    {RESTAURANT.social.instagramHandle}
                  </a>
                  <a
                    href={RESTAURANT.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark border border-white/10 hover:border-saffron-500/40 text-cream/60 hover:text-cream transition-colors text-sm"
                  >
                    <Facebook size={15} />
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right: form */}
          <AnimatedSection direction="right" delay={0.15}>
            <div className="bg-dark border border-white/10 rounded-2xl p-6 md:p-8">
              <ContactForm />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
