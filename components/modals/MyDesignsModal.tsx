import { useState, useEffect } from 'react';
import { usePaginatedMyDesigns, useToggleFavorite } from 'requests/designs';
import { ClipLoader } from 'react-spinners';
import Modal from 'components/library/modal';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface MyDesignsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function MyDesignsModal({ open, onClose }: MyDesignsModalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const { myDesigns, isLoading, isError, size, setSize, pages } = usePaginatedMyDesigns();
  const { toggleFavorite } = useToggleFavorite();
  const { ref, inView } = useInView();

  const isLastPage = pages && pages[pages.length - 1]?.next === null;

  // Filter designs based on active tab
  const filteredDesigns =
    activeTab === 'favorites' ? myDesigns.filter((design) => design.favorite) : myDesigns;

  // Load more designs when scrolling to bottom
  useEffect(() => {
    if (inView && !isLastPage && !isLoading) {
      setSize(size + 1);
    }
  }, [inView, isLastPage, isLoading, setSize, size]);

  const handleFavoriteClick = async (uuid: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal close if clicking outside
    try {
      await toggleFavorite(uuid);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="h-[90vh] w-[95vw] max-w-6xl rounded-2xl">
      <div className="h-full overflow-y-auto rounded-2xl bg-white">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-5 py-5 sm:px-8">
            <h2 className="text-2xl font-semibold text-gray-900">My Designs</h2>
            <button
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
              {filteredDesigns.map((design) => (
                <div
                  key={design.uuid}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-50 ring-1 ring-black/5"
                >
                  <Image
                    src={design.product_image?.image || design.image?.image?.image || ''}
                    alt={design.name || 'Design'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <button
                    onClick={(e) => handleFavoriteClick(design.uuid, e)}
                    className="absolute right-2.5 top-2.5 transform rounded-full bg-white/95 p-1.5 shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95"
                  >
                    {design.favorite ? (
                      <StarIcon className="h-3.5 w-3.5 text-yellow-500" />
                    ) : (
                      <StarIconOutline className="h-3.5 w-3.5 text-gray-600 hover:text-yellow-500" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Infinite scroll trigger */}
          <div ref={ref} className="flex items-center justify-center pt-8">
            {isLoading && !isLastPage && <ClipLoader color="#6B7280" size={32} />}
          </div>
        </div>
      </div>
    </Modal>
  );
}
