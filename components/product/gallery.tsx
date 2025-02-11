'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from 'components/grid/tile';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import Image from 'next/image';
import { usePrintfulPrintArea } from '../../hooks/usePrintfulPrintArea';
import { useState } from 'react';
import clsx from 'clsx';

interface GalleryProps {
  images: { src: string; altText: string }[];
  useQueryParams?: boolean;
  showDesignOverlay?: boolean;
}

export function Gallery({
  images,
  useQueryParams = true,
  showDesignOverlay = false
}: GalleryProps) {
  const { selectedVariant, previewImage, updateImage } = useProduct();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const updateURL = useUpdateURL();

  // Get print area data using the variant's SKU
  const { printArea, isLoading: isPrintAreaLoading } = usePrintfulPrintArea(selectedVariant?.sku);

  const selectedImage = images[selectedImageIndex] || images[0];
  if (!selectedImage) return null;

  const handleImageUpdate = (index: number) => {
    const image = images[index];
    if (!image) return { image: null, variant: null, previewImage: null };
    setSelectedImageIndex(index);
    return updateImage(image.src);
  };

  // Calculate design overlay position and size
  const getDesignOverlayStyle = () => {
    if (!printArea || !showDesignOverlay) return {};

    // Calculate the scaling factor based on the container size
    // These values should match your container's dimensions
    const containerWidth = 550; // max container width
    const containerHeight = 550; // max container height

    // Calculate scale factors
    const scaleX = containerWidth / printArea.width;
    const scaleY = containerHeight / printArea.height;
    const scale = Math.min(scaleX, scaleY);

    // Calculate centered position
    const scaledWidth = printArea.width * scale;
    const scaledHeight = printArea.height * scale;
    const left = (containerWidth - scaledWidth) / 2 + printArea.left * scale;
    const top = (containerHeight - scaledHeight) / 2 + printArea.top * scale;

    return {
      position: 'absolute' as const,
      top: `${top}px`,
      left: `${left}px`,
      width: `${scaledWidth}px`,
      height: `${scaledHeight}px`,
      pointerEvents: 'none' as const
    };
  };

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black flex items-center justify-center';

  return (
    <form>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {/* Product Image */}
        <Image
          className="h-full w-full object-contain"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={selectedImage.src}
          alt={selectedImage.altText || 'Product Image'}
          priority={true}
        />

        {/* Design Overlay */}
        {showDesignOverlay && previewImage && (
          <div className="absolute" style={getDesignOverlayStyle()}>
            <Image
              src={previewImage}
              alt="Design Preview"
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            {/* Optional: Print area debug outline */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute inset-0 border-2 border-red-500 opacity-50" />
            )}
          </div>
        )}

        {!previewImage && images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur">
              <button
                formAction={() => {
                  const newState = handleImageUpdate(
                    selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
                  );
                  if (useQueryParams) {
                    updateURL(newState);
                  }
                }}
                aria-label="Previous product image"
                className={buttonClassName}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button
                formAction={() => {
                  const newState = handleImageUpdate(
                    selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
                  );
                  if (useQueryParams) {
                    updateURL(newState);
                  }
                }}
                aria-label="Next product image"
                className={buttonClassName}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {!previewImage && images.length > 1 ? (
        <ul className="my-12 flex flex-wrap items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === selectedImageIndex;
            return (
              <li key={image.src} className="h-20 w-20">
                <button
                  formAction={() => {
                    const newState = handleImageUpdate(index);
                    if (useQueryParams) {
                      updateURL(newState);
                    }
                  }}
                  aria-label="Select product image"
                  className={clsx(
                    'h-full w-full',
                    isActive ? 'border-2 border-primary' : 'border-transparent'
                  )}
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
