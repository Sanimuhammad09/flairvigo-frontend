import { createFileRoute } from '@tanstack/react-router';
import { HeroSection } from '@/features/home/components/HeroSection';
import { ShopByColor } from '@/features/home/components/ShopByColor';
import { ShopByCategory } from '@/features/home/components/ShopByCategory';
import { TheSetBanner } from '@/features/home/components/TheSetBanner';
import { PicksForYou } from '@/features/home/components/PicksForYou';
import { useSEO } from '@/hooks/useSEO';

export const Route = createFileRoute('/_shop/')({
  component: HomePage,
});

function HomePage() {
  useSEO({
    title: 'Flairvigo — Premium Medical Scrubs & Healthcare Workwear',
    description: 'Premium medical scrubs and healthcare workwear. Shop our collection of high-performance, stylish scrubs with custom embroidery options.',
  });

  return (
    <>
      <ShopByColor />
      <HeroSection />
      <ShopByCategory />
      <TheSetBanner />
      <PicksForYou />
    </>
  );
}
