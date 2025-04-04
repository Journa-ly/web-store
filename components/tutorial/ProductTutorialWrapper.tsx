'use client';

import React, { ReactNode } from 'react';
import ProductTutorial from './ProductTutorial';

interface ProductTutorialWrapperProps {
  children: ReactNode;
}

const ProductTutorialWrapper: React.FC<ProductTutorialWrapperProps> = ({ children }) => {
  return (
    <>
      {children}
      <ProductTutorial />
    </>
  );
};

export default ProductTutorialWrapper; 