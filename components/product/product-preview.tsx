import { Product } from '@/lib/shopify/types';
import Image from 'next/image';

function ProductPreview({ product }: { product: Product }) {
  const { title, featuredImage } = product;

  return (
    <div className="relative aspect-square max-w-full">
      {featuredImage ? (
        <Image
          src={featuredImage.url}
          alt={featuredImage.altText || title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover object-center transition-transform duration-200 group-hover:scale-105"
          priority={false}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200">
          <span className="text-gray-400">No image available</span>
        </div>
      )}
    </div>
  );
}

export default ProductPreview;
