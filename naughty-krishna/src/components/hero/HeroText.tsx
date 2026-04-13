import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, Utensils } from 'lucide-react';
import { RESTAURANT } from '@/lib/constants';
import { scrollToSection } from '@/lib/utils';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

export function HeroText() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center gap-6 text-center max-w-4xl mx-auto px-4"
      variants={prefersReducedMotion ? undefined : container}
      initial={prefersReducedMotion ? undefined : 'hidden'}
      animate={prefersReducedMotion ? undefined : 'show'}
    >
      {/* Badge */}
      <motion.div
        variants={prefersReducedMotion ? undefined : item}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/50 bg-gold-500/10 backdrop-blur-sm"
      >
        <Utensils size={14} className="text-gold-400" />
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">
          100% Pure Vegetarian Indian
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={prefersReducedMotion ? undefined : item}
        className="text-6xl md:text-8xl lg:text-9xl font-black leading-none"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        <span className="text-cream">Naughty</span>
        <br />
        <span className="text-gradient">Krishna</span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        variants={prefersReducedMotion ? undefined : item}
        className="text-lg md:text-xl text-cream/70 max-w-xl leading-relaxed"
      >
        {RESTAURANT.subTagline}
        <br />
        <span className="text-saffron-400 font-medium">
          Blacktown's finest vegetarian experience.
        </span>
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={prefersReducedMotion ? undefined : item}
        className="flex flex-col sm:flex-row items-center gap-4 mt-2"
      >
        <motion.button
          onClick={() => scrollToSection('menu')}
          className="inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold px-8 py-4 rounded-full text-base transition-colors cursor-pointer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Explore Our Menu
          <ChevronRight size={18} />
        </motion.button>

        <motion.button
          onClick={() => scrollToSection('reservations')}
          className="inline-flex items-center gap-2 bg-transparent border border-cream/40 hover:border-cream text-cream font-semibold px-8 py-4 rounded-full text-base transition-colors cursor-pointer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Reserve a Table
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={prefersReducedMotion ? undefined : item}
        className="flex items-center gap-8 mt-4 pt-6 border-t border-white/10"
      >
        {[
          { value: '19+', label: 'Menu Items' },
          { value: '100%', label: 'Vegetarian' },
          { value: '10AM', label: 'Opens Daily' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p
              className="text-2xl font-bold text-gradient"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-cream/50 uppercase tracking-wider mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
