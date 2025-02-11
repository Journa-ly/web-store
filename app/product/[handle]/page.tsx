import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AddToCart } from 'components/cart/add-to-cart';
import DesignForm from 'components/forms/generateForm';
import { GridTileImage } from 'components/grid/tile';
import NumberLabel from 'components/numberLabel';
import { Gallery } from 'components/product/gallery';
import { ProductProvider } from 'components/product/product-context';
import { ProductDescription } from 'components/product/product-description';
import ProductTitleWithPrice from 'components/product/productTitleWithPrice';
import { VariantSelector } from 'components/product/variant-selector';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct, getProductRecommendations } from 'lib/shopify';
import { Image } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';
import MyDesignsCarousel from 'components/carousel/MyDesignsCarousel';

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  console.log(product);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="mx-auto max-w-screen-2xl rounded-2xl shadow">
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
              <Gallery
                images={[product.featuredImage].map((image: Image) => ({
                  src: image.url,
                  altText: image.altText
                }))}
                useQueryParams={false}
                showDesignOverlay={true}
              />
              <VariantSelector options={product.options} variants={product.variants} />
              <div className="mt-4">
                <AddToCart product={product} />
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
                  useQueryParams={true}
                  showDesignOverlay={false}
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
      </div>
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link
              className="relative h-full w-full"
              href={`/product/${product.handle}`}
              prefetch={true}
            >
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
