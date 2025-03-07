import { Product } from 'lib/shopify/types';

const ProductTitle = ({ product }: { product: Product }) => (
  <div className="flex flex-col">
    <h1 className="mb-2 text-3xl font-bold">{product.title}</h1>
  </div>
);

export default ProductTitle;
