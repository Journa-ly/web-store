'use server';

import React from 'react';
import Link from 'next/link';
import { getTrendingDesigns } from '@/requests/server-designs';
import TrendingDesignsCarousel from './TrendingDesignsCarousel';

export default async function TrendingDesignsSection() {
  // Fetch trending designs directly using the server function
  const designs = await getTrendingDesigns(8); // Limit to 8 designs (2 rows of 4)

  return (
    <div className="px-4 py-4 md:px-8">
      <div className="w-full overflow-hidden rounded-3xl bg-[#22a1d8] bg-opacity-30 shadow-lg">
        <div className="px-4 py-12 md:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-6 text-3xl font-bold text-[#1F2937] md:text-4xl lg:text-5xl">
              Designs That Don't Suck
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-[#1F2937] text-white/90 md:text-xl">
              Sometimes other people have better ideas than you, and that's O.K. Buy them instead.
            </p>
          </div>

          {/* Trending Designs Display */}
          <div className="mb-12">
            <TrendingDesignsCarousel designs={designs} />
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link
              href="/designs/trending"
              className="btn btn-lg rounded-full border-none bg-white text-[#1F2937] hover:bg-white/90"
            >
              View All Designs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
