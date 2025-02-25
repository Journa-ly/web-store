import { Product } from '@/lib/shopify/types';
import { Suspense } from 'react';
import MyDesignsCarousel from 'components/carousel/MyDesignsCarousel';
import FAQ from 'components/FAQ';
import HowTo from 'components/HowTo';
import ProductPreview from '@/components/product/product-preview';
import { Image } from 'lib/shopify/types';
import { ProductDescription } from 'components/product/product-description';
import ProductTitleWithPrice from 'components/product/productTitleWithPrice';
import { VariantSelector } from 'components/product/variant-selector';
import NumberLabel from 'components/numberLabel';
import { Gallery } from 'components/product/gallery';
import { AddToCart } from 'components/cart/add-to-cart';
import DesignForm from 'components/forms/generateForm';
import RelatedProducts from 'components/product/related-products';

export default function TemplateProduct({ product }: { product: Product }) {
  return (
    <>
      <div className="flex flex-col rounded-lg bg-white p-8 md:p-12 lg:flex-row lg:gap-8">
        <div className="w-full lg:w-1/2 lg:max-w-xl">
          <ProductTitleWithPrice product={product} />
          <div className="w-full">
            <NumberLabel label="Describe your design">1</NumberLabel>
            <DesignForm />
            <NumberLabel label="Select a design">2</NumberLabel>
            <div className="w-full overflow-hidden">
              <MyDesignsCarousel />
            </div>
          </div>
        </div>
        <div className="h-full w-full basis-full lg:basis-1/2">
          <Suspense
            fallback={
              <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
            }
          >
            <ProductPreview product={product} />
            <div className="mt-8">
              <NumberLabel label="Add to cart">3</NumberLabel>
            </div>
            <VariantSelector options={product.options} variants={product.variants} />
            <div className="mt-4">
              <AddToCart product={product} selectedDesignRequired />
            </div>
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col border-t border-neutral-200 pt-8 lg:flex-row">
        <Suspense
          fallback={
            <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
          }
        >
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
          {/* Product description container */}
          <div className="w-full px-4 lg:w-1/2">
            <ProductDescription product={product} />
          </div>
        </Suspense>
      </div>
      <RelatedProducts id={product.id} />
      <div className="border-t border-neutral-200">
        <HowTo />
      </div>
      <div className="border-t border-neutral-200">
        <FAQ />
      </div>
    </>
  );
}
