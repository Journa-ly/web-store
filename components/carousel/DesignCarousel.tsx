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
import {
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterShareButton,
  XIcon
} from 'react-share';

// Create a ShareOverlay component
const ShareOverlay = ({ design }: { design: UserDesign }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get the base URL from environment or default to the current origin
    const baseUrl = window.location.origin;

    // Construct share URL that points to the share route with full domain
    if (design?.uuid) {
      setShareUrl(
        `${baseUrl}/share?design=${design.uuid}&return=${encodeURIComponent(window.location.pathname)}`
      );
    } else {
      setShareUrl(window.location.href);
    }
  }, [design]);

  const title = design?.name || 'Check out this design!';
  const media = design?.product_image?.image || design?.image?.image?.image;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    setIsOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the design from being selected
    setIsOpen(!isOpen);
  };

  if (!design || !media) return null;

  return (
    <div className="dropdown dropdown-end dropdown-top absolute bottom-2 right-2 z-30">
      <button
        onClick={toggleDropdown}
        className="transform rounded-full bg-white/95 p-1.5 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95"
        aria-label="Share design"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.5 12V20C4.5 20.5304 4.71071 21.0391 5.08579 21.4142C5.46086 21.7893 5.96957 22 6.5 22H18.5C19.0304 22 19.5391 21.7893 19.9142 21.4142C20.2893 21.0391 20.5 20.5304 20.5 20V12M16.5 6L12.5 2M12.5 2L8.5 6M12.5 2V15"
            stroke="#757575"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="menu dropdown-content z-[40] mt-2 -translate-y-2 rounded-box bg-base-100 p-3 shadow-lg">
          <div className="flex min-w-40 flex-col gap-2">
            <FacebookShareButton
              url={shareUrl}
              hashtag="#design"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <FacebookIcon size={24} round />
              <span className="text-xs">Facebook</span>
            </FacebookShareButton>

            <TwitterShareButton
              url={shareUrl}
              title={title}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <XIcon size={24} round />
              <span className="text-xs">Twitter</span>
            </TwitterShareButton>

            <PinterestShareButton
              url={shareUrl}
              media={media}
              description={title}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <PinterestIcon size={24} round />
              <span className="text-xs">Pinterest</span>
            </PinterestShareButton>

            <RedditShareButton
              url={shareUrl}
              title={title}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <RedditIcon size={24} round />
              <span className="text-xs">Reddit</span>
            </RedditShareButton>

            <button type="button" className="btn btn-outline btn-xs mt-1" onClick={handleCopyLink}>
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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

  // Scroll to selected image and center it whenever the selectedDesign changes
  useEffect(() => {
    if (selectedImageRef.current && containerRef.current && selectedDesign) {
      selectedImageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [selectedDesign]);

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
      <div className="relative mt-2 w-full">
        <div className="relative h-[350px]">
          <div
            ref={containerRef}
            className="hide-scrollbar absolute inset-0 overflow-x-auto scroll-smooth px-8"
          >
            <div className="inline-flex h-full items-center gap-4 py-4 lg:gap-8">
              {designs.map((design, index) => {
                const isGenerating =
                  design.image?.status === 'Pending' || design.image?.status === 'Processing';
                const hasFailed = design.image?.status === 'Failed';
                const isSelected = selectedDesign?.uuid === design.uuid;
                const isLastImage = index === designs.length - 1;

                return (
                  <div key={design.uuid} className={clsx('relative', isSelected && 'mx-6')}>
                    <div
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
                        'relative flex-shrink-0 overflow-hidden rounded-xl transition-transform duration-300',
                        'group z-10 aspect-square cursor-pointer shadow-sm hover:shadow-md',
                        'h-[264px] w-[264px]',
                        isSelected && !hasFailed && 'z-20 scale-125'
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
                          sizes="264px"
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
                              ? 'rounded-xl ring-2 ring-primary/30'
                              : 'ring-2 ring-black/5 group-hover:ring-black/10'
                          )}
                        />
                      )}

                      {/* Hover Overlay - Hide for failed designs */}
                      {!hasFailed && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      )}

                      {/* Share Overlay - Only show for complete designs */}
                      {!hasFailed && !isGenerating && !loadingImages[design.uuid] && (
                        <ShareOverlay design={design} />
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
                  </div>
                );
              })}

              {/* Add padding at end to allow last item to be centered */}
              <div className="w-[50%] flex-shrink-0"></div>

              {/* Loading indicator for infinite scroll */}
              {isLoading && hasMore && (
                <div className="flex h-[264px] w-[264px] items-center justify-center">
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
