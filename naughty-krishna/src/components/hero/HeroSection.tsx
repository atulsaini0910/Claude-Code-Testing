import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ParticleField } from './ParticleField';
import { HeroText } from './HeroText';
import { scrollToSection } from '@/lib/utils';

interface HeroSectionProps {
  id: string;
}

export function HeroSection({ id }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const prefersReducedMotion = useReducedMotion();
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={prefersReducedMotion ? {} : { y: bgY }}
      >
        {/* Gradient background (placeholder for real photo) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 60% 40%, rgba(249,115,22,0.25) 0%, rgba(153,27,27,0.15) 40%, rgba(13,6,8,1) 80%)',
          }}
        />
        {/* Decorative pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F97316' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* Particle canvas */}
      <div className="absolute inset-0 z-[1]">
        <ParticleField />
      </div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(249,115,22,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-[3] w-full flex flex-col items-center justify-center pt-24 pb-16">
        <HeroText />
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollToSection('menu')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2 text-cream/40 hover:text-saffron-400 transition-colors cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        aria-label="Scroll to menu"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown size={20} />
      </motion.button>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #0d0608)',
        }}
      />
    </section>
  );
}
