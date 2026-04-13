import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 py-3 border-b border-white/10 last:border-0"
    >
      {/* Image */}
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-cream text-sm font-semibold truncate">{item.name}</p>
        <p className="text-saffron-400 text-sm font-bold mt-0.5">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-cream/60 hover:border-saffron-500 hover:text-saffron-400 transition-colors cursor-pointer"
          aria-label="Decrease quantity"
        >
          {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
        </button>
        <span className="text-cream font-semibold text-sm w-4 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-cream/60 hover:border-saffron-500 hover:text-saffron-400 transition-colors cursor-pointer"
          aria-label="Increase quantity"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Line total */}
      <div className="text-right flex-shrink-0 w-14">
        <p className="text-cream text-sm font-bold">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </motion.div>
  );
}
