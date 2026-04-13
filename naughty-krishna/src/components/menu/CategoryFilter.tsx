import { motion, LayoutGroup } from 'framer-motion';
import { MENU_CATEGORIES } from '@/data/menu';
import type { MenuCategory } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  active: MenuCategory;
  onChange: (cat: MenuCategory) => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <LayoutGroup>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={cn(
              'relative px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer flex-shrink-0',
              active === cat.id
                ? 'text-white'
                : 'text-cream/60 hover:text-cream bg-white/5 hover:bg-white/10',
            )}
          >
            {active === cat.id && (
              <motion.div
                layoutId="active-filter-pill"
                className="absolute inset-0 bg-saffron-500 rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}
