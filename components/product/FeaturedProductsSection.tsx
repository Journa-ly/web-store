import React from 'react';
import Link from 'next/link';
import { getCollectionProducts } from '../../lib/shopify';
import { ProductCard, Product } from './ProductCard';

// This component will be rendered on the server
export async function FeaturedProductsSection() {
  // Fetch products from the "ready-to-ship" collection
  const allProducts = await getCollectionProducts({
    collection: 'ready-to-ship'
  });

  // Limit to 8 products
  const products = allProducts.slice(0, 8);

  return (
    <div className="px-4 pt-2 pb-16 md:py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12">
          <div className="w-full card pb-6 text-center">
            <span className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-70 shadow-[0_4px_6px_-1px_rgba(236,72,153,0.5)]"></span>
          </div>
        </div>

        {/* Product Cards Grid - Simplified Design */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {/* Show all products on all screen sizes */}
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/collections/ready-to-ship"
            className="btn btn-outline gap-2 rounded-full border-gray-300 px-8 text-gray-800 transition-colors duration-300 hover:border-secondary hover:bg-secondary hover:text-white"
          >
            <span>View All Products</span>
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
  );
}

export default FeaturedProductsSection;
