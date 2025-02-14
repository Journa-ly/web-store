import { getCollectionProducts } from 'lib/shopify';
import ProductCarouselClient from './carousel/ProductCarouselClient';

interface ProductCarouselProps {
  collectionHandle: string;
  title?: string;
  className?: string;
}

export default async function ProductCarousel({
  collectionHandle,
  title,
  className
}: ProductCarouselProps) {
  const products = await getCollectionProducts({ collection: collectionHandle });

  if (!products.length) {
    return null;
  }

  return <ProductCarouselClient products={products} title={title} className={className} />;
}
