import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Heart, Plus, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: { url: string; alt?: string }[];
  colors: { name: string; hex: string }[];
  isNew?: boolean;
  isBestseller?: boolean;
  isLoading?: boolean;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  originalPrice,
  images,
  colors,
  isNew,
  isBestseller,
  isLoading = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full aspect-[3/4] bg-neutral-100 animate-pulse" />
        <div className="h-4 w-3/4 bg-neutral-100 animate-pulse" />
        <div className="h-4 w-1/4 bg-neutral-100 animate-pulse" />
      </div>
    );
  }

  const primaryImage = images[0]?.url;
  const secondaryImage = images[1]?.url || primaryImage;

  return (
    <div
      className="group flex flex-col w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link
        to={`/products/${slug}`}
        className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-100 mb-3 block"
      >
        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 z-20 hover:scale-110 transition-transform duration-200"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
        >
          <Heart size={20} strokeWidth={1.5} className="text-black hover:fill-black" />
        </button>

        {/* Images */}
        {!isImageLoaded && (
          <div className="absolute inset-0 z-10 bg-neutral-200 animate-pulse" />
        )}

        <div className="relative w-full h-full">
          <img
            src={primaryImage}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />
          <img
            src={secondaryImage}
            alt={`${name} alternate view`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              isHovered ? 'opacity-100 scale-[1.03]' : 'opacity-0 scale-100'
            }`}
            loading="lazy"
          />
        </div>

        {/* Quick Add Button */}
        <button
          className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105"
          aria-label="Quick Add"
          onClick={(e) => e.preventDefault()}
        >
          <Plus size={20} strokeWidth={2} className="text-black" />
        </button>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col gap-1.5 px-0.5 mt-1">
        {/* Badges Area */}
        {(isNew || isBestseller) && (
          <div className="flex items-center gap-2">
            {isNew && (
              <span className="text-[10px] font-bold tracking-[0.05em] uppercase text-[#4A8BFF]">
                NEW
              </span>
            )}
            {isBestseller && (
              <span className="text-[10px] font-bold tracking-[0.05em] uppercase text-[#4A8BFF]">
                BEST SELLER
              </span>
            )}
          </div>
        )}

        <Link
          to={`/products/${slug}`}
          className="text-[14px] font-bold text-black hover:text-neutral-600 transition-colors leading-snug tracking-wide"
        >
          {name}
        </Link>

        <div className="flex items-center gap-2">
          {originalPrice && originalPrice > price && (
            <span className="text-[14px] font-bold text-neutral-400 line-through tracking-wide">
              {formatCurrency(originalPrice)}
            </span>
          )}
          <span className="text-[14px] font-bold text-black tracking-wide">
            {formatCurrency(price)}
          </span>
        </div>

        <p className="text-[12px] font-bold text-neutral-500 mt-1">
          {colors && colors.length > 0 ? colors[activeColorIndex].name : 'Deep Purple'}
        </p>

        {/* Color Swatches */}
        {colors && colors.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            {colors.slice(0, 4).map((color, index) => (
              <button
                key={color.name}
                className={`relative w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all ${
                  activeColorIndex === index
                    ? 'ring-1 ring-black ring-offset-2'
                    : 'ring-1 ring-neutral-300 hover:ring-neutral-400'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveColorIndex(index);
                }}
                title={color.name}
              >
                <span
                  className="block w-full h-full rounded-full absolute inset-0"
                  style={{ backgroundColor: color.hex }}
                />
                {activeColorIndex === index && (
                  <Check size={12} strokeWidth={3} className="text-white relative z-10 drop-shadow-sm mix-blend-difference" />
                )}
              </button>
            ))}
            {colors.length > 4 && (
              <span className="text-[10px] font-bold bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full ml-1">
                +{colors.length - 4} MORE
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
