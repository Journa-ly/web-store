import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductProvider } from 'components/product/product-context';
import { HIDDEN_PRODUCT_TAG, PRODUCT_TYPES } from 'lib/constants';
import { getProduct } from 'lib/shopify';
import TemplateProduct from '@/components/product/template-product';
import ReadyToShipProduct from '@/components/product/ready-to-ship-product';
import ProductTutorialWrapper from '@/components/tutorial/ProductTutorialWrapper';
// import { getDesign } from '@/requests/designs';

export async function generateMetadata(props: {
  params: Promise<{ handle: string; design: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);
  // const design = await getDesign(params.design);
  // const designImage = design?.product_image?.image

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
              url: url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

  console.log('product: ', product);

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
      <div>
        <ProductTutorialWrapper>
          {product.productType === PRODUCT_TYPES.readyToShip ? (
            <ReadyToShipProduct product={product} />
          ) : (
            <TemplateProduct product={product} />
          )}
        </ProductTutorialWrapper>
      </div>
    </ProductProvider>
  );
}
