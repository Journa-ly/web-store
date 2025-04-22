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
        <p className="px-8 text-center text-gray-500">Select a design to preview it here</p>
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-col items-center">
      {/* Full Width Column with flex w-full flex-col items-centerCentered Content */}
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="flex w-full justify-center">
          <DesignStudioCarousel />
        </div>

        <div className="mt-2 flex w-full justify-center">
          <div className="w-full">
            <DesignForm />
          </div>
        </div>
      </div>
    </div>
  );
}
