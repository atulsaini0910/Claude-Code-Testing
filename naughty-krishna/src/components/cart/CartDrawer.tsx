import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { CheckoutForm } from './CheckoutForm';
import { scrollToSection } from '@/lib/utils';

export function CartDrawer() {
  const { isOpen, closeCart, items } = useCartStore();
  const [checkingOut, setCheckingOut] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleClose = () => {
    closeCart();
    setCheckingOut(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-dark-2 border-l border-saffron-500/20 flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-saffron-400" />
                <h2 className="text-cream font-bold text-lg">Your Order</h2>
                {totalItems > 0 && (
                  <span className="bg-saffron-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                className="text-cream/40 hover:text-cream transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                  <div className="text-6xl">🍽️</div>
                  <div>
                    <p className="text-cream font-semibold text-lg mb-1">
                      Your cart is empty
                    </p>
                    <p className="text-cream/50 text-sm">
                      Add some delicious dishes to get started!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleClose();
                      scrollToSection('menu');
                    }}
                    className="bg-saffron-500 hover:bg-saffron-600 text-white font-semibold px-6 py-3 rounded-full transition-colors cursor-pointer text-sm"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : checkingOut ? (
                <CheckoutForm onClose={() => setCheckingOut(false)} />
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && !checkingOut && (
              <div className="p-6 border-t border-white/10">
                <CartSummary
                  subtotal={subtotal}
                  onCheckout={() => setCheckingOut(true)}
                />
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
