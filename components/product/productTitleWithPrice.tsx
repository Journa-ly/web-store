import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import FreeShipping from './free-shipping';

const ProductTitleWithPrice = ({ product }: { product: Product }) => (
  <div className="flex flex-col pb-1">
    <h1 className="text-3xl font-bold">{product.title}</h1>
    <div className="flex items-center">
      <div className="mr-1 w-auto py-2 pr-2 text-xl text-secondary font-semibold">
        <Price
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
        />
      </div>
      <div className="flex items-center">
        <FreeShipping />
      </div>
    </div>
  </div>
);

export default ProductTitleWithPrice;
