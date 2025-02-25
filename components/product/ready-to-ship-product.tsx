import { Product } from '@/lib/shopify/types';
import { Suspense } from 'react';
import { Image } from 'lib/shopify/types';
import { ProductDescription } from 'components/product/product-description';
import ProductTitleWithPrice from 'components/product/productTitleWithPrice';
import { VariantSelector } from 'components/product/variant-selector';
import { Gallery } from 'components/product/gallery';
import { AddToCart } from 'components/cart/add-to-cart';
import RelatedProducts from 'components/product/related-products';

export default function ReadyToShipProduct({ product }: { product: Product }) {
  return (
    <>
      <div className="flex flex-col border-neutral-200 pt-8 lg:flex-row">
        <Suspense
          fallback={
            <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
          }
        >
          {/* Product description container */}
          <div className="w-full px-4 lg:w-1/2">
            <div className="w-full">
              <ProductTitleWithPrice product={product} />
            </div>
            <ProductDescription product={product} />
            <VariantSelector options={product.options} variants={product.variants} />
            <div className="mt-4">
              <AddToCart product={product} />
            </div>
          </div>
          {/* Gallery container */}
          <div className="w-full lg:w-1/2 lg:border-r">
            <div className="px-10">
              <Gallery
                images={product.images.map((image: Image) => ({
                  src: image.url,
                  altText: image.altText
                }))}
              />
            </div>
          </div>
        </Suspense>
      </div>
      <div className="flex flex-col rounded-lg bg-white p-8 md:p-12 lg:flex-row lg:gap-8">
        <div className="h-full w-full basis-full lg:basis-1/2">
          <Suspense
            fallback={
              <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
            }
          ></Suspense>
        </div>
      </div>
      <RelatedProducts id={product.id} />
    </>
  );
}
