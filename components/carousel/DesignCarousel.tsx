'use client';
import { ClipLoader } from 'react-spinners';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import Image from 'next/image';
import clsx from 'clsx';
import { UserDesign } from 'types/design';
import { useEffect, useRef, useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/solid';
import AuthModal from 'components/modals/AuthModal';
import { useAuth } from '@/requests/users';

interface DesignCarouselProps {
  designs: UserDesign[];
  selectedDesign?: UserDesign | null;
  isLoading: boolean;
  error: any;
  onSelectDesign: (design: UserDesign) => void;
  onFavoriteClick?: (uuid: string, e: React.MouseEvent) => void;
  onDeleteDesign?: (uuid: string, e: React.MouseEvent) => void;
  loadingImages: { [key: string]: boolean };
  onImageLoad: (uuid: string) => void;
  onImageLoadStart: (uuid: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isAuthenticated?: boolean;
}

export default function DesignCarousel({
  designs,
  selectedDesign,
  isLoading,
  error,
  onSelectDesign,
  onFavoriteClick,
  onDeleteDesign,
  loadingImages,
  onImageLoad,
  onImageLoadStart,
  onLoadMore,
  hasMore
}: DesignCarouselProps) {
  const selectedImageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastImageRef = useRef<HTMLDivElement>(null);
  const previousDesignsLength = useRef(designs.length);
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingFavoriteDesign, setPendingFavoriteDesign] = useState<string | null>(null);

  // Scroll to selected image only on initial load and when new images are received
  useEffect(() => {
    const hasNewImages = designs.length > previousDesignsLength.current;
    previousDesignsLength.current = designs.length;

    if (
      (hasNewImages || designs.length === 1) &&
      selectedImageRef.current &&
      containerRef.current
    ) {
      selectedImageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [designs]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoading && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onLoadMore, isLoading, hasMore]);

  // Update observer when last image changes
  useEffect(() => {
    if (lastImageRef.current && observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(lastImageRef.current);
    }
  }, [designs]);

  const handleFavoriteClick = (uuid: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent design selection when clicking favorite

    if (!isAuthenticated) {
      setPendingFavoriteDesign(uuid);
      setShowAuthModal(true);
      return;
    }

    onFavoriteClick?.(uuid, e);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingFavoriteDesign && onFavoriteClick) {
      // Create a synthetic mouse event
      const syntheticEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        button: 0
      }) as unknown as React.MouseEvent;

      onFavoriteClick(pendingFavoriteDesign, syntheticEvent);
    }
    setPendingFavoriteDesign(null);
  };

  if (isLoading && !designs.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <ClipLoader color="#6B7280" size={32} />
      </div>
    );
  }

  if (error) {
    return <div className="py-8 text-center text-sm text-red-500">Error loading designs</div>;
  }

  if (!designs?.length) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        No designs yet. Create your first design above!
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full">
        <div className="relative h-[200px]">
          <div ref={containerRef} className="hide-scrollbar absolute inset-0 overflow-x-auto px-8">
            <div className="inline-flex h-full items-center gap-4">
              {designs.map((design, index) => {
                const isGenerating =
                  design.image?.status === 'Pending' || design.image?.status === 'Processing';
                const hasFailed = design.image?.status === 'Failed';
                const isSelected = selectedDesign?.uuid === design.uuid;
                const isLastImage = index === designs.length - 1;

                return (
                  <div
                    key={design.uuid}
                    ref={(el) => {
                      if (isSelected) selectedImageRef.current = el;
                      if (isLastImage) lastImageRef.current = el;
                    }}
                    onClick={(e) => {
                      if (!hasFailed) {
                        onSelectDesign(design);
                      } else if (onDeleteDesign) {
                        onDeleteDesign(design.uuid, e);
                      }
                    }}
                    className={clsx(
                      'relative flex-shrink-0 overflow-hidden rounded-xl transition-transform duration-200',
                      'group aspect-square cursor-pointer shadow-sm hover:shadow-md',
                      'h-[176px] w-[176px]',
                      isSelected && !hasFailed && 'scale-110'
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

                    {/* Failed Generation State */}
                    {hasFailed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="flex flex-col items-center gap-2 px-4 text-center">
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                          <p className="text-sm text-gray-600">Generation failed</p>
                          {onDeleteDesign && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteDesign(design.uuid, e);
                              }}
                              className="mt-1 rounded-full bg-gray-800 p-1.5 text-white hover:bg-gray-700"
                              aria-label="Delete failed design"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Image */}
                    {(design.product_image?.image || design.image?.image?.image) && (
                      <Image
                        src={design.product_image?.image || design.image?.image?.image || ''}
                        alt={design.name || 'Design'}
                        fill
                        className={clsx(
                          'object-cover transition-all duration-500',
                          'group-hover:scale-105',
                          isGenerating || loadingImages[design.uuid] || hasFailed
                            ? 'opacity-0'
                            : 'opacity-100'
                        )}
                        sizes="176px"
                        onLoadStart={() => onImageLoadStart(design.uuid)}
                        onLoad={() => onImageLoad(design.uuid)}
                        priority={isSelected}
                      />
                    )}

                    {/* Selection Ring - Hide for failed designs */}
                    {!hasFailed && (
                      <div
                        className={clsx(
                          'absolute inset-0 transition-colors duration-200',
                          isSelected 
                            ? 'border-4 border-primary rounded-xl' 
                            : 'ring-2 ring-black/5 group-hover:ring-black/10'
                        )}
                      />
                    )}

                    {/* Hover Overlay - Hide for failed designs */}
                    {!hasFailed && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    )}

                    {/* Favorite Button */}
                    {onFavoriteClick && (
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
                    )}
                  </div>
                );
              })}

              {/* Loading indicator for infinite scroll */}
              {isLoading && hasMore && (
                <div className="flex h-[176px] w-[176px] items-center justify-center">
                  <ClipLoader color="#6B7280" size={24} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingFavoriteDesign(null);
        }}
        onSuccess={handleAuthSuccess}
        title="Sign in to favorite designs"
      />
    </>
  );
}
