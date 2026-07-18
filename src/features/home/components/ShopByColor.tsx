import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const colors = [
  {
    name: 'CELERY',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop',
    path: '/collections/women',
    isNew: true,
    bg: '#c5d654',
  },
  {
    name: 'DEEP PURPLE',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=400&auto=format&fit=crop',
    path: '/collections/women',
    isNew: true,
    bg: '#5e3b62',
  },
  {
    name: 'BLACK',
    image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?q=80&w=400&auto=format&fit=crop',
    path: '/collections/women',
    bg: '#1a1a1a',
  },
  {
    name: 'NAVY',
    image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=400&auto=format&fit=crop',
    path: '/collections/women',
    bg: '#1a1a2e',
  },
  {
    name: 'MOSS',
    image: 'https://images.unsplash.com/photo-1584982751601-97d883f51524?q=80&w=400&auto=format&fit=crop',
    path: '/collections/women',
    bg: '#5a6b4c',
  },
  {
    name: 'ROYAL BLUE',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&auto=format&fit=crop',
    path: '/collections/women',
    bg: '#2555a0',
  },
  {
    name: 'BURGUNDY',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=400&auto=format&fit=crop',
    path: '/collections/women',
    bg: '#692a2d',
  },
  {
    name: 'AMETHYST',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
    path: '/collections/women',
    bg: '#6b4c8a',
  },
  {
    name: 'CHARCOAL',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop',
    path: '/collections/women',
    bg: '#4a4a4a',
  },
];

export function ShopByColor() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 2,
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container-premium px-4 sm:px-8 mb-8">
        <h2 className="font-heading font-black text-3xl sm:text-4xl tracking-wide text-black uppercase">
          Shop By Color
        </h2>
      </div>
      
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-6 px-4 sm:px-8 lg:px-16">
            {colors.map((color) => (
              <Link
                key={color.name}
                to={color.path}
                className="flex-[0_0_140px] sm:flex-[0_0_180px] lg:flex-[0_0_220px] group"
              >
                <div
                  className="relative w-full aspect-[4/5] rounded-none overflow-hidden mb-4"
                  style={{ backgroundColor: color.bg }}
                >
                  <img
                    src={color.image}
                    alt={color.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {color.isNew && (
                    <span className="absolute top-3 left-3 text-[10px] font-black tracking-widest uppercase bg-white text-black px-3 py-1 shadow-md">
                      NEW
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-neutral-200" style={{ backgroundColor: color.bg }} />
                  <p className="text-[11px] sm:text-[13px] font-bold tracking-[0.1em] uppercase text-black">
                    {color.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Next button */}
        {canScrollNext && (
          <button
            onClick={scrollNext}
            className="absolute right-4 sm:right-8 top-[40%] -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center hover:scale-105 transition-transform border border-neutral-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>
        )}
      </div>
    </section>
  );
}
