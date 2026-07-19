import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import { ShoppingBag, Search, User, Menu, X, Heart, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart.store';

/* ─── Mega Menu Data ─── */
interface MegaMenuColumn {
  title: string;
  links: { name: string; path: string; badge?: string }[];
}

interface MegaMenuData {
  columns: MegaMenuColumn[];
  featured?: {
    image: string;
    title: string;
    subtitle: string;
    path: string;
  };
}

const megaMenus: Record<string, MegaMenuData> = {
  Women: {
    columns: [
      {
        title: 'Highlights',
        links: [
          { name: 'Celery • Deep Purple', path: '/women', badge: 'NEW' },
          { name: 'New Arrivals', path: '/collections/new-arrivals' },
          { name: 'Best Sellers', path: '/collections/best-sellers' },
          { name: 'THE SET', path: '/women' },
          { name: 'Sale', path: '/collections/sale' },
        ],
      },
      {
        title: 'Scrubs',
        links: [
          { name: 'All Scrubs', path: '/women' },
          { name: 'Scrub Tops', path: '/women' },
          { name: 'Scrub Pants', path: '/women' },
          { name: 'Scrub Sets', path: '/women' },
          { name: 'ScrubJumpsuits™', path: '/women' },
          { name: 'ScrubLeggings™', path: '/women' },
          { name: 'Maternity Scrubs', path: '/women' },
        ],
      },
      {
        title: 'Shop by Fabric',
        links: [
          { name: 'FIONx™ (Soft + Breathable)', path: '/women' },
          { name: 'FORMx™ (Stretch + Comfort)', path: '/women' },
          { name: 'FlexKnit (Flexible + Airy)', path: '/women' },
        ],
      },
      {
        title: 'Outerwear and Underscrubs',
        links: [
          { name: 'Jackets and Vests', path: '/women' },
          { name: 'Underscrubs and Tees', path: '/women' },
          { name: 'Lab Coats', path: '/women' },
          { name: 'Loungewear', path: '/women' },
        ],
      },
      {
        title: 'Footwear and Accessories',
        links: [
          { name: 'FIGS | New Balance', path: '/women' },
          { name: 'Socks', path: '/women' },
          { name: 'Accessories', path: '/women' },
          { name: 'Bags', path: '/women' },
        ],
      },
    ],
  },
  Men: {
    columns: [
      {
        title: 'Highlights',
        links: [
          { name: 'Celery • Deep Purple', path: '/men', badge: 'NEW' },
          { name: 'New Arrivals', path: '/collections/new-arrivals' },
          { name: 'Best Sellers', path: '/collections/best-sellers' },
          { name: 'THE SET', path: '/men' },
          { name: 'Sale', path: '/collections/sale' },
        ],
      },
      {
        title: 'Scrubs',
        links: [
          { name: 'All Scrubs', path: '/men' },
          { name: 'Scrub Tops', path: '/men' },
          { name: 'Scrub Pants', path: '/men' },
          { name: 'Scrub Sets', path: '/men' },
        ],
      },
      {
        title: 'Shop by Fabric',
        links: [
          { name: 'FIONx™ (Soft + Breathable)', path: '/men' },
          { name: 'FORMx™ (Stretch + Comfort)', path: '/men' },
          { name: 'FlexKnit (Flexible + Airy)', path: '/men' },
        ],
      },
      {
        title: 'Outerwear and Underscrubs',
        links: [
          { name: 'Jackets and Vests', path: '/men' },
          { name: 'Underscrubs and Tees', path: '/men' },
          { name: 'Lab Coats', path: '/men' },
          { name: 'Loungewear', path: '/men' },
        ],
      },
      {
        title: 'Footwear and Accessories',
        links: [
          { name: 'FIGS | New Balance', path: '/men' },
          { name: 'Socks', path: '/men' },
          { name: 'Accessories', path: '/men' },
          { name: 'Bags', path: '/men' },
        ],
      },
    ],
  },
};

const topLevelNav = [
  { name: 'Women', hasMega: true, path: '/women' },
  { name: 'Men', hasMega: true, path: '/men' },
  { name: 'Group Orders', path: '/contact' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'About', path: '/about' },
];

/* ─── Mobile Accordion Data ─── */
const mobileMenuSections = [
  {
    title: 'Women',
    links: [
      { name: 'All Women', path: '/women' },
      { name: 'Scrub Tops', path: '/women' },
      { name: 'Scrub Pants', path: '/women' },
      { name: 'New Arrivals', path: '/collections/new-arrivals' },
    ],
  },
  {
    title: 'Men',
    links: [
      { name: 'All Men', path: '/men' },
      { name: 'Scrub Tops', path: '/men' },
      { name: 'Scrub Pants', path: '/men' },
      { name: 'New Arrivals', path: '/collections/new-arrivals' },
    ],
  },
];

/* ─── Component ─── */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartItems = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const openMega = useCallback((name: string) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setActiveMega(name);
  }, []);

  const closeMega = useCallback(() => {
    megaTimeoutRef.current = setTimeout(() => setActiveMega(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-[0_1px_0_0_#e5e5e5]'
            : 'bg-white'
        }`}
      >
        {/* ─── Desktop Navbar ─── */}
        <div className="container-premium h-[60px] flex items-center justify-between relative">
          {/* Left: Mobile hamburger + Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 -ml-2 text-black"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="Flairvigo" className="h-10 md:h-12 w-auto object-contain" />
            </Link>
          </div>

          {/* Center: Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2 h-full">
            {topLevelNav.map((item) =>
              item.hasMega ? (
                <button
                  key={item.name}
                  onMouseEnter={() => openMega(item.name)}
                  onMouseLeave={closeMega}
                  className={`h-full border-b-2 flex items-center text-[13px] font-bold tracking-[0.04em] transition-colors ${
                    activeMega === item.name ? 'border-black text-black' : 'border-transparent text-black/80 hover:text-black hover:border-black/30'
                  }`}
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.path!}
                  className="h-full border-b-2 border-transparent flex items-center text-[13px] font-bold tracking-[0.04em] text-black/80 hover:text-black hover:border-black/30 transition-colors"
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Search Pill */}
            <button
              className="hidden lg:flex items-center gap-2 border border-black/20 rounded-full px-4 py-1.5 text-black/70 hover:border-black hover:text-black transition-colors"
              aria-label="Search"
            >
              <Search size={16} strokeWidth={2} />
              <span className="text-[12px] font-medium tracking-[0.02em]">Search</span>
            </button>

            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden lg:flex items-center gap-1.5 cursor-pointer">
                <div className="w-5 h-3.5 bg-neutral-200 rounded-[2px] overflow-hidden flex relative border border-black/10">
                  <div className="absolute top-0 left-0 w-[40%] h-full bg-blue-800"></div>
                  <div className="absolute top-0 right-0 w-[60%] h-full flex flex-col justify-between py-[1px]">
                    <div className="h-[2px] bg-red-600 w-full"></div>
                    <div className="h-[2px] bg-red-600 w-full"></div>
                    <div className="h-[2px] bg-red-600 w-full"></div>
                  </div>
                </div>
                <span className="text-[12px] font-bold">EN</span>
              </div>
              <Link
                to="/account"
                className="text-black/80 hover:text-black transition-colors hidden sm:flex"
                aria-label="Account"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>
              <Link
                to="/account/wishlist"
                className="text-black/80 hover:text-black transition-colors hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.5} />
              </Link>
              <button
                className="text-black/80 hover:text-black transition-colors relative"
                aria-label="Cart"
                onClick={() => useCartStore.getState().toggleCart()}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-black text-white text-[9px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center leading-none border border-white">
                    {cartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Mega Menu Dropdown ─── */}
        <AnimatePresence>
          {activeMega && megaMenus[activeMega] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute left-0 right-0 top-full z-40 bg-white border-t border-neutral-200 overflow-hidden"
              onMouseEnter={cancelClose}
              onMouseLeave={closeMega}
            >
              <div className="container-premium py-10">
                <div className="grid grid-cols-5 gap-8">
                  {megaMenus[activeMega].columns.map((col) => (
                    <div key={col.title}>
                      <h3 className="text-[13px] font-bold text-black mb-5">
                        {col.title}
                      </h3>
                      <ul className="flex flex-col gap-3">
                        {col.links.map((link) => (
                          <li key={link.name}>
                            <Link
                              to={link.path}
                              onClick={() => setActiveMega(null)}
                              className="text-[14px] text-neutral-600 hover:text-black transition-colors flex items-center gap-2"
                            >
                              {link.name}
                              {link.badge && (
                                <span className="text-[10px] font-bold tracking-wider bg-[#5e3b62] text-white px-2 py-0.5 rounded-full">
                                  {link.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[380px] bg-white z-[70] flex flex-col"
            >
              {/* Header */}
              <div className="h-[60px] px-5 flex justify-between items-center border-b border-neutral-100">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <img src="/images/logo.png" alt="Flairvigo" className="h-8 w-auto object-contain" />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-neutral-500 hover:text-black transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                {/* Accordion sections */}
                {mobileMenuSections.map((section) => (
                  <div key={section.title} className="border-b border-neutral-100">
                    <button
                      onClick={() =>
                        setExpandedMobileSection(
                          expandedMobileSection === section.title ? null : section.title
                        )
                      }
                      className="w-full px-6 py-4 flex items-center justify-between text-[15px] font-semibold tracking-[0.04em] uppercase"
                    >
                      {section.title}
                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className={`transition-transform duration-200 ${
                          expandedMobileSection === section.title ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {expandedMobileSection === section.title && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 flex flex-col gap-3">
                            {section.links.map((link) => (
                              <Link
                                key={link.name}
                                to={link.path}
                                className="text-[14px] text-neutral-600 hover:text-black transition-colors pl-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {link.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Direct links */}
                <Link
                  to="/collections/new-arrivals"
                  className="block px-6 py-4 text-[15px] font-semibold tracking-[0.04em] uppercase border-b border-neutral-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  What's New
                </Link>
                <Link
                  to="/collections/mix-and-match"
                  className="block px-6 py-4 text-[15px] font-semibold tracking-[0.04em] uppercase border-b border-neutral-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mix & Match
                </Link>
                <Link
                  to="/about"
                  className="block px-6 py-4 text-[15px] font-semibold tracking-[0.04em] uppercase border-b border-neutral-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/fit-finder"
                  className="block px-6 py-4 text-[15px] font-semibold tracking-[0.04em] uppercase border-b border-neutral-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Fit Finder
                </Link>
              </div>

              {/* Footer actions */}
              <div className="border-t border-neutral-100 bg-neutral-50">
                <Link
                  to="/account"
                  className="flex items-center gap-3 px-6 py-3.5 text-sm font-medium hover:bg-neutral-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={18} strokeWidth={1.5} />
                  My Account
                </Link>
                <Link
                  to="/account/wishlist"
                  className="flex items-center gap-3 px-6 py-3.5 text-sm font-medium hover:bg-neutral-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart size={18} strokeWidth={1.5} />
                  Wishlist
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-3 px-6 py-3.5 text-sm font-medium hover:bg-neutral-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Search size={18} strokeWidth={1.5} />
                  Help
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
