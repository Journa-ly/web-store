// components/shopify/ProductCard.tsx

import Button from 'components/library/button'; // from your UI library
import Card from 'components/library/card'; // from your UI library
import React from 'react';

export interface ProductCardProps {
  id: string;
  title: string;
  imageSrc?: string;
  price?: string;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, imageSrc, price, onAddToCart }) => {
  return (
    <Card className="p-4">
      <div className="card-body items-center text-center">
        {/* Product Image */}
        {imageSrc && <img src={imageSrc} alt={title} className="mb-2 h-48 w-48 object-cover" />}

        {/* Product Title */}
        <h2 className="card-title text-lg">{title}</h2>

        {/* Product Price */}
        {price && <p className="text-sm text-gray-500">{price}</p>}

        {/* Add to Cart */}
        {onAddToCart && (
          <Button variant="primary" size="sm" className="mt-2" onClick={onAddToCart}>
            Add to Cart
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
