import { Suspense } from 'react';
import DesignStudioContent from 'components/designStudio/DesignStudioContent';
import ProductCarousel from 'components/ProductCarousel';

interface StudioPageProps {
  searchParams: { selected?: string };
}

export default async function StudioPage({ searchParams }: StudioPageProps) {
  const params = await searchParams;
  const selectedDesignId = params.selected;

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <div className="p-4 md:p-6 lg:p-8">
          <DesignStudioContent initialSelectedDesign={selectedDesignId} />
          <div className="pt-8">
            <Suspense fallback={<div className="h-[30vh] animate-pulse rounded-xl bg-gray-100" />}>
              <div className="mx-auto max-w-4xl">
                <ProductCarousel
                  collectionHandle="apparel"
                  className="w-full max-w-[calc(100vw-350px)] md:max-w-none"
                />
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
