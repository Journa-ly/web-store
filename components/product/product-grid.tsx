// components/shopify/ProductGrid.tsx

import React from 'react';
import { ProductCard, Product } from './ProductCard';

export interface ProductGridProps {
  products: Product[];
  columns?: number; // default: 3
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, columns = 3 }) => {
  return (
    <div
      className="grid gap-4 sm:gap-6 md:gap-8"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
