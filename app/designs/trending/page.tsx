'use client';

import { usePaginatedTrendingDesigns } from '@/requests/designs';
import { ClipLoader } from 'react-spinners';
import DesignCard from '@/components/designs/DesignCard';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import TrendingTutorial from '@/components/tutorial/TrendingTutorial';
import { Metadata } from 'next';

// export function generateMetadata(): Metadata {
//   return {
//     title: 'Shop our trending designs',
//     description: 'Shop our trending designs'
//   };
// }

export default function TrendingPage() {
  const { trendingDesigns, isLoading, isError, size, setSize, hasNextPage, isLoadingMore } =
    usePaginatedTrendingDesigns();

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  });

  useEffect(() => {
    if (inView && hasNextPage && !isLoadingMore) {
      setSize((currentSize) => currentSize + 1);
    }
  }, [inView, hasNextPage, isLoadingMore, setSize]);

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-lg text-red-500">Failed to load trending designs</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 pb-8">
      <h1 className="mb-8 text-3xl font-bold">Trending Designs</h1>

      {trendingDesigns.length === 0 && !isLoading ? (
        <p className="py-3 text-center text-lg">No trending designs found</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {trendingDesigns.map((design, index) => (
              <DesignCard
                key={design.uuid}
                design={design}
                id={index === 0 ? 'first-trending-design' : undefined}
              />
            ))}
          </div>

          <div ref={ref} className="mt-8 flex items-center justify-center py-4">
            {(isLoading || isLoadingMore) && <ClipLoader color="#000000" size={40} />}
          </div>
        </>
      )}

      {/* Tutorial component */}
      <TrendingTutorial />
    </section>
  );
}
