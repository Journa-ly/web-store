'use server';

import React from 'react';
import Link from 'next/link';
import { getTrendingDesigns } from '@/requests/server-designs';
import TrendingDesignsCarousel from './TrendingDesignsCarousel';

export default async function TrendingDesignsSection() {
  // Fetch trending designs directly using the server function
  const designs = await getTrendingDesigns(10); // Limit to 10 designs (2 rows of 5)

  return (
    <div className="px-4 py-4 md:px-8">
      <div className="w-full overflow-hidden rounded-3xl bg-neutral shadow-lg">
        <div className="px-4 py-12 md:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-6 text-3xl font-black md:text-4xl lg:text-5xl">
              Designs That Don't Suck.
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl">
              Browse trending community designs.
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
              className="btn btn-outline gap-2 rounded-full border-gray-300 bg-white px-8 text-gray-800 transition-colors duration-300 hover:border-secondary hover:bg-secondary hover:text-white"
            >
              <span>View All Designs</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
