import { useState, useEffect, useCallback } from 'react';
import { usePaginatedMyDesigns, useToggleFavorite, deleteDesign } from 'requests/designs';
import { ClipLoader } from 'react-spinners';
import Modal from 'components/library/modal';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import ConfirmationModal from 'components/library/ConfirmationModal';
import { isMobile } from 'react-device-detect';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/outline';
import { UserDesign } from 'types/design';

interface MyDesignsModalProps {
  open: boolean;
  onClose: () => void;
  onSelectDesign?: (design: UserDesign) => void;
}

export default function MyDesignsModal({ open, onClose, onSelectDesign }: MyDesignsModalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const { myDesigns, isLoading, isError, size, setSize, pages } = usePaginatedMyDesigns();
  const { toggleFavorite } = useToggleFavorite();
  const { ref, inView } = useInView();
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [designToDelete, setDesignToDelete] = useState<string | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  const isLastPage = pages && pages[pages.length - 1]?.next === null;

  // Filter designs based on active tab
  const filteredDesigns =
    activeTab === 'favorites' ? myDesigns.filter((design) => design.favorite) : myDesigns;

  // Load more designs when scrolling to bottom
  useEffect(() => {
    if (!inView) return;
    if (isLastPage) return;
    if (isLoading) return;

    setSize((prev) => prev + 1);
  }, [inView, isLastPage]);

  const handleFavoriteClick = async (uuid: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(uuid);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleImageLoad = (uuid: string) => {
    setLoadingImages((prev) => ({ ...prev, [uuid]: false }));
  };

  const handleImageLoadStart = (uuid: string) => {
    setLoadingImages((prev) => ({ ...prev, [uuid]: true }));
  };

  const handleDeleteDesign = async (uuid: string) => {
    try {
      await deleteDesign(uuid);
      // Trigger a revalidation of the designs data
      setSize((prev) => prev);
    } catch (error) {
      console.error('Error deleting design:', error);
    }
  };

  const toggleOverlay = useCallback((uuid: string, e: React.MouseEvent | React.TouchEvent) => {
    if (!isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setActiveOverlay((prev) => (prev === uuid ? null : uuid));
  }, []);

  const handleSelectDesign = (design: UserDesign, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectDesign) {
      onSelectDesign(design);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="h-[90vh] w-[95vw] max-w-6xl rounded-2xl">
      <div className="h-full overflow-y-auto rounded-2xl bg-white">
        {/* Header */}
        <div className="sticky top-0 z-30 border-b bg-white">
          <div className="flex items-center justify-between px-5 py-5 sm:px-8">
            <h2 className="text-2xl font-semibold text-gray-900">My Designs</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
              aria-label="Close modal"
            >
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="px-5 sm:px-8">
            <div className="flex gap-8">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={clsx(
                  'relative pb-4 text-sm font-medium transition-colors duration-200',
                  activeTab === 'all' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                All Designs
                {activeTab === 'all' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className={clsx(
                  'relative pb-4 text-sm font-medium transition-colors duration-200',
                  activeTab === 'favorites' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Favorites
                {activeTab === 'favorites' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8">
          {isError ? (
            <div className="py-12 text-center text-sm text-red-500">Error loading designs</div>
          ) : filteredDesigns.length === 0 && !isLoading ? (
            <div className="py-12 text-center text-sm text-gray-600">
              {activeTab === 'favorites' ? 'No favorite designs yet' : 'No designs yet'}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {filteredDesigns.map((design) => {
                const isGenerating =
                  design.image?.status === 'Pending' || design.image?.status === 'Processing';
                const hasFailed = design.image?.status === 'Failed';

                return (
                  <div
                    key={design.uuid}
                    onClick={(e) => toggleOverlay(design.uuid, e)}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-gray-50 ring-1 ring-black/5"
                    role="button"
                    tabIndex={0}
                  >
                    {/* Info Overlay - Appears on Hover/Tap */}
                    <div
                      className={clsx(
                        'absolute inset-0 z-10 bg-black/60 transition-all duration-300',
                        isMobile
                          ? {
                              'pointer-events-auto opacity-100': activeOverlay === design.uuid,
                              'pointer-events-none opacity-0': activeOverlay !== design.uuid
                            }
                          : 'opacity-0 group-hover:opacity-100'
                      )}
                    >
                      <div className="overlay-content flex h-full flex-col">
                        {/* Prompts Section - Add top padding to clear the buttons */}
                        <div className="scrollbar-hide flex-grow space-y-3 overflow-y-auto p-4 pt-12">
                          {design.prompt && (
                            <div>
                              <h3 className="font-medium text-white/90">Prompt</h3>
                              <p className="text-sm text-white/75">{design.prompt}</p>
                            </div>
                          )}
                          {design.quote_prompt && (
                            <div>
                              <h3 className="font-medium text-white/90">Quote</h3>
                              <p className="text-sm text-white/75">{design.quote_prompt}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Loading or Generating State */}
                    {(isGenerating || loadingImages[design.uuid]) && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-100">
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
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-100">
                        <div className="flex flex-col items-center gap-2 px-4 text-center">
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                          <p className="text-sm text-gray-600">Generation failed</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDesignToDelete(design.uuid);
                              setDeleteModalOpen(true);
                            }}
                            className="mt-1 rounded-full bg-gray-800 p-1.5 text-white hover:bg-gray-700"
                            aria-label="Delete failed design"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
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
                          'object-cover transition-transform duration-500',
                          'group-hover:scale-105',
                          isGenerating || loadingImages[design.uuid] || hasFailed
                            ? 'opacity-0'
                            : 'opacity-100'
                        )}
                        sizes="(max-width: 640px) 50vw, 33vw"
                        priority
                        onLoadStart={() => handleImageLoadStart(design.uuid)}
                        onLoad={() => handleImageLoad(design.uuid)}
                      />
                    )}

                    {/* Quick Action Buttons (always visible) */}
                    <>
                      {/* Delete Button - positioned top-left */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDesignToDelete(design.uuid);
                          setDeleteModalOpen(true);
                        }}
                        className="absolute left-2.5 top-2.5 z-20 transform rounded-full bg-white/95 p-1.5 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95"
                      >
                        <XMarkIcon className="h-3.5 w-3.5 text-gray-600 hover:text-red-500" />
                      </button>

                      {/* Other buttons positioned top-right */}
                      <div className="absolute right-2.5 top-2.5 z-20 flex gap-2">
                        {onSelectDesign && (
                          <button
                            type="button"
                            onClick={(e) => handleSelectDesign(design, e)}
                            className="transform rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:scale-105 hover:bg-white hover:text-gray-900 hover:shadow-md active:scale-95"
                          >
                            View
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleFavoriteClick(design.uuid, e)}
                          className="transform rounded-full bg-white/95 p-1.5 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95"
                        >
                          {design.favorite ? (
                            <StarIcon className="h-3.5 w-3.5 text-yellow-500" />
                          ) : (
                            <StarIconOutline className="h-3.5 w-3.5 text-gray-600 hover:text-yellow-500" />
                          )}
                        </button>
                      </div>
                    </>
                  </div>
                );
              })}
            </div>
          )}

          {/* Infinite scroll trigger */}
          <div ref={ref} className="flex items-center justify-center pt-8">
            {isLoading && !isLastPage && <ClipLoader color="#6B7280" size={32} />}
          </div>
        </div>
      </div>

      {/* Add Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDesignToDelete(null);
        }}
        onConfirm={() => {
          if (designToDelete) {
            handleDeleteDesign(designToDelete);
          }
        }}
        title="Delete Design"
        message="Are you sure you want to delete this design?"
      />
    </Modal>
  );
}
