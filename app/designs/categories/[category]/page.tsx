'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ClipLoader } from 'react-spinners';
import DesignCard from '@/components/designs/DesignCard';
import { usePaginatedCategoryDesigns } from '@/requests/designs';
import { getCategory } from '@/requests/categories';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';

interface Category {
  uuid: string;
  name: string;
  description: string | null;
  priority: number;
  image_url: string | null;
  design_count: number;
}

function CategoryHeader({ category }: { category: Category | null }) {
  if (!category) return null;

  return (
    <div className="mb-8">
      <div className="relative mb-6 h-48 w-full overflow-hidden rounded-lg md:h-72">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 100vw"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-base-200">
            <span className="text-xl text-base-content/50">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg md:text-[4.5rem]">
            {category.name.toUpperCase()}
          </h1>
        </div>
      </div>
    </div>
  );
}

// export async function generateMetadata(props: {
//   params: Promise<{ category: string }>;
// }): Promise<Metadata> {
//   const params = await props.params;
//   const collection = await getCollection(params.collection);

//   if (!collection) return notFound();

//   return {
//     title: collection.seo?.title || collection.title,
//     description:
//       collection.seo?.description || collection.description || `${collection.title} products`
//   };
// }

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      const data = await getCategory(categoryId);
      setCategory(data);
    };
    fetchCategory();
  }, [categoryId]);

  const {
    designs,
    error,
    isLoadingMore,
    size,
    setSize,
    isEmpty,
    hasNextPage,
    isRefreshing
  } = usePaginatedCategoryDesigns(categoryId);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  });

  useEffect(() => {
    if (inView && hasNextPage && !isLoadingMore) {
      setSize((currentSize) => currentSize + 1);
    }
  }, [inView, hasNextPage, isLoadingMore, setSize]);

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-lg text-red-500">Failed to load category designs</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 pb-8">
      <CategoryHeader category={category} />
      
      {isEmpty ? (
        <p className="py-3 text-center text-lg">No designs found in this category</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {designs.map((design) => (
              <DesignCard key={design.uuid} design={design} />
            ))}
          </div>

          <div ref={ref} className="mt-8 flex items-center justify-center py-4">
            {(isLoadingMore || isRefreshing) && <ClipLoader color="#000000" size={40} />}
          </div>
        </>
      )}
    </section>
  );
}
