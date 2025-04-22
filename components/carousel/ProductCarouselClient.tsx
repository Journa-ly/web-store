'use client';

import { Product } from 'lib/shopify/types';
import clsx from 'clsx';
import ProductCard from '../product/ProductCard';

interface ProductCarouselClientProps {
  products: Product[];
  title?: string;
  className?: string;
  size?: 'default' | 'small';
}

export default function ProductCarouselClient({
  products,
  title,
  className,
  size = 'default'
}: ProductCarouselClientProps) {
  if (!products.length) {
    return null;
  }

  // Calculate dimensions based on size
  const cardWidth = size === 'small' ? 'w-[176px]' : 'w-[220px]'; // 20% smaller for small size
  const imageHeight = size === 'small' ? 'h-40' : 'h-64'; // Even smaller for small size
  const cardHeight = size === 'small' ? 'h-56' : 'h-full'; // Explicit height constraint for small size
  const className2 = size === 'small' ? 'text-xs sm:text-xs' : ''; // Smaller text for small size

  return (
    <div className={clsx('mx-auto', className)}>
      {title && <h2 className="mb-4 text-lg font-semibold text-base-content">{title}</h2>}
      <div>
        <div className="hide-scrollbar flex overflow-x-auto py-8">
          <div className="flex gap-4">
            {products.map((product) => (
              <div key={product.id} className={clsx(cardWidth, 'flex-shrink-0')}>
                <ProductCard
                  product={product}
                  imageHeight={imageHeight}
                  cardHeight={cardHeight}
                  className={className2}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
