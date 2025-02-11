import Price from 'components/price';
import { Product } from 'lib/shopify/types';

const ProductTitleWithPrice = ({ product }: { product: Product }) => (
  <div className="flex flex-col pb-6">
    <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
    <div className="mr-auto w-auto rounded-full bg-neutral p-2 text-sm text-white">
      <Price
        amount={product.priceRange.maxVariantPrice.amount}
        currencyCode={product.priceRange.maxVariantPrice.currencyCode}
      />
    </div>
  </div>
);

export default ProductTitleWithPrice;
