import Prose from 'components/prose';
import { Product } from 'lib/shopify/types';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      {product.descriptionHtml ? (
        <Prose className="mb-6 text-sm leading-tight" html={product.descriptionHtml} />
      ) : null}
    </>
  );
}
