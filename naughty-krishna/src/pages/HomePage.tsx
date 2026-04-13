import { HeroSection } from '@/components/hero/HeroSection';
import { MenuSection } from '@/components/menu/MenuSection';
import { ReservationSection } from '@/components/reservation/ReservationSection';
import { CateringSection } from '@/components/catering/CateringSection';
import { GallerySection } from '@/components/gallery/GallerySection';
import { TestimonialsSection } from '@/components/testimonials/TestimonialsSection';
import { LocationSection } from '@/components/location/LocationSection';
import { ContactSection } from '@/components/contact/ContactSection';

export function HomePage() {
  return (
    <>
      <HeroSection id="home" />
      <MenuSection id="menu" />
      <ReservationSection id="reservations" />
      <CateringSection id="catering" />
      <GallerySection id="gallery" />
      <TestimonialsSection id="testimonials" />
      <LocationSection id="location" />
      <ContactSection id="contact" />
    </>
  );
}
