'use client';

import DesignForm from 'components/forms/generateForm';
import { Suspense } from 'react';
import DesignStudioCarousel from 'components/carousel/DesignStudioCarousel';
import NumberLabel from 'components/numberLabel';
import Image from 'next/image';
import { useDesign } from 'components/designs/design-context';
import { ClipLoader } from 'react-spinners';

export default function DesignStudioContent() {
  const { selectedDesign } = useDesign();
  const imageUrl = selectedDesign?.product_image?.image;
  const isGenerating = !Boolean(imageUrl);

  // Preview content component to avoid duplication
  const DesignPreview = () => (
    <div className="relative flex aspect-square h-full max-h-[650px] w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
      {selectedDesign ? (
        isGenerating ? (
          <div className="flex flex-col items-center gap-3">
            <ClipLoader color="#6B7280" size={32} />
            <p className="text-sm text-gray-600">Generating design...</p>
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={selectedDesign.name || 'Selected Design'}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <p className="px-8 text-center text-gray-500">Loading design preview...</p>
        )
      ) : (
        <p className="px-8 text-center text-gray-500">
          Select a design to preview it here
        </p>
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-col lg:gap-8">
      {/* Design Form Section */}
      <div className="flex w-full flex-col lg:flex-row lg:gap-8">
        {/* Left Column - Design Form */}
        <div className="w-full lg:w-1/2">
          <p className="mt-2 text-gray-600">Create your custom design with AI</p>

          <div className="mt-8">
            <NumberLabel label="Describe your design">1</NumberLabel>
            <div className="w-full">
              <DesignForm />
            </div>
          </div>
        </div>

        {/* Right Column - Preview (visible only on desktop) */}
        <div className="mt-8 hidden w-full lg:mt-0 lg:block lg:w-1/2">
          <div className="sticky top-8">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[650px] w-full overflow-hidden rounded-2xl bg-gray-100" />
              }
            >
              <DesignPreview />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Full Width Design Selection Section */}
      <div className="w-full">
        <NumberLabel label="Select a design">2</NumberLabel>
        <div className="w-full">
          <DesignStudioCarousel />
        </div>
      </div>

      {/* Mobile Preview Section (below carousel, only visible on mobile) */}
      <div className="my-8 block w-full lg:hidden">
        <div className="w-full">
          <Suspense
            fallback={
              <div className="relative aspect-square h-full max-h-[650px] w-full overflow-hidden rounded-2xl bg-gray-100" />
            }
          >
            <DesignPreview />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
