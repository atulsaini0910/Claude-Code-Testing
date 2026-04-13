import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { TESTIMONIALS } from '@/data/testimonials';

const SOURCE_LABELS: Record<string, string> = {
  google: '🌐 Google',
  facebook: '📘 Facebook',
  ubereats: '🛵 Uber Eats',
  direct: '⭐ Direct',
};

export function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 5000, stopOnInteraction: true })],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="embla__slide px-2">
              <div className="bg-dark-2 border border-white/10 rounded-2xl p-6 h-full flex flex-col gap-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < t.rating ? 'text-gold-500 fill-gold-500' : 'text-white/20'
                      }
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-cream/70 text-sm leading-relaxed line-clamp-3 flex-1">
                  "{t.review}"
                </p>

                {/* Reviewer */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <div className="w-9 h-9 rounded-full bg-saffron-500/20 flex items-center justify-center text-saffron-400 font-bold text-xs flex-shrink-0">
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-cream font-semibold text-sm truncate">{t.name}</p>
                    <p className="text-cream/40 text-xs truncate">{t.location} · {t.date}</p>
                  </div>
                  <span className="ml-auto text-xs text-cream/30 flex-shrink-0">
                    {SOURCE_LABELS[t.source]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          onClick={scrollPrev}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-cream/60 hover:text-saffron-400 hover:border-saffron-400 transition-colors cursor-pointer"
          aria-label="Previous review"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={scrollNext}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-cream/60 hover:text-saffron-400 hover:border-saffron-400 transition-colors cursor-pointer"
          aria-label="Next review"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
