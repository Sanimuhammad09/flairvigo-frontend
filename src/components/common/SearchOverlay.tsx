import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useProducts } from '@/features/products/api/hooks';
import { formatCurrency } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch products
  const { data: searchResults, isLoading } = useProducts({
    search: debouncedQuery,
    limit: 6,
  });

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const hasResults = searchResults?.data && searchResults.data.length > 0;
  const noResults = debouncedQuery.length > 0 && !isLoading && !hasResults;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="w-full bg-[#ffffff] shadow-2xl rounded-b-[20px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header & Input */}
            <div className="flex items-center gap-4 p-6 lg:p-8 border-b border-neutral-100 max-w-7xl mx-auto w-full">
              <Search size={24} className="text-neutral-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search products, colors, collections..."
                className="flex-1 text-xl lg:text-3xl font-black text-charcoal bg-transparent outline-none placeholder:text-neutral-300 placeholder:font-bold"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 text-charcoal hover:bg-neutral-200 transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-w-7xl mx-auto w-full p-6 lg:p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              
              {/* Initial State / Suggestions */}
              {query.length === 0 && (
                <div className="space-y-6">
                  <h3 className="text-[11px] font-black tracking-widest text-neutral-400 uppercase">Popular Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Classic Scrub Pants', 'Deep Purple', 'Women\'s Tops', 'New Arrivals'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-[12px] font-bold text-charcoal hover:border-charcoal transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && query.length > 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-charcoal mb-4" />
                  <p className="text-[13px] font-bold text-neutral-500">Searching...</p>
                </div>
              )}

              {/* No Results */}
              {noResults && (
                <div className="text-center py-12">
                  <p className="text-xl font-black text-charcoal mb-2">No results found</p>
                  <p className="text-[13px] text-neutral-500">We couldn't find anything matching "{debouncedQuery}".</p>
                </div>
              )}

              {/* Results Grid */}
              {hasResults && !isLoading && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[11px] font-black tracking-widest text-neutral-400 uppercase">
                      Products ({searchResults.meta.total})
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
                    {searchResults.data.map((product) => (
                      <Link
                        key={product.id}
                        to="/products/$slug"
                        params={{ slug: product.slug }}
                        onClick={onClose}
                        className="group"
                      >
                        <div className="aspect-[3/4] bg-neutral-100 rounded-[2px] overflow-hidden mb-3">
                          <img
                            src={product.images?.[0]?.url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <h4 className="text-[12px] font-bold text-charcoal leading-tight mb-1 group-hover:underline decoration-2 underline-offset-2">
                          {product.name}
                        </h4>
                        <p className="text-[12px] text-neutral-500 font-medium">
                          {formatCurrency(product.basePrice)}
                        </p>
                      </Link>
                    ))}
                  </div>
                  
                  {searchResults.meta.total > 6 && (
                    <div className="mt-8 text-center">
                      <Link
                        to="/collections/all"
                        search={{ search: debouncedQuery }}
                        onClick={onClose}
                        className="inline-block border-2 border-charcoal text-charcoal font-black text-[11px] tracking-widest uppercase px-8 py-3 hover:bg-charcoal hover:text-white transition-colors"
                      >
                        View All Results
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Clickable Backdrop to close */}
          <div className="flex-1" onClick={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
