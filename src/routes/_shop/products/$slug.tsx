import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Minus, Plus, ChevronRight, Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { ProductCard } from '@/components/common/ProductCard';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useSEO } from '@/hooks/useSEO';
import toast from 'react-hot-toast';

import { useProduct, useRelatedProducts } from '@/features/products/api/hooks';

export const Route = createFileRoute('/_shop/products/$slug')({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: relatedProductsData } = useRelatedProducts(product?.id || '', 4);

  useSEO({
    title: product?.name || 'Product',
    description: product?.description || '',
  });

  const uniqueColors = Array.from(
    new Map(product?.variants?.map((v) => [v.color, { name: v.color, hex: v.colorHex || '#ccc' }]) || []).values()
  );

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    if (uniqueColors.length > 0 && !selectedColor) {
      setSelectedColor(uniqueColors[0].name);
    }
  }, [uniqueColors, selectedColor]);

  // Handle sticky mobile "Add to Cart" appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const availableSizes = (product?.variants || [])
    .filter((v) => v.color === selectedColor)
    .map((v) => ({ size: v.size, inStock: v.inventory > 0 }));

  const selectedVariant = (product?.variants || []).find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const price = (product?.basePrice || 0) + (selectedVariant?.priceOffset || 0);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return;
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      color: selectedVariant.color,
      size: selectedVariant.size,
      price: product.basePrice + selectedVariant.priceOffset,
      image: product.images?.[0]?.url || '',
      quantity,
    });
    toast.success('Added to bag');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-neutral-200 rounded mb-4"></div>
          <div className="h-64 w-64 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-neutral-500 font-bold tracking-widest uppercase">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0 relative">
      {/* Breadcrumbs - Sticky Top Desktop */}
      <div className="hidden lg:block sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-100 py-3 px-8">
        <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-neutral-400">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/collections/$slug" params={{ slug: product.category.slug || 'all' }} className="hover:text-black transition-colors">
            {product.category.name}
          </Link>
          <ChevronRight size={10} />
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row w-full max-w-[2000px] mx-auto">
        
        {/* Left Side: Image Gallery */}
        <div className="w-full lg:w-[62%] xl:w-[68%] lg:border-r border-neutral-100 bg-[#f5f5f5]">
          {/* Mobile Breadcrumb */}
          <div className="lg:hidden py-4 px-4 bg-white">
            <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-neutral-400">
              <Link to="/" className="hover:text-black transition-colors">Home</Link>
              <ChevronRight size={10} />
              <Link to="/collections/$slug" params={{ slug: product.category.slug || 'all' }} className="hover:text-black transition-colors">
                {product.category.name}
              </Link>
            </nav>
          </div>

          {/* Desktop Grid Gallery */}
          <div className="hidden lg:grid grid-cols-2 gap-[2px] p-[2px]">
            {product.images?.map((image) => (
              <div key={image.id} className="relative aspect-[3/4] bg-neutral-100 overflow-hidden group">
                <img
                  src={image.url}
                  alt={image.alt || product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* Mobile Horizontal Snap Gallery */}
          <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {product.images?.map((image) => (
              <div key={image.id} className="w-full flex-shrink-0 snap-center aspect-[3/4] bg-neutral-100 relative">
                <img
                  src={image.url}
                  alt={image.alt || product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Product Details (Sticky) */}
        <div className="w-full lg:w-[38%] xl:w-[32%] bg-white">
          <div className="lg:sticky lg:top-12 px-6 lg:px-10 py-8 lg:py-12 h-fit lg:max-h-[calc(100vh-48px)] overflow-y-auto custom-scrollbar">
            
            {/* Title & Price */}
            <div className="mb-8">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h1 className="font-heading font-black text-2xl lg:text-3xl tracking-tight text-black leading-none uppercase">
                  {product.name}
                </h1>
                <p className="text-xl lg:text-2xl font-black text-black shrink-0">
                  {formatCurrency(price)}
                </p>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={12} className="text-black fill-black" />
                  ))}
                </div>
                <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  ({product.reviews?.length || 0} Reviews)
                </span>
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-black tracking-[0.15em] uppercase text-black">
                  Color: <span className="text-neutral-500 font-bold ml-1">{selectedColor}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {uniqueColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setSelectedSize('');
                    }}
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      selectedColor === color.name
                        ? 'border-2 border-black p-[2px]'
                        : 'border border-transparent hover:border-neutral-300 p-0'
                    }`}
                    title={color.name}
                  >
                    <span
                      className="block w-full h-full rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-black tracking-[0.15em] uppercase text-black">
                  Select Size
                </p>
                <Link to="/fit-finder" className="text-[11px] font-bold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase underline underline-offset-4">
                  Size Guide
                </Link>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
                {availableSizes.map(({ size, inStock }) => (
                  <button
                    key={size}
                    onClick={() => inStock && setSelectedSize(size)}
                    disabled={!inStock}
                    className={`relative py-3.5 text-[12px] font-black uppercase tracking-widest border transition-all ${
                      selectedSize === size
                        ? 'bg-black text-white border-black shadow-md'
                        : inStock
                          ? 'border-neutral-200 text-charcoal hover:border-black bg-white'
                          : 'border-neutral-100 text-neutral-300 cursor-not-allowed bg-neutral-50 line-through'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Add to Cart Button */}
            <div className="hidden lg:flex gap-3 mb-10">
              <button
                className={`flex-1 text-[13px] font-black tracking-[0.15em] uppercase py-5 transition-all shadow-md hover:shadow-xl ${
                  !selectedSize || (selectedVariant && selectedVariant.inventory <= 0)
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                    : 'bg-black text-white hover:bg-neutral-800 hover:-translate-y-0.5'
                }`}
                disabled={!selectedSize || (selectedVariant !== undefined && selectedVariant.inventory <= 0)}
                onClick={handleAddToCart}
              >
                {!selectedSize
                  ? 'Select a Size'
                  : selectedVariant?.inventory === 0
                    ? 'Waitlist Me'
                    : 'Add to Bag'}
              </button>
              <button
                className="w-16 flex items-center justify-center border-2 border-neutral-200 text-black hover:border-black transition-colors bg-white hover:bg-neutral-50"
                aria-label="Add to wishlist"
              >
                <Heart size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Features list */}
            <div className="mb-10 space-y-4">
              <div className="flex items-center gap-4 text-[11px] font-black tracking-widest uppercase text-charcoal">
                <Shield size={16} className="text-emerald-600" />
                Anti-Wrinkle & Odor Resistant
              </div>
              <div className="flex items-center gap-4 text-[11px] font-black tracking-widest uppercase text-charcoal">
                <Truck size={16} />
                Free Shipping on Orders over $50
              </div>
              <div className="flex items-center gap-4 text-[11px] font-black tracking-widest uppercase text-charcoal">
                <RotateCcw size={16} />
                30-Day Hassle-Free Returns
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t-2 border-black/5 mt-8">
              {[
                { key: 'description', title: 'Why You\'ll Love It', content: product.description },
                {
                  key: 'fabric',
                  title: 'Fabric & Care',
                  content: `${product.fabricDetails || 'Premium proprietary fabric blend.'}\n\n${product.careInstructions || 'Machine wash cold. Tumble dry low.'}`,
                },
              ].map((section) => (
                <div key={section.key} className="border-b border-black/5">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === section.key ? null : section.key)
                    }
                    className="flex items-center justify-between w-full py-5 text-[12px] font-black tracking-widest uppercase text-black hover:text-neutral-500 transition-colors"
                  >
                    {section.title}
                    <div className="relative w-3 h-3">
                      <span className="absolute top-1/2 left-0 w-full h-[2px] bg-current -translate-y-1/2 rounded-full" />
                      <span className={`absolute top-0 left-1/2 w-[2px] h-full bg-current -translate-x-1/2 rounded-full transition-transform duration-300 ${openAccordion === section.key ? 'scale-y-0' : 'scale-y-100'}`} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openAccordion === section.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <p className="text-[14px] text-neutral-600 leading-relaxed pb-6 pt-2 font-medium">
                          {section.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Bag */}
      <AnimatePresence>
        {isScrolledPastHero && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-safe"
          >
            <button
              className={`w-full text-[13px] font-black tracking-[0.15em] uppercase py-4 transition-all shadow-md ${
                !selectedSize || (selectedVariant && selectedVariant.inventory <= 0)
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
              disabled={!selectedSize || (selectedVariant !== undefined && selectedVariant.inventory <= 0)}
              onClick={handleAddToCart}
            >
              {!selectedSize
                ? 'Select a Size'
                : selectedVariant?.inventory === 0
                  ? 'Waitlist Me'
                  : `Add to Bag • ${formatCurrency(price)}`}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile inline button (when sticky is hidden) */}
      <div className="lg:hidden px-6 pb-12 pt-4">
          <button
              className={`w-full text-[13px] font-black tracking-[0.15em] uppercase py-5 transition-all shadow-md ${
                !selectedSize || (selectedVariant && selectedVariant.inventory <= 0)
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
              disabled={!selectedSize || (selectedVariant !== undefined && selectedVariant.inventory <= 0)}
              onClick={handleAddToCart}
            >
              {!selectedSize
                ? 'Select a Size'
                : selectedVariant?.inventory === 0
                  ? 'Waitlist Me'
                  : `Add to Bag`}
            </button>
      </div>

      {/* Related Products */}
      <section className="border-t-4 border-black pt-16 pb-24 bg-[#fafafa]">
        <div className="max-w-[2000px] mx-auto px-6 lg:px-12">
          <h2 className="font-heading font-black text-2xl lg:text-3xl tracking-tight text-black mb-10 uppercase">
            Complete The Set
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {relatedProductsData?.map((p) => (
              <ProductCard 
                key={p.id} 
                id={p.id}
                slug={p.slug}
                name={p.name}
                price={p.basePrice}
                images={p.images || []}
                colors={p.variants?.map(v => ({ name: v.color, hex: v.colorHex || '#000000' })) || []}
                isNew={p.isFeatured}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
