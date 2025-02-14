import { useState, useRef } from 'react';
import { useToggleFavorite, usePaginatedMyDesigns, deleteDesign } from 'requests/designs';
import { useDesignsWithLiveUpdates } from 'hooks/useDesignsWithLiveUpdates';
import { UserDesign } from 'types/design';
import { useDesign } from 'components/designs/design-context';
import DesignCarousel from './DesignCarousel';

export default function DesignStudioCarousel() {
  const { myDesigns, isLoading, isError, size, setSize, pages, mutate } = usePaginatedMyDesigns();
  const { toggleFavorite } = useToggleFavorite();
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});
  const { selectedDesign, setSelectedDesign, setPreviewImage } = useDesign();

  const isLastPage = pages && pages[pages.length - 1]?.next === null;

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
    if (design.image?.image?.image) {
      setPreviewImage(design.image.image.image);
    }
  };

  const handleImageLoad = (uuid: string) => {
    setLoadingImages((prev) => ({ ...prev, [uuid]: false }));
  };

  const handleImageLoadStart = (uuid: string) => {
    setLoadingImages((prev) => ({ ...prev, [uuid]: true }));
  };

  const handleLoadMore = () => {
    if (!isLastPage && !isLoading) {
      setSize(size + 1);
    }
  };

  return (
    <DesignCarousel
      designs={myDesigns}
      selectedDesign={selectedDesign}
      isLoading={isLoading}
      error={isError}
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
