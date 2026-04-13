import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { CateringPackage } from '@/types';

interface CateringPackageCardProps {
  pkg: CateringPackage;
  onSelect: (id: string) => void;
}

export function CateringPackageCard({ pkg, onSelect }: CateringPackageCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-2xl p-6 flex flex-col gap-5 border transition-colors ${
        pkg.highlight
          ? 'bg-saffron-500/10 border-saffron-500/50'
          : 'bg-dark-2 border-white/10 hover:border-white/20'
      }`}
    >
      {pkg.badge && (
        <div className="absolute -top-3 left-6">
          <span className="bg-saffron-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {pkg.badge}
          </span>
        </div>
      )}

      <div>
        <h3
          className="text-xl font-bold text-cream"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {pkg.name}
        </h3>
        <p className="text-cream/50 text-sm mt-1">{pkg.description}</p>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-saffron-400">
          {formatPrice(pkg.pricePerHead)}
        </span>
        <span className="text-cream/50 text-sm">/ person</span>
      </div>

      <p className="text-xs text-cream/40 -mt-3">
        {pkg.minGuests}–{pkg.maxGuests} guests
      </p>

      <ul className="flex flex-col gap-2.5">
        {pkg.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-cream/70">
            <Check size={14} className="text-saffron-400 flex-shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(pkg.id)}
        className={`mt-auto w-full py-3 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
          pkg.highlight
            ? 'bg-saffron-500 hover:bg-saffron-600 text-white'
            : 'border border-saffron-500 text-saffron-400 hover:bg-saffron-500 hover:text-white'
        }`}
      >
        Request Quote
      </button>
    </motion.div>
  );
}
