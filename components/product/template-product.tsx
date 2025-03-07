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
import DesignPreview from '../designs/DesignPreview';

export default function TemplateProduct({ product }: { product: Product }) {
  return (
    <>
      <div className="flex flex-col rounded-lg bg-white p-8 md:p-12 lg:flex-row lg:gap-8 lg:pr-8">
        {/* Left Column - Title, Price, Design Form, Add to Cart */}
        <div className="w-full lg:w-1/2">
          <div className="mb-2">
            <ProductTitleWithPrice product={product} />
          </div>

          {/* Product Preview - Visible only on mobile */}
          <div className="mb-8 w-full lg:hidden">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-lg bg-gray-100" />
              }
            >
              <div className="h-full w-full">
                <ProductPreview product={product} />
              </div>
            </Suspense>
          </div>

          <div className="mb-8 w-full">
            <NumberLabel label="Describe your design">1</NumberLabel>
            <DesignForm />
            <NumberLabel label="Select a design">2</NumberLabel>
            <div className="w-full overflow-hidden">
              <MyDesignsCarousel />
            </div>
          </div>

          <div className="w-full">
            <div className="mb-4 w-full">
              <NumberLabel label="Add to cart">3</NumberLabel>
            </div>
            <VariantSelector options={product.options} variants={product.variants} />
            <div className="mt-4">
              <AddToCart product={product} selectedDesignRequired />
            </div>
          </div>
        </div>

        {/* Right Column - Product Preview (visible only on desktop) */}
        <div className="hidden w-full lg:block lg:w-1/2">
          <Suspense
            fallback={
              <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-lg bg-gray-100" />
            }
          >
            <div className="h-full w-full">
              <ProductPreview product={product} />
            </div>
            {/* <div className="relative aspect-square max-w-full">
              <DesignPreview
                templateImageUrl={product.featuredImage?.url}
                designImageUrl={"https://journatest.blob.core.windows.net/media/local/images/GeneratedImage/c1db8bb1-5308-4283-a01c-3fbde6625279/image_1739425262.jpeg"}
                templateWidth={1000}
                templateHeight={1000}
                printAreaWidth={360}
                printAreaHeight={360}
                printAreaTop={270}
                printAreaLeft={320}
                isTemplateOnFront={false}
              />
            </div> */}
          </Suspense>
        </div>
      </div>

      {/* Gallery and Description Section */}
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

      {/* Related Products Section */}
      <RelatedProducts id={product.id} />

      {/* How To Section */}
      <div className="border-t border-neutral-200">
        <HowTo />
      </div>

      {/* FAQ Section */}
      <div className="border-t border-neutral-200">
        <FAQ />
      </div>
    </>
  );
}
