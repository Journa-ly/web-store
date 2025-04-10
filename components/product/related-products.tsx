import { getProductRecommendations } from '@/lib/shopify';
import { ProductCard } from './ProductCard';

export default async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 ml-5 text-2xl font-bold">Related Products</h2>
      <ul className="flex max-w-5xl gap-8 overflow-x-auto pb-12 pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="h-auto w-full flex-none min-[475px]:w-1/2 sm:w-1/3 lg:w-1/4"
          >
            <div className="h-full w-full">
              <ProductCard
                product={{
                  id: product.id,
                  handle: product.handle,
                  title: product.title,
                  featuredImage: {
                    url: product.featuredImage.url,
                    altText: product.featuredImage.altText,
                    width: product.featuredImage.width,
                    height: product.featuredImage.height
                  },
                  priceRange: {
                    minVariantPrice: product.priceRange.minVariantPrice
                  }
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
