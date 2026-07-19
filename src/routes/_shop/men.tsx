import { createFileRoute } from '@tanstack/react-router';
import { HeroSection } from '../../features/shop/components/HeroSection';
import { CategoryNavCarousel } from '../../features/shop/components/CategoryNavCarousel';
import { ProductCarousel } from '../../features/shop/components/ProductCarousel';
import { ShopByColor } from '../../features/shop/components/ShopByColor';
import { Product } from '../../features/shop/components/ProductCard';

export const Route = createFileRoute('/_shop/men')({
  component: MenHomePage,
});

const MOCK_CATEGORIES = [
  { id: '1', name: 'Scrub Tops', slug: 'scrub-tops', imageUrl: 'https://images.unsplash.com/photo-1620857321285-8f6fc6e23db9?auto=format&fit=crop&q=80&w=300' },
  { id: '2', name: 'Scrub Pants', slug: 'scrub-pants', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=300' },
  { id: '3', name: 'Outerwear', slug: 'outerwear', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=300' },
  { id: '4', name: 'Underscrubs', slug: 'underscrubs', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=300' },
];

const MOCK_BEST_SELLERS: Product[] = [
  {
    id: 'p1m',
    name: 'Leon™ Two-Pocket Scrub Top',
    slug: 'leon-two-pocket',
    basePrice: 38,
    categoryName: 'Scrub Tops',
    imageUrl: 'https://images.unsplash.com/photo-1620857321285-8f6fc6e23db9?auto=format&fit=crop&q=80&w=600',
    variants: [
      { id: 'v1', color: 'Navy', colorHex: '#0F172A' },
      { id: 'v2', color: 'Black', colorHex: '#000000' },
      { id: 'v6', color: 'Graphite', colorHex: '#3F3F46' },
    ]
  },
  {
    id: 'p2m',
    name: 'Tansen™ Jogger Scrub Pants',
    slug: 'tansen-jogger',
    basePrice: 48,
    categoryName: 'Scrub Pants',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
    variants: [
      { id: 'v1', color: 'Navy', colorHex: '#0F172A' },
      { id: 'v2', color: 'Black', colorHex: '#000000' },
    ]
  },
  {
    id: 'p3m',
    name: 'Mac™ Scrub Jacket',
    slug: 'mac-scrub-jacket',
    basePrice: 68,
    categoryName: 'Outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
    variants: [
      { id: 'v1', color: 'Navy', colorHex: '#0F172A' },
      { id: 'v2', color: 'Black', colorHex: '#000000' },
    ]
  },
  {
    id: 'p4m',
    name: 'Cairo™ Cargo Scrub Pants',
    slug: 'cairo-cargo',
    basePrice: 48,
    categoryName: 'Scrub Pants',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
    variants: [
      { id: 'v1', color: 'Navy', colorHex: '#0F172A' },
      { id: 'v2', color: 'Black', colorHex: '#000000' },
      { id: 'v5', color: 'Hunter Green', colorHex: '#14532D' },
    ]
  },
];

const MOCK_COLORS = [
  { id: 'c1', name: 'Navy', hex: '#0F172A', imageUrl: 'https://images.unsplash.com/photo-1620857321285-8f6fc6e23db9?auto=format&fit=crop&q=80&w=400' },
  { id: 'c2', name: 'Black', hex: '#000000', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=400' },
  { id: 'c5', name: 'Hunter Green', hex: '#14532D', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400' },
  { id: 'c6', name: 'Graphite', hex: '#3F3F46', imageUrl: 'https://images.unsplash.com/photo-1620857321285-8f6fc6e23db9?auto=format&fit=crop&q=80&w=400' },
];

function MenHomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection
        title="Men's Core Scrubs"
        subtitle="Uncompromising comfort and utility."
        imageUrl="https://images.unsplash.com/photo-1620857321285-8f6fc6e23db9?auto=format&fit=crop&q=80&w=2000"
        ctaText="Shop All Men's"
        ctaLink="/collections/men"
      />

      {/* Category Navigation */}
      <CategoryNavCarousel categories={MOCK_CATEGORIES} baseUrl="/collections/men" />

      {/* Best Sellers Product Carousel */}
      <ProductCarousel
        title="Best Sellers"
        products={MOCK_BEST_SELLERS}
        viewAllLink="/collections/men"
      />

      <div className="py-8">
        <HeroSection
          title="New Arrivals"
          subtitle="Refresh your rotation."
          imageUrl="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=2000"
          ctaText="Shop New Arrivals"
          ctaLink="/collections/new-arrivals"
        />
      </div>

      <ShopByColor colors={MOCK_COLORS} />

      <ProductCarousel
        title="Top Rated"
        products={[...MOCK_BEST_SELLERS].reverse()}
        viewAllLink="/collections/men"
      />
    </div>
  );
}
