import { Suspense } from 'react';
import DesignStudioContent from 'components/designStudio/DesignStudioContent';
import ProductCarousel from 'components/ProductCarousel';
import FAQ from 'components/FAQ';
import HowTo from 'components/HowTo';

export default async function StudioPage() {
  return (
    <>
      <div className="w-full">
        <div className="overflow-hidden rounded-2xl bg-white shadow">
          <div className="p-4 md:p-6 lg:p-8">
            <DesignStudioContent />
            <div className="pt-8">
              <Suspense
                fallback={<div className="h-[30vh] animate-pulse rounded-xl bg-gray-100" />}
              >
                <div className="mx-auto max-w-4xl">
                  <ProductCarousel collectionHandle="all" className="w-full md:max-w-none" />
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <HowTo />
      </div>
      <div className="mt-8">
        <FAQ />
      </div>
    </>
  );
}
