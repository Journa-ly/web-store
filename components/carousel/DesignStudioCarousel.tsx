import { useState, useRef, useEffect, useCallback } from 'react';
import { useToggleFavorite, deleteDesign } from 'requests/designs';
import { useDesignsWithLiveUpdates } from 'hooks/useDesignsWithLiveUpdates';
import { UserDesign } from 'types/design';
import { useDesign } from 'components/designs/design-context';
import DesignCarousel from './DesignCarousel';
import { useSearchParams } from 'next/navigation';

export default function DesignStudioCarousel() {
  const { designs, isLoading, error, size, setSize, pages, mutate } = useDesignsWithLiveUpdates();
  const { toggleFavorite } = useToggleFavorite();
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});
  const { selectedDesign, setSelectedDesign, setPreviewImage } = useDesign();
  const searchParams = useSearchParams();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const isLastPage = pages && pages[pages.length - 1]?.next === null;

  const handleSelectDesignFromUrl = useCallback(
    async (uuid: string) => {
      if (!uuid) return;
      try {
        const updatedPages = await mutate();
        if (!updatedPages || !updatedPages[0]) {
          console.warn('No pages received from mutate');
          return;
        }
        const design = updatedPages[0].results.find((d: UserDesign) => d.uuid === uuid);
        if (design) {
          handleSelectDesign(design);
        }
      } catch (err) {
        console.error('Error in handleSelectDesignFromUrl:', err);
      }
    },
    [mutate]
  );

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    const selectedId = searchParams.get('selected');
    if (selectedId) {
      handleSelectDesignFromUrl(selectedId);
    }
  }, [searchParams, handleSelectDesignFromUrl]);

  const handleFavoriteClick = async (uuid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorite(uuid);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDeleteDesign = async (uuid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Optimistically update UI
      const optimisticData = (pages: any) =>
        pages?.map((page: any) => ({
          ...page,
          results: page.results.filter((design: UserDesign) => design.uuid !== uuid)
        }));

      await mutate(optimisticData, false);

      // Make the API call
      await deleteDesign(uuid);

      // If the deleted design was selected, clear the selection
      if (selectedDesign?.uuid === uuid) {
        setSelectedDesign(null);
        setPreviewImage(null);
      }

      // Revalidate the data
      await mutate();
    } catch (error) {
      console.error('Error deleting design:', error);
      // Revalidate on error to ensure cache is correct
      await mutate();
    }
  };

  const handleSelectDesign = (design: UserDesign) => {
    setSelectedDesign(design);
    if (design.product_image?.image) {
      setPreviewImage(design.product_image?.image);
    }
  };

  const handleImageLoad = (uuid: string) => {
    setLoadingImages((prev) => ({ ...prev, [uuid]: false }));
  };

  const handleImageLoadStart = (uuid: string) => {
    setLoadingImages((prev) => ({ ...prev, [uuid]: true }));
  };

  const handleLoadMore = async () => {
    if (!isLastPage && !isLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      try {
        await setSize(size + 1);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  return (
    <DesignCarousel
      designs={designs}
      selectedDesign={selectedDesign}
      isLoading={isLoading || isLoadingMore}
      error={error}
      onSelectDesign={handleSelectDesign}
      onFavoriteClick={handleFavoriteClick}
      onDeleteDesign={handleDeleteDesign}
      loadingImages={loadingImages}
      onImageLoad={handleImageLoad}
      onImageLoadStart={handleImageLoadStart}
      onLoadMore={handleLoadMore}
      hasMore={!isLastPage}
    />
  );
}
