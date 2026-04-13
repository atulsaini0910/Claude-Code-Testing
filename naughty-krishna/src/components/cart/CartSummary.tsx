import { formatPrice } from '@/lib/utils';
import { RESTAURANT } from '@/lib/constants';

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
}

export function CartSummary({ subtotal, onCheckout }: CartSummaryProps) {
  return (
    <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-cream/60">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-cream/60">
          <span>Delivery fee</span>
          <span className="text-cream/40 text-xs italic">via delivery platform</span>
        </div>
        <div className="flex justify-between text-base font-bold text-cream pt-2 border-t border-white/10">
          <span>Estimated Total</span>
          <span className="text-saffron-400">{formatPrice(subtotal)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-saffron-500 hover:bg-saffron-600 text-white font-semibold py-3.5 rounded-full transition-colors cursor-pointer"
      >
        Place Order · {formatPrice(subtotal)}
      </button>

      <div className="text-center">
        <p className="text-cream/40 text-xs mb-2">Or order via delivery apps</p>
        <div className="flex gap-2 justify-center">
          <a
            href={RESTAURANT.delivery.uberEats}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs py-2 px-3 rounded-xl bg-black border border-white/10 hover:border-saffron-500/40 text-cream/60 hover:text-cream transition-colors"
          >
            🛵 Uber Eats
          </a>
          <a
            href={RESTAURANT.delivery.doorDash}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs py-2 px-3 rounded-xl bg-black border border-white/10 hover:border-saffron-500/40 text-cream/60 hover:text-cream transition-colors"
          >
            🛵 DoorDash
          </a>
        </div>
      </div>
    </div>
  );
}
