import React, { useState, useCallback } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { Heart, Minus, Plus, ChevronRight, Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { ProductCard } from '@/components/common/ProductCard';
import { formatCurrency, colorMap } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useSEO } from '@/hooks/useSEO';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/_shop/products/$slug')({
  component: ProductDetailPage,
});

const mockProduct = {
  id: '1',
  name: 'Leon™ Three-Pocket Scrub Top',
  slug: 'leon-three-pocket-scrub-top',
  description:
    'Our bestselling scrub top. The Leon™ features a tailored fit with three functional pockets and is made from our proprietary FIONx™ fabric — antimicrobial, wrinkle-resistant, and ridiculously soft.',
  fabricDetails:
    '76% Polyester, 21% Rayon, 3% Spandex. FIONx™ antimicrobial technology. 4-way stretch. Wrinkle-resistant. Moisture-wicking.',
  careInstructions:
    'Machine wash cold, tumble dry low. Do not bleach. Do not iron directly on print.',
  basePrice: 48,
  category: { name: "Women's Scrubs", slug: 'women' },
  images: [
    { id: '1', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop', alt: 'Front view', isMain: true },
    { id: '2', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop', alt: 'Side view' },
    { id: '3', url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1200&auto=format&fit=crop', alt: 'Back view' },
    { id: '4', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop', alt: 'Detail view' },
  ],
  variants: [
    { id: 'v1', color: 'Navy', colorHex: '#1B2A4A', size: 'XS', inventory: 15, priceOffset: 0 },
    { id: 'v2', color: 'Navy', colorHex: '#1B2A4A', size: 'S', inventory: 22, priceOffset: 0 },
    { id: 'v3', color: 'Navy', colorHex: '#1B2A4A', size: 'M', inventory: 30, priceOffset: 0 },
    { id: 'v4', color: 'Navy', colorHex: '#1B2A4A', size: 'L', inventory: 18, priceOffset: 0 },
    { id: 'v5', color: 'Navy', colorHex: '#1B2A4A', size: 'XL', inventory: 10, priceOffset: 0 },
    { id: 'v6', color: 'Black', colorHex: '#111111', size: 'XS', inventory: 12, priceOffset: 0 },
    { id: 'v7', color: 'Black', colorHex: '#111111', size: 'S', inventory: 20, priceOffset: 0 },
    { id: 'v8', color: 'Black', colorHex: '#111111', size: 'M', inventory: 25, priceOffset: 0 },
    { id: 'v9', color: 'Black', colorHex: '#111111', size: 'L', inventory: 14, priceOffset: 0 },
    { id: 'v10', color: 'Burgundy', colorHex: '#722F37', size: 'S', inventory: 0, priceOffset: 0 },
    { id: 'v11', color: 'Burgundy', colorHex: '#722F37', size: 'M', inventory: 8, priceOffset: 0 },
  ],
  reviews: [
    { id: 'r1', rating: 5, title: 'Best scrubs ever!', content: 'So comfortable and they look amazing. The fit is perfect.', user: { firstName: 'Sarah', lastName: 'M.' } },
    { id: 'r2', rating: 4, title: 'Love the fabric', content: 'Great quality fabric. Runs slightly small so size up.', user: { firstName: 'Dr. James', lastName: 'K.' } },
  ],
};

const relatedProducts = [
  { id: '2', slug: 'zamora-jogger-scrub-pants', name: 'Zamora™ Jogger Scrub Pants', price: 58, images: [{ url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop' }, { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop' }], colors: [{ name: 'Navy', hex: colorMap.navy }] },
  { id: '3', slug: 'core-scrub-top-men', name: 'Core Scrub Top', price: 48, images: [{ url: 'https://images.unsplash.com/photo-1584982751601-97d883f51524?q=80&w=800&auto=format&fit=crop' }, { url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop' }], colors: [{ name: 'Black', hex: colorMap.black }] },
  { id: '4', slug: 'seamless-underscrub', name: 'Seamless Underscrub', price: 38, images: [{ url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop' }, { url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop' }], colors: [{ name: 'White', hex: colorMap.white }] },
  { id: '5', slug: 'premium-fleece-jacket', name: 'Premium Fleece Jacket', price: 98, images: [{ url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop' }, { url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop' }], colors: [{ name: 'Navy', hex: colorMap.navy }] },
];

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const product = mockProduct;

  useSEO({
    title: product.name,
    description: product.description,
  });

  const uniqueColors = Array.from(
    new Map(product.variants.map((v) => [v.color, { name: v.color, hex: v.colorHex || '#ccc' }])).values()
  );

  const [selectedColor, setSelectedColor] = useState(uniqueColors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');

  const availableSizes = product.variants
    .filter((v) => v.color === selectedColor)
    .map((v) => ({ size: v.size, inStock: v.inventory > 0 }));

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const price = product.basePrice + (selectedVariant?.priceOffset || 0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      color: selectedVariant.color,
      size: selectedVariant.size,
      price: product.basePrice + selectedVariant.priceOffset,
      image: product.images[0]?.url || '',
      quantity,
    });
    toast.success('Added to cart');
  };

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
      setActiveImageIndex(index);
    },
    [emblaApi]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container-premium py-4">
        <nav className="flex items-center gap-2 text-[12px] text-neutral-400">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link to={`/collections/${product.category.slug}`} className="hover:text-black transition-colors">
            {product.category.name}
          </Link>
          <ChevronRight size={10} />
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="container-premium pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Image Gallery */}
          <div>
            <div className="overflow-hidden mb-3 bg-neutral-100 aspect-[3/4]" ref={emblaRef}>
              <div className="flex h-full">
                {product.images.map((image) => (
                  <div key={image.id} className="flex-[0_0_100%] min-w-0 relative">
                    <img
                      src={image.url}
                      alt={image.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => scrollTo(index)}
                  className={`w-[72px] h-[72px] shrink-0 overflow-hidden border transition-colors ${
                    activeImageIndex === index ? 'border-black' : 'border-transparent hover:border-neutral-300'
                  }`}
                >
                  <img src={image.url} alt={image.alt || ''} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col lg:pt-2">
            {/* Badge */}
            <span className="text-[9px] font-bold tracking-[0.12em] uppercase bg-black text-white px-2 py-1 w-fit mb-4">
              Best Seller
            </span>

            <h1 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight text-black mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={13} className="text-black fill-black" />
                ))}
              </div>
              <span className="text-[13px] text-neutral-500">
                {product.reviews.length} reviews
              </span>
            </div>

            <p className="text-xl font-semibold text-black mb-5">
              {formatCurrency(price)}
            </p>

            <p className="text-[14px] text-neutral-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <p className="text-[12px] font-semibold tracking-[0.1em] uppercase text-neutral-500 mb-3">
                Color — <span className="text-black">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {uniqueColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setSelectedSize('');
                    }}
                    className={`w-8 h-8 rounded-full p-[2px] transition-all ${
                      selectedColor === color.name
                        ? 'ring-2 ring-black ring-offset-2'
                        : 'hover:ring-1 hover:ring-neutral-300 hover:ring-offset-1'
                    }`}
                    title={color.name}
                  >
                    <span
                      className="block w-full h-full rounded-full border border-neutral-200"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] font-semibold tracking-[0.1em] uppercase text-neutral-500">
                  Size {selectedSize && `— ${selectedSize}`}
                </p>
                <Link to="/fit-finder" className="text-[12px] text-neutral-500 underline underline-offset-2 hover:text-black transition-colors">
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(({ size, inStock }) => (
                  <button
                    key={size}
                    onClick={() => inStock && setSelectedSize(size)}
                    disabled={!inStock}
                    className={`min-w-[48px] px-4 py-2.5 text-[13px] font-medium border transition-colors ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : inStock
                          ? 'border-neutral-200 text-black hover:border-black'
                          : 'border-neutral-100 text-neutral-300 cursor-not-allowed line-through'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            {selectedVariant && selectedVariant.inventory > 0 && (
              <div className="mb-6">
                <p className="text-[12px] font-semibold tracking-[0.1em] uppercase text-neutral-500 mb-3">
                  Quantity
                </p>
                <div className="flex items-center border border-neutral-200 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-neutral-500 hover:text-black transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-5 py-3 text-[13px] font-medium text-black min-w-[48px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-neutral-500 hover:text-black transition-colors"
                    disabled={quantity >= selectedVariant.inventory}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart & Wishlist */}
            <div className="flex gap-3 mb-8">
              <button
                className={`flex-1 text-[12px] font-bold tracking-[0.1em] uppercase py-4 transition-colors ${
                  !selectedSize || (selectedVariant && selectedVariant.inventory <= 0)
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
                disabled={!selectedSize || (selectedVariant !== undefined && selectedVariant.inventory <= 0)}
                onClick={handleAddToCart}
              >
                {!selectedSize
                  ? 'Select a Size'
                  : selectedVariant?.inventory === 0
                    ? 'Out of Stock'
                    : 'Add to Bag'}
              </button>
              <button
                className="px-4 border border-neutral-200 text-black hover:border-black transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-5 border-t border-neutral-100">
              <div className="flex flex-col items-center text-center gap-1.5">
                <Truck size={18} strokeWidth={1.5} />
                <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-500">
                  Free Shipping
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <RotateCcw size={18} strokeWidth={1.5} />
                <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-500">
                  Easy Returns
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <Shield size={18} strokeWidth={1.5} />
                <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-500">
                  Secure Checkout
                </span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-neutral-100 mt-2">
              {[
                { key: 'description', title: 'Description', content: product.description },
                {
                  key: 'fabric',
                  title: 'Fabric & Care',
                  content: `${product.fabricDetails}\n\n${product.careInstructions}`,
                },
                {
                  key: 'shipping',
                  title: 'Shipping & Returns',
                  content:
                    'Free standard shipping on orders over $50. Express shipping available. 30-day hassle-free returns on all unworn items with tags attached.',
                },
              ].map((section) => (
                <div key={section.key} className="border-b border-neutral-100">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === section.key ? null : section.key)
                    }
                    className="flex items-center justify-between w-full py-4 text-[13px] font-semibold text-black"
                  >
                    {section.title}
                    <Plus
                      size={14}
                      className={`transition-transform duration-200 ${
                        openAccordion === section.key ? 'rotate-45' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openAccordion === section.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[13px] text-neutral-600 leading-relaxed pb-4 whitespace-pre-line">
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
      </section>

      {/* Reviews Section */}
      <section className="border-t border-neutral-100 py-16">
        <div className="container-premium">
          <h2 className="font-heading font-bold text-2xl tracking-tight text-black mb-8">
            Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {product.reviews.map((review) => (
              <div key={review.id} className="p-6 border border-neutral-100">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < review.rating ? 'text-black fill-black' : 'text-neutral-200'}
                    />
                  ))}
                </div>
                <h4 className="font-semibold text-[14px] text-black mb-2">{review.title}</h4>
                <p className="text-[13px] text-neutral-600 mb-3">{review.content}</p>
                <p className="text-[12px] text-neutral-400">
                  — {review.user.firstName} {review.user.lastName}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="border-t border-neutral-100 py-16 bg-neutral-50">
        <div className="container-premium">
          <h2 className="font-heading font-bold text-2xl tracking-tight text-black mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
