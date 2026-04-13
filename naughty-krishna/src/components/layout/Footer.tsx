import { Instagram, Facebook, MapPin, Phone, Clock, Flame } from 'lucide-react';
import { RESTAURANT } from '@/lib/constants';
import { scrollToSection } from '@/lib/utils';

const footerLinks = [
  { label: 'Menu', href: 'menu' },
  { label: 'Reservations', href: 'reservations' },
  { label: 'Catering', href: 'catering' },
  { label: 'Gallery', href: 'gallery' },
  { label: 'Contact', href: 'contact' },
];

export function Footer() {
  return (
    <footer className="bg-dark-2 border-t border-saffron-500/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-saffron-500 flex items-center justify-center">
                <Flame size={20} className="text-white" />
              </div>
              <div>
                <p
                  className="text-xl font-bold text-cream"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Naughty Krishna
                </p>
                <p className="text-xs text-saffron-400 tracking-wider uppercase">
                  Pure Vegetarian
                </p>
              </div>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
              Blacktown's destination for authentic and innovative 100% pure
              vegetarian Indian cuisine. Made with love, served with pride.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={RESTAURANT.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-cream/60 hover:text-saffron-400 hover:border-saffron-400 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={RESTAURANT.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-cream/60 hover:text-saffron-400 hover:border-saffron-400 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-cream font-semibold mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-cream/60 hover:text-saffron-400 text-sm transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2">
              <p className="text-cream/40 text-xs uppercase tracking-wider mb-1">
                Order Delivery
              </p>
              <a
                href={RESTAURANT.delivery.uberEats}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cream/60 hover:text-saffron-400 transition-colors"
              >
                🛵 Uber Eats
              </a>
              <a
                href={RESTAURANT.delivery.doorDash}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cream/60 hover:text-saffron-400 transition-colors"
              >
                🛵 DoorDash
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-cream font-semibold mb-5 text-sm uppercase tracking-wider">
              Find Us
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-saffron-400 mt-0.5 shrink-0" />
                <a
                  href={RESTAURANT.address.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/60 text-sm hover:text-cream transition-colors"
                >
                  {RESTAURANT.address.full}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-saffron-400 shrink-0" />
                <a
                  href={RESTAURANT.phoneHref}
                  className="text-cream/60 text-sm hover:text-cream transition-colors"
                >
                  {RESTAURANT.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-saffron-400 shrink-0" />
                <span className="text-cream/60 text-sm">
                  {RESTAURANT.hours.days} · {RESTAURANT.hours.display}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/40">
          <p>
            © {new Date().getFullYear()} Naughty Krishna Vegetarian Restaurant.
            All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="text-green-400">🌿</span> 100% Pure Vegetarian
            </span>
            <span>Made with ❤️ in Blacktown, NSW</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
