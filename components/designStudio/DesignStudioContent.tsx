'use client';

import DesignForm from 'components/forms/generateForm';
import { Suspense } from 'react';
import DesignStudioCarousel from 'components/carousel/DesignStudioCarousel';
import NumberLabel from 'components/numberLabel';
import Image from 'next/image';
import { useDesign } from 'components/designs/design-context';
import { ClipLoader } from 'react-spinners';

interface DesignStudioContentProps {
  initialSelectedDesign?: string;
}

export default function DesignStudioContent({ initialSelectedDesign }: DesignStudioContentProps) {
  const { selectedDesign, setSelectedDesign } = useDesign();
  const isGenerating = selectedDesign?.image?.status !== 'Succeeded';
  const imageUrl = selectedDesign?.product_image?.image || selectedDesign?.image?.image?.image;

  return (
    <div className="flex w-full flex-col lg:flex-row lg:gap-8">
      {/* Left Column - Design Form */}
      <div className="w-full lg:w-1/2">
        <h1 className="text-3xl font-bold text-gray-900">Design Studio</h1>
        <p className="mt-2 text-gray-600">Create your custom design with AI</p>

        <div className="mt-8">
          <NumberLabel label="Describe your design">1</NumberLabel>
          <div className="w-full">
            <DesignForm />
          </div>
        </div>

        <div className="mt-8">
          <NumberLabel label="Select a design">2</NumberLabel>
          <div className="w-full">
            <DesignStudioCarousel
              onDesignSelect={setSelectedDesign}
              selectedDesign={selectedDesign}
            />
          </div>
        </div>

        <div className="mt-8">
          <NumberLabel label="Choose a product">3</NumberLabel>
          <div className="w-full">
            <div id="product-carousel-container" className="max-w-full" />
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
                <p className="px-8 text-center text-gray-500">Select a design to preview it here</p>
              )}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
