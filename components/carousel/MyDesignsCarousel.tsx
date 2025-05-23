'use client';
import { useDesignsWithLiveUpdates } from 'hooks/useDesignsWithLiveUpdates';
import { useState, useEffect, useCallback } from 'react';
import { useDesign } from 'components/designs/design-context';
import DesignCarousel from './DesignCarousel';
import { UserDesign } from 'types/design';
import { deleteDesign } from 'requests/designs';
import { useSearchParams } from 'next/navigation';

export default function MyDesignsCarousel() {
  const { designs, isLoading, error, size, setSize, pages, mutate } = useDesignsWithLiveUpdates();
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});
  const { setPreviewImage, selectedDesign, setSelectedDesign } = useDesign();
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
      loadingImages={loadingImages}
      onImageLoad={handleImageLoad}
      onImageLoadStart={handleImageLoadStart}
      onDeleteDesign={handleDeleteDesign}
      onLoadMore={handleLoadMore}
      hasMore={!isLastPage}
    />
  );
}
