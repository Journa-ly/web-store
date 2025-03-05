import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define the Product type
export type Product = {
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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
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
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <h3 className="mb-2 sm:mb-3 line-clamp-2 text-xs sm:text-sm font-medium text-gray-800">
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
  );
}

export default ProductCard; 