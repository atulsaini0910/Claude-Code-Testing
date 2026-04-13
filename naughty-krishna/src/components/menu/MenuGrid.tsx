import { AnimatePresence, motion } from 'framer-motion';
import { MenuCard } from './MenuCard';
import type { MenuItem } from '@/types';

interface MenuGridProps {
  items: MenuItem[];
}

export function MenuGrid({ items }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-cream/40"
      >
        <span className="text-5xl">🍽️</span>
        <p className="text-lg font-medium">No dishes found</p>
        <p className="text-sm">Try a different category or search term</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
}
