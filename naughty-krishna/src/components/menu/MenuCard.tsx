import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Leaf } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Badge, SpiceLevel } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { MenuItem } from '@/types';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
    toast.success(`${item.name} added to cart`, { duration: 2000 });
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="bg-dark-2 rounded-2xl overflow-hidden border border-white/5 hover:border-saffron-500/30 transition-colors group flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {item.badge && <Badge type={item.badge} />}
          {item.isVegan && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-900/80 text-green-300 backdrop-blur-sm">
              <Leaf size={10} /> Vegan
            </span>
          )}
        </div>
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-2/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {item.spiceLevel && (
          <SpiceLevel level={item.spiceLevel} />
        )}
        <h3
          className="text-base font-bold text-cream leading-snug"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {item.name}
        </h3>
        <p className="text-cream/50 text-xs leading-relaxed line-clamp-2 flex-1">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
          <span className="text-saffron-400 font-bold text-lg">
            {formatPrice(item.price)}
          </span>
          <motion.button
            onClick={handleAdd}
            disabled={added}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer"
            style={{
              background: added ? '#166534' : '#F97316',
              color: 'white',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              key={added ? 'check' : 'plus'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {added ? <Check size={12} /> : <Plus size={12} />}
            </motion.span>
            {added ? 'Added!' : 'Add'}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
