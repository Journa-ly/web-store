'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from 'components/grid/tile';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import Image from 'next/image';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image) : 0;

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  return (
    <form>
      <div className="group relative aspect-square max-w-full overflow-hidden">
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-contain transition-opacity duration-300"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={(images[imageIndex]?.altText as string) || 'product image'}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}

        {images.length > 1 ? (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              formAction={() => {
                const newState = updateImage(previousImageIndex.toString());
                updateURL(newState);
              }}
              aria-label="Previous product image"
              className="btn btn-circle btn-ghost bg-base-100/80 backdrop-blur-sm hover:bg-base-200/90"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <button
              formAction={() => {
                const newState = updateImage(nextImageIndex.toString());
                updateURL(newState);
              }}
              aria-label="Next product image"
              className="btn btn-circle btn-ghost bg-base-100/80 backdrop-blur-sm hover:bg-base-200/90"
            >
              <ArrowRightIcon className="h-6 w-6" />
            </button>
          </div>
        ) : null}

        {images.length > 1 ? (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-base-100/80 px-3 py-2 backdrop-blur-sm">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  formAction={() => {
                    const newState = updateImage(idx.toString());
                    updateURL(newState);
                  }}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    idx === imageIndex
                      ? 'scale-125 bg-primary'
                      : 'bg-base-content/30 hover:bg-base-content/50'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="relative mt-6 max-w-2xl">
          <div className="overflow-x-auto">
            <ul className="scrollbar-hide flex snap-x items-center gap-2 pb-2">
              {images.map((image, index) => {
                const isActive = index === imageIndex;

                return (
                  <li key={image.src} className="h-20 w-20 flex-none snap-start">
                    <button
                      formAction={() => {
                        const newState = updateImage(index.toString());
                        updateURL(newState);
                      }}
                      aria-label="Select product image"
                      className="h-full w-full"
                    >
                      <GridTileImage
                        alt={image.altText}
                        src={image.src}
                        width={60}
                        height={60}
                        active={isActive}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </form>
  );
}
