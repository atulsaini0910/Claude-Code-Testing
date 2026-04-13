import { useState } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GalleryGrid } from './GalleryGrid';
import { LightboxModal } from './LightboxModal';
import type { GalleryImage } from '@/types';

const GALLERY_IMAGES: GalleryImage[] = [
  { id: 'g1', src: 'https://picsum.photos/seed/gallery1/600/800', alt: 'Samosa Chaat', caption: 'Samosa Chaat' },
  { id: 'g2', src: 'https://picsum.photos/seed/gallery2/600/400', alt: 'Kullad Pizza', caption: 'Kullad Pizza' },
  { id: 'g3', src: 'https://picsum.photos/seed/gallery3/600/700', alt: 'Chole Bhature', caption: 'Chole Bhature' },
  { id: 'g4', src: 'https://picsum.photos/seed/gallery4/600/500', alt: 'Paneer Momos', caption: 'Paneer Momos' },
  { id: 'g5', src: 'https://picsum.photos/seed/gallery5/600/400', alt: 'Pao Bhaji', caption: 'Pao Bhaji' },
  { id: 'g6', src: 'https://picsum.photos/seed/gallery6/600/600', alt: 'Malai Kofta', caption: 'Malai Kofta' },
  { id: 'g7', src: 'https://picsum.photos/seed/gallery7/600/800', alt: 'Veg Noodle Burger', caption: 'Veg Noodle Burger' },
  { id: 'g8', src: 'https://picsum.photos/seed/gallery8/600/450', alt: 'Aloo Tikki Chaat', caption: 'Aloo Tikki Chaat' },
  { id: 'g9', src: 'https://picsum.photos/seed/gallery9/600/500', alt: 'Gourmet Cake', caption: 'Gourmet Cake' },
  { id: 'g10', src: 'https://picsum.photos/seed/gallery10/600/700', alt: 'Paneer Kaathi Roll', caption: 'Paneer Kaathi Roll' },
  { id: 'g11', src: 'https://picsum.photos/seed/gallery11/600/400', alt: 'Restaurant Ambience', caption: 'Our Space' },
  { id: 'g12', src: 'https://picsum.photos/seed/gallery12/600/600', alt: 'Live Catering', caption: 'Live Catering Setup' },
];

interface GallerySectionProps {
  id: string;
}

export function GallerySection({ id }: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % GALLERY_IMAGES.length);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (lightboxIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length,
    );
  };

  return (
    <section id={id} className="py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <SectionHeader
            title="Gallery"
            subtitle="A visual feast — from our vibrant dishes to our warm dining space and live catering events."
          />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <GalleryGrid
            images={GALLERY_IMAGES}
            onImageClick={setLightboxIndex}
          />
        </AnimatedSection>
      </div>

      {lightboxIndex !== null && (
        <LightboxModal
          images={GALLERY_IMAGES}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </section>
  );
}
