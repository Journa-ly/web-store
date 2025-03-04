import React from 'react';
import Link from 'next/link';
import TrendingDesignsSection from './designs/TrendingDesignsSection';
import CustomerReviewsSection from './reviews/CustomerReviewsSection';
import CreationProcessSection from './creation/CreationProcessSection';
import BreakoutHeroSection from './hero/BreakoutHeroSection';
import HeroSection from './hero/HeroSection';
import { FeaturedProductsSection } from './product/FeaturedProductsSection';
import Stats from './stats';

export default function Homepage() {
  return (
    <div className="mx-auto">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Section */}
      <FeaturedProductsSection />

      {/* Trending Designs Section */}
      <TrendingDesignsSection />

      {/* Breakout Hero Section */}
      <BreakoutHeroSection />

      {/* Creation Process Section */}
      <CreationProcessSection />

      {/* Customer Reviews Section */}
      <CustomerReviewsSection />

      {/* Stats Section */}
      <Stats title="Our Stats Speak for Themselves" />

      {/* CTA Section */}
      <div className="bg-primary px-8 py-16 text-primary-content">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to create your own design?</h2>
          <p className="mb-8 text-xl">
            Join thousands of customers who have already created their one of a kind apparel.
          </p>
          <Link href="/designs/studio" className="btn btn-secondary btn-lg text-white">
            Start Designing Now
          </Link>
        </div>
      </div>
    </div>
  );
}
