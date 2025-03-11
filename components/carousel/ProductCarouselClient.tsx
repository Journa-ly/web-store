'use client';

import { Product } from 'lib/shopify/types';
import { GridTileImage } from '../grid/tile';
import clsx from 'clsx';
import Link from 'next/link';
import ProductCard from '../product/ProductCard';

interface ProductCarouselClientProps {
  products: Product[];
  title?: string;
  className?: string;
}

export default function ProductCarouselClient({
  products,
  title,
  className
}: ProductCarouselClientProps) {
  if (!products.length) {
    return null;
  }

  return (
    <div className={clsx('w-full py-4', className)}>
      {title && <h2 className="mb-4 text-lg font-semibold text-base-content">{title}</h2>}
      <div className="relative">
        <div className="scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent flex w-full overflow-x-auto pb-8">
          <div className="flex gap-4">
            {products.map((product) => (
              <div key={product.id} className="w-[220px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
