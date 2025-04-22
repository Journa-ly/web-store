import Grid from 'components/grid';
import { Product } from 'lib/shopify/types';
import { ProductCard } from '../product/ProductCard';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <ProductCard
            product={{
              id: product.id,
              handle: product.handle,
              title: product.title,
              featuredImage: product.featuredImage,
              priceRange: {
                minVariantPrice: product.priceRange.minVariantPrice
              }
            }}
            cardHeight="h-[400px]"
            imageHeight="h-64"
          />
        </Grid.Item>
      ))}
    </>
  );
}
