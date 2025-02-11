'use client';

import DesignForm from 'components/forms/generateForm';
import { Suspense, useState } from 'react';
import DesignStudioCarousel from 'components/carousel/DesignStudioCarousel';
import NumberLabel from 'components/numberLabel';
import { UserDesign } from 'types/design';
import Image from 'next/image';

export default function StudioPage() {
  const [selectedDesign, setSelectedDesign] = useState<UserDesign | null>(null);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 pb-8">
      <div className="flex flex-col rounded-2xl bg-white shadow lg:flex-row lg:gap-8 lg:p-8">
        {/* Left Column - Design Form */}
        <div className="w-full lg:w-1/2">
          <h1 className="px-6 pt-6 text-3xl font-bold text-gray-900 lg:pt-0">Design Studio</h1>
          <p className="mt-2 px-6 text-gray-600">Create your custom design with AI</p>

          <div className="mt-8">
            <NumberLabel label="Describe your design">1</NumberLabel>
            <DesignForm />
          </div>

          <div className="mt-8 w-full">
            <NumberLabel label="Select a design">2</NumberLabel>
            <div className="w-full">
              <DesignStudioCarousel
                onDesignSelect={setSelectedDesign}
                selectedDesign={selectedDesign}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="mt-8 w-full lg:mt-0 lg:w-1/2">
          <div className="sticky top-8">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[650px] w-full overflow-hidden rounded-2xl bg-gray-100" />
              }
            >
              <div className="relative flex aspect-square h-full max-h-[650px] w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                {selectedDesign ? (
                  <Image
                    src={
                      selectedDesign.product_image?.image ||
                      selectedDesign.image?.image?.image ||
                      ''
                    }
                    alt={selectedDesign.name || 'Selected Design'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
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
