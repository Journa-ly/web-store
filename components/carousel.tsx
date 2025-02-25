import { getCollectionProducts } from 'lib/shopify';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';

export async function Carousel({ collection }: { collection: string }) {
  // Collections that start with `hidden-*` are hidden from the search page.
  const products = await getCollectionProducts({ collection });

  if (!products?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="mask-fade-r absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
      <div className="mask-fade-l absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="hide-scrollbar relative w-full overflow-x-auto py-8">
        <ul className="animate-carousel flex gap-4">
          {carouselProducts.map((product, i) => (
            <li
              key={`${product.handle}${i}`}
              className="relative aspect-square max-h-[425px] w-[300px] flex-none"
            >
              <Link href={`/products/${product.handle}`} className="relative h-full w-full">
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount: product.priceRange.maxVariantPrice.amount,
                    currencyCode: product.priceRange.maxVariantPrice.currencyCode
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="200px"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
