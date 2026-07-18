import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { ProductCard } from '@/components/common/ProductCard';
import { colorMap } from '@/lib/utils';
import { useSEO } from '@/hooks/useSEO';

const mockCatalogProducts = [
  {
    id: '1', slug: 'leon-three-pocket-scrub-top', name: 'Leon™ Three-Pocket Scrub Top', price: 48,
    images: [
      { url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop' },
    ],
    colors: [{ name: 'Navy', hex: colorMap.navy }, { name: 'Black', hex: colorMap.black }, { name: 'Burgundy', hex: colorMap.burgundy }],
    isNew: true,
  },
  {
    id: '2', slug: 'zamora-jogger-scrub-pants', name: 'Zamora™ Jogger Scrub Pants', price: 58,
    images: [
      { url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop' },
    ],
    colors: [{ name: 'Navy', hex: colorMap.navy }, { name: 'Charcoal', hex: colorMap.charcoal }],
    isBestseller: true,
  },
  {
    id: '3', slug: 'core-scrub-top-men', name: "Men's Core Scrub Top", price: 48,
    images: [
      { url: 'https://images.unsplash.com/photo-1584982751601-97d883f51524?q=80&w=800&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop' },
    ],
    colors: [{ name: 'Black', hex: colorMap.black }, { name: 'Navy', hex: colorMap.navy }],
    isNew: true,
  },
  {
    id: '4', slug: 'seamless-underscrub', name: 'Seamless Underscrub', price: 38,
    images: [
      { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop' },
    ],
    colors: [{ name: 'White', hex: colorMap.white }, { name: 'Black', hex: colorMap.black }],
  },
  {
    id: '5', slug: 'premium-fleece-jacket', name: 'Premium Fleece Jacket', price: 98, originalPrice: 118,
    images: [
      { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop' },
    ],
    colors: [{ name: 'Navy', hex: colorMap.navy }],
  },
  {
    id: '6', slug: 'catarina-one-pocket-top', name: 'Catarina™ One-Pocket Scrub Top', price: 44,
    images: [
      { url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1584982751601-97d883f51524?q=80&w=800&auto=format&fit=crop' },
    ],
    colors: [{ name: 'Navy', hex: colorMap.navy }, { name: 'Olive', hex: colorMap.olive }, { name: 'Black', hex: colorMap.black }],
  },
  {
    id: '7', slug: 'rafaela-jogger', name: 'Rafaela™ Jogger Pants', price: 54,
    images: [
      { url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop' },
    ],
    colors: [{ name: 'Black', hex: colorMap.black }, { name: 'Navy', hex: colorMap.navy }],
    isNew: true,
  },
  {
    id: '8', slug: 'performance-zip-jacket', name: 'Performance Zip Jacket', price: 88,
    images: [
      { url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop' },
    ],
    colors: [{ name: 'Charcoal', hex: colorMap.charcoal }],
    isBestseller: true,
  },
];

export const Route = createFileRoute('/_shop/collections/$slug')({
  component: CollectionPage,
});

function CollectionPage() {
  const { slug } = Route.useParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const collectionTitle = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useSEO({
    title: `${collectionTitle} Scrubs`,
    description: `Shop our ${collectionTitle} collection of premium medical scrubs and healthcare apparel.`,
  });

  return (
    <div className="min-h-screen bg-white">
      <section className="px-4 sm:px-8 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6 text-[11px] font-bold tracking-[0.1em] uppercase text-black">
            <button className="flex items-center gap-1 hover:text-neutral-600 transition-colors">COLOR <ChevronDown size={14} /></button>
            <button className="flex items-center gap-1 hover:text-neutral-600 transition-colors">SIZE <ChevronDown size={14} /></button>
            <button className="flex items-center gap-1 hover:text-neutral-600 transition-colors">CATEGORY <ChevronDown size={14} /></button>
            <button className="flex items-center gap-1 hover:text-neutral-600 transition-colors">STYLE <ChevronDown size={14} /></button>
            <button className="flex items-center gap-1 hover:text-neutral-600 transition-colors">FIT <ChevronDown size={14} /></button>
            <button className="flex items-center gap-1 hover:text-neutral-600 transition-colors">INSEAM <ChevronDown size={14} /></button>
            <button className="flex items-center gap-1 hover:text-neutral-600 transition-colors">FABRIC <ChevronDown size={14} /></button>
          </div>
          <div className="text-[12px] font-medium text-neutral-500">
            53 Total
          </div>
        </div>

        <div className="mb-10">
          <p className="text-[13px] text-neutral-600 font-medium tracking-wide">
            Available 24/7, 365 days a year in core colors, a variety of inseams and styles.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10">
          {mockCatalogProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1.5 mt-14">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-9 h-9 flex items-center justify-center text-[13px] font-medium transition-colors ${
                page === 1
                  ? 'bg-black text-white'
                  : 'text-neutral-500 hover:text-black border border-neutral-200 hover:border-black'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[380px] bg-white z-50 lg:hidden overflow-y-auto"
          >
            <div className="h-[60px] px-5 flex items-center justify-between border-b border-neutral-100">
              <h3 className="text-[13px] font-bold tracking-[0.1em] uppercase">
                Filters
              </h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 -mr-2">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[13px] text-neutral-500">
                Filter options will be connected to the backend catalog.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
