'use client';
import { usePaginatedMyDesigns } from 'requests/designs';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useProduct } from 'components/product/product-context';

export default function MyDesignsCarousel() {
  const { myDesigns, isLoading, isError } = usePaginatedMyDesigns();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});
  const selectedImageRef = useRef<HTMLDivElement>(null);
  const { setPreviewImage } = useProduct();

  // Load the selected index from localStorage and scroll to it on mount
  useEffect(() => {
    const savedIndex = localStorage.getItem('selectedDesignIndex');
    if (savedIndex !== null) {
      setCurrentIndex(Number(savedIndex));
    }
  }, []);

  // Scroll to selected image whenever currentIndex changes or designs load
  useEffect(() => {
    if (selectedImageRef.current) {
      selectedImageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentIndex, myDesigns]);

  const handleSelectImage = (index: number) => {
    setCurrentIndex(index);
    localStorage.setItem('selectedDesignIndex', index.toString());

    // Set the preview image when a design is selected
    if (myDesigns?.[index]?.image?.image.image) {
      setPreviewImage(myDesigns[index].image.image.image);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );

  if (isError) return <div className="text-red-500">Error loading designs</div>;
  if (!myDesigns?.length) return <div className="text-gray-500">No designs found</div>;

  const handleImageLoad = (uuid: string) => {
    setLoadingImages((prev) => ({ ...prev, [uuid]: false }));
  };

  const handleImageLoadStart = (uuid: string) => {
    setLoadingImages((prev) => ({ ...prev, [uuid]: true }));
  };

  return (
    <div className="my-2 w-full max-w-xl">
      <div className="hide-scrollbar overflow-x-auto">
        <div className="inline-flex h-48 w-[800px] items-center gap-4 px-4">
          {myDesigns.map((design, index) => {
            const isGenerating = design.image?.status !== 'Succeeded';
            const isSelected = index === currentIndex;

            return (
              <div
                key={design.uuid}
                ref={isSelected ? selectedImageRef : null}
                className={clsx(
                  'relative flex-shrink-0 cursor-pointer overflow-hidden rounded-lg transition-all duration-200',
                  isSelected ? 'h-44 w-44 border-2 border-primary' : 'h-40 w-40',
                  'aspect-square'
                )}
                onClick={() => handleSelectImage(index)}
              >
                {/* Loading or Generating State */}
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
                      <p className="text-sm text-gray-600">
                        {isGenerating ? 'Generating design...' : 'Loading...'}
                      </p>
                    </div>
                  </div>
                )}
                {/* Image */}
                {design.image?.image?.image && (
                  <Image
                    src={design.image.image.image}
                    alt={`Design ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 160px, 176px"
                    className={clsx(
                      'object-cover transition-opacity duration-300',
                      isGenerating ? 'opacity-0' : 'opacity-100'
                    )}
                    onLoadStart={() => handleImageLoadStart(design.uuid)}
                    onLoad={() => handleImageLoad(design.uuid)}
                    priority={index === currentIndex}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
