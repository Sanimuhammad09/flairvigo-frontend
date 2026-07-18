import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';

export function HeroSection() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-[#8e8e82] flex items-center justify-center">
      {/* Full-width Background Image */}
      {!isImageLoaded && (
        <div className="absolute inset-0 bg-[#8e8e82] animate-pulse z-0" />
      )}
      <img
        src="/images/hero.png"
        alt="Healthcare professionals in premium scrubs"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
          isImageLoaded ? 'opacity-100' : 'opacity-0'
        } z-0`}
        onLoad={() => setIsImageLoaded(true)}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Text Overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 w-full max-w-4xl mx-auto mt-16 lg:mt-24">
        <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.04em] text-white uppercase leading-none mb-4 drop-shadow-lg">
          IN THE MIX
        </h1>
        
        <p className="text-white text-base sm:text-lg lg:text-xl font-medium tracking-wide max-w-2xl mb-8 drop-shadow-md">
          NEW Celery and best-selling Deep Purple, plus an all new fabric: FlexKnit. For mixing, matching, and doing the most (always).
        </p>

        <Link to="/collections/women">
          <button className="bg-white text-black text-[13px] font-bold tracking-[0.15em] uppercase px-10 py-4 hover:bg-neutral-200 transition-colors duration-300">
            Shop Celery • Deep Purple
          </button>
        </Link>
      </div>
    </section>
  );
}
