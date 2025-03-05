import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCollectionProducts } from '../../lib/shopify';

// Define the Product type based on what we need
type Product = {
  id: string;
  handle: string;
  title: string;
  featuredImage: {
    url: string;
    altText: string;
    width: number;
    height: number;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

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
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
            >
              {/* Card Image with Hover Effect */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Simplified Card Content */}
              <div className="flex h-[100px] flex-col p-4 sm:p-6">
                <h3 className="mb-2 sm:mb-3 line-clamp-3 text-xs sm:text-sm font-medium text-gray-800">
                  {product.title}
                </h3>
                <div className="mt-auto pt-1">
                  <span className="text-base sm:text-lg font-semibold text-secondary">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.priceRange.minVariantPrice.currencyCode,
                      minimumFractionDigits: 0
                    }).format(parseFloat(product.priceRange.minVariantPrice.amount))}
                  </span>
                </div>
              </div>
            </Link>
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
