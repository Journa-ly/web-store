'use client';

import DesignForm from 'components/forms/generateForm';
import { Suspense } from 'react';
import DesignStudioCarousel from 'components/carousel/DesignStudioCarousel';
import NumberLabel from 'components/numberLabel';
import Image from 'next/image';
import { useDesign } from 'components/designs/design-context';
import { ClipLoader } from 'react-spinners';
import { LiveStream } from '@/requests/livestreams';

export default function StreamDesignStudio({ livestream }: { livestream: LiveStream }) {
  const { selectedDesign } = useDesign();
  const imageUrl = selectedDesign?.product_image?.image;
  const isGenerating = !Boolean(imageUrl);

  return (
    <div className="flex w-full flex-col">
      {/* Design Form and Preview Section */}
      <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-10">
        {/* Left Column - Design Form and Carousel */}
        <div className="flex w-full flex-col space-y-4 lg:w-1/2">
          {/* Step 1: Design Form */}
          <div>
            <NumberLabel label="Describe your design">1</NumberLabel>
            <div className="mt-2 w-full">
              <DesignForm livestream={livestream} />
            </div>
          </div>

          {/* Step 2: Design Selection - Now in the left column */}
          <div>
            <NumberLabel label="Select a design">2</NumberLabel>
            <div className="mt-2 w-full">
              <DesignStudioCarousel />
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="mt-8 w-full lg:mt-0 lg:w-1/2">
          <div className="sticky top-8">
            <Suspense
              fallback={
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100" />
              }
            >
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                {selectedDesign ? (
                  isGenerating ? (
                    <div className="flex flex-col items-center gap-3">
                      <ClipLoader color="#6B7280" size={32} />
                      <p className="text-sm text-gray-600">Generating design...</p>
                    </div>
                  ) : imageUrl ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={imageUrl}
                        alt={selectedDesign.name || 'Selected Design'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  ) : (
                    <p className="px-8 text-center text-gray-500">Loading design preview...</p>
                  )
                ) : (
                  <p className="px-8 text-center text-gray-500">
                    Select a design to preview it here
                  </p>
                )}
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
