import { useState, useRef, useEffect } from 'react';
import { usePaginatedMyDesigns, useToggleFavorite } from 'requests/designs';
import { ClipLoader } from 'react-spinners';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import clsx from 'clsx';
import { UserDesign } from 'types/design';

interface DesignStudioCarouselProps {
  onDesignSelect?: (design: UserDesign) => void;
  selectedDesign?: UserDesign | null;
}

export default function DesignStudioCarousel({
  onDesignSelect,
  selectedDesign
}: DesignStudioCarouselProps) {
  const { myDesigns, isLoading, isError } = usePaginatedMyDesigns();
  const { toggleFavorite } = useToggleFavorite();
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});
  const selectedImageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll selected design into view
  useEffect(() => {
    if (selectedImageRef.current) {
      selectedImageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [selectedDesign]);

  const handleFavoriteClick = async (uuid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorite(uuid);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleImageLoad = (uuid: string) => {
    setLoadingImages((prev) => ({ ...prev, [uuid]: false }));
  };

  const handleImageLoadStart = (uuid: string) => {
    setLoadingImages((prev) => ({ ...prev, [uuid]: true }));
  };

  if (isError) {
    return <div className="py-8 text-center text-sm text-red-500">Error loading designs</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <ClipLoader color="#6B7280" size={32} />
      </div>
    );
  }

  if (!myDesigns?.length) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        No designs yet. Create your first design above!
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Fixed Height Container */}
      <div className="relative h-[200px]">
        {/* Designs Scroll Container */}
        <div ref={containerRef} className="hide-scrollbar absolute inset-0 overflow-x-auto px-8">
          <div className="inline-flex h-full items-center gap-4">
            {myDesigns.map((design) => {
              const isGenerating = design.image?.status !== 'Succeeded';
              const isSelected = selectedDesign?.uuid === design.uuid;

              return (
                <div
                  key={design.uuid}
                  ref={isSelected ? selectedImageRef : null}
                  onClick={() => onDesignSelect?.(design)}
                  className={clsx(
                    'relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl transition-transform duration-200',
                    'group aspect-square shadow-sm hover:shadow-md',
                    'h-[176px] w-[176px]',
                    isSelected && 'scale-110'
                  )}
                >
                  {/* Loading or Generating State */}
                  {(isGenerating || loadingImages[design.uuid]) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="flex flex-col items-center gap-2">
                        <ClipLoader color="#6B7280" size={24} />
                        <p className="text-sm text-gray-600">
                          {isGenerating ? 'Generating...' : 'Loading...'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  <Image
                    src={design.product_image?.image || design.image?.image?.image || ''}
                    alt={design.name || 'Design'}
                    fill
                    className={clsx(
                      'object-cover transition-all duration-500',
                      'group-hover:scale-105',
                      isGenerating || loadingImages[design.uuid] ? 'opacity-0' : 'opacity-100'
                    )}
                    sizes="176px"
                    onLoadStart={() => handleImageLoadStart(design.uuid)}
                    onLoad={() => handleImageLoad(design.uuid)}
                    priority={isSelected}
                  />

                  {/* Selection Ring */}
                  <div
                    className={clsx(
                      'absolute inset-0 ring-2 transition-colors duration-200',
                      isSelected ? 'ring-primary' : 'ring-black/5 group-hover:ring-black/10'
                    )}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleFavoriteClick(design.uuid, e)}
                    className="absolute right-2 top-2 transform rounded-full bg-white/95 p-1.5 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95"
                  >
                    {design.favorite ? (
                      <StarIcon className="h-3.5 w-3.5 text-yellow-500" />
                    ) : (
                      <StarIconOutline className="h-3.5 w-3.5 text-gray-600 hover:text-yellow-500" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
