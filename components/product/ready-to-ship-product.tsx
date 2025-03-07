import { Product } from '@/lib/shopify/types';
import { Suspense } from 'react';
import { Image } from 'lib/shopify/types';
import { ProductDescription } from 'components/product/product-description';
import ProductTitleWithPrice from 'components/product/productTitleWithPrice';
import ProductTitle from 'components/product/product-title';
import PriceWithFreeShipping from 'components/product/price-with-free-shipping';
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
          {/* Mobile: Title appears at the top (without price) */}
          <div className="mb-6 block w-full px-4 lg:hidden">
            <ProductTitle product={product} />
          </div>

          {/* Left column: Gallery only */}
          <div className="w-full lg:w-1/2 lg:border-r">
            <div className="px-4 lg:px-10">
              <Gallery
                images={product.images.map((image: Image) => ({
                  src: image.url,
                  altText: image.altText
                }))}
              />
            </div>
          </div>

          {/* Mobile: Price and free shipping below gallery */}
          <div className="mb-4 mt-6 block w-full px-4 lg:hidden">
            <PriceWithFreeShipping product={product} />
          </div>

          {/* Right column: Title with price (desktop only), Variant selection, Add to cart, and Product description */}
          <div className="w-full px-4 lg:w-1/2 lg:pl-8">
            <div className="flex h-full flex-col justify-start">
              {/* Title with price only visible on desktop */}
              <div className="hidden w-full lg:block">
                <ProductTitleWithPrice product={product} />
              </div>
              <VariantSelector options={product.options} variants={product.variants} />
              <div className="mb-8 mt-4">
                <div className="w-2/3">
                  <AddToCart product={product} />
                </div>
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <ProductDescription product={product} />
              </div>
            </div>
          </div>
        </Suspense>
      </div>

      {/* Horizontal divider between sections */}
      <hr className="mx-4 my-4 border-t border-neutral-200" />
      <div className="flex flex-col rounded-lg bg-white lg:flex-row lg:gap-8">
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
