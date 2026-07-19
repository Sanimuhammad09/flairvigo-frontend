import React from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

const mockCategories = [
  {
    name: 'SCRUB TOPS',
    image: '/images/product-top.png',
    path: '/collections/women',
    featured: true,
  },
  {
    name: 'SCRUB PANTS',
    image: '/images/product-pants.png',
    path: '/collections/women',
    featured: true,
  },
  {
    name: 'UNDERSCRUBS',
    image: '/images/product-jacket.png',
    path: '/collections/women',
  },
  {
    name: 'OUTERWEAR',
    image: '/images/product-jacket.png',
    path: '/collections/women',
  },
  {
    name: 'FIGS | NEW BALANCE',
    image: '/images/product-shoes.png',
    path: '/collections/women',
  },
  {
    name: 'ACCESSORIES',
    image: '/images/product-top.png',
    path: '/collections/women',
  },
];

export function ShopByCategory() {
  const { data: liveCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data || data;
    },
  });

  const displayCategories = liveCategories && liveCategories.length > 0 ? liveCategories.map((c: any, idx: number) => ({
    name: c.name.toUpperCase(),
    image: c.image || (idx % 2 === 0 ? '/images/product-top.png' : '/images/product-pants.png'),
    path: `/collections/${c.slug}`,
    featured: idx < 2,
  })) : mockCategories;

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container-premium px-4 sm:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-heading font-black text-3xl sm:text-4xl tracking-wide text-black uppercase">
            Shop By Category
          </h2>
          <Link to="/collections/women" className="hidden sm:block text-[13px] font-bold tracking-[0.1em] uppercase border-b-2 border-black pb-1 hover:text-neutral-600 hover:border-neutral-600 transition-colors">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayCategories.map((cat: any, idx: number) => (
            <Link
              key={cat.name}
              to={cat.path}
              className={`group flex flex-col relative overflow-hidden bg-neutral-100 ${
                cat.featured ? 'col-span-2 aspect-[4/5] lg:aspect-[3/4]' : 'col-span-1 aspect-square lg:aspect-[3/4]'
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
                <p className={`font-bold tracking-[0.1em] uppercase text-white ${
                  cat.featured ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'
                }`}>
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 sm:hidden flex justify-center">
          <Link to="/collections/women" className="text-[13px] font-bold tracking-[0.1em] uppercase border-b-2 border-black pb-1 hover:text-neutral-600 hover:border-neutral-600 transition-colors">
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
