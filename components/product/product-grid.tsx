// components/shopify/ProductGrid.tsx

import React from 'react';
import ProductCard, { ProductCardProps } from './product-card';

export interface ProductGridProps {
  products: ProductCardProps[];
  columns?: number; // default: 3
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, columns = 3 }) => {
  return (
    <div
      className={`grid gap-4`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
};

export default ProductGrid;
