import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { Sparkles, Heart, Globe2, Leaf } from 'lucide-react';

export const Route = createFileRoute('/_shop/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-charcoal text-white py-24 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Designed for Those Who Care
          </h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Flairvigo was born from a simple idea: healthcare professionals deserve workwear 
            that looks as good as they feel. We combine premium fabrics, thoughtful design, 
            and sustainable practices to create scrubs you'll actually love wearing.
          </p>
        </div>
      </section>

      {/* Mission */}
      <ScrollReveal>
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 mb-4 block">
                Our Mission
              </span>
              <h2 className="text-3xl font-bold text-charcoal mb-6">
                Elevating the Standard of Medical Workwear
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-6">
                We believe that what you wear to work shouldn't be an afterthought. Every stitch, 
                every pocket placement, every fabric choice is intentional — crafted from feedback 
                from thousands of healthcare workers across the globe.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                From operating rooms to outpatient clinics, our goal is to make you feel confident, 
                comfortable, and ready for anything your shift throws at you.
              </p>
            </div>
            <div className="bg-neutral-100 aspect-[4/5] rounded-sm flex items-center justify-center overflow-hidden">
              <img src="/images/hero.png" alt="Mission" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Values */}
      <ScrollReveal>
        <section className="py-20 px-6 bg-ivory">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-charcoal mb-4">What Drives Us</h2>
              <p className="text-neutral-500 max-w-xl mx-auto">
                Our core values shape every decision, from design to delivery.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Sparkles, title: 'Quality First', desc: 'Premium anti-wrinkle, moisture-wicking fabrics built to last through hundreds of washes.' },
                { icon: Heart, title: 'Human-Centered', desc: 'Every product is designed with input from real healthcare workers in real clinical settings.' },
                { icon: Globe2, title: 'Inclusive Design', desc: 'Sizes XS to 3XL, multiple fits, and a palette that celebrates every skin tone.' },
                { icon: Leaf, title: 'Sustainability', desc: 'Recycled packaging, ethical manufacturing, and a garment take-back program.' },
              ].map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="bg-white p-6 rounded-sm border border-neutral-100 shadow-sm">
                    <div className="w-12 h-12 bg-charcoal text-white rounded-full flex items-center justify-center mb-4">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-bold text-charcoal mb-2">{value.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">{value.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Team / CTA */}
      <ScrollReveal>
        <section className="py-20 px-6 bg-charcoal text-white">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6">Join the Flairvigo Community</h2>
            <p className="text-neutral-300 mb-8 leading-relaxed">
              Over 50,000 healthcare professionals trust Flairvigo for their daily workwear. 
              Join them and experience the difference premium design makes.
            </p>
            <a
              href="/"
              className="inline-block bg-white text-charcoal font-bold px-8 py-4 rounded-sm hover:bg-neutral-100 transition-colors"
            >
              Shop the Collection
            </a>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
