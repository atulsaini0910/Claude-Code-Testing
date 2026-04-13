import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Flame } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useCartStore } from '@/store/cartStore';
import { NAV_LINKS, RESTAURANT } from '@/lib/constants';
import { scrollToSection } from '@/lib/utils';

export function Navbar() {
  const { isScrolled } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isOpen, openCart, closeCart, items } = useCartStore();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleNavClick = (href: string) => {
    scrollToSection(href);
    setMobileOpen(false);
  };

  const toggleCart = () => (isOpen ? closeCart() : openCart());

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: isScrolled
            ? 'rgba(13,6,8,0.95)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          boxShadow: isScrolled ? '0 1px 0 rgba(249,115,22,0.2)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2 cursor-pointer"
            aria-label="Go to top"
          >
            <div className="w-9 h-9 rounded-full bg-saffron-500 flex items-center justify-center">
              <Flame size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <span
                className="block text-xl font-bold text-cream"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Naughty Krishna
              </span>
              <span className="block text-xs text-saffron-400 tracking-wider uppercase">
                Pure Vegetarian
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-cream/80 hover:text-saffron-400 text-sm font-medium transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-cream/80 hover:text-saffron-400 transition-colors cursor-pointer"
              aria-label={`Shopping cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            >
              <ShoppingCart size={22} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-saffron-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Order Now (desktop) */}
            <motion.a
              href={RESTAURANT.delivery.uberEats}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Order Online
            </motion.a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 text-cream/80 hover:text-saffron-400 transition-colors cursor-pointer"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-dark-2 border-l border-saffron-500/20 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span
                  className="text-lg font-bold text-cream"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-cream/60 hover:text-cream cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 flex flex-col p-6 gap-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                    onClick={() => handleNavClick(link.href)}
                    className="text-left py-3 px-4 text-cream/80 hover:text-saffron-400 hover:bg-saffron-500/10 rounded-lg transition-all text-base font-medium cursor-pointer"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>
              <div className="p-6 border-t border-white/10 flex flex-col gap-3">
                <a
                  href={RESTAURANT.delivery.uberEats}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-saffron-500 text-white py-3 px-6 rounded-full font-semibold text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Order on Uber Eats
                </a>
                <a
                  href={RESTAURANT.delivery.doorDash}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-red-600 text-white py-3 px-6 rounded-full font-semibold text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Order on DoorDash
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
