'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ClipLoader } from 'react-spinners';
import DesignCard from '@/components/designs/DesignCard';
import { usePaginatedCategoryDesigns } from '@/requests/designs';

interface CategoryDesignListProps {
  categoryId: string;
}

export function CategoryDesignList({ categoryId }: CategoryDesignListProps) {
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

  return isEmpty ? (
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
  );
} 