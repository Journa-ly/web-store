import { useDesignWebSocket } from './useDesignWebSocket';
import { usePaginatedMyDesigns } from '../requests/designs';
import { UserDesign, UserDesignListResponse } from '../types/design';
import { useEffect } from 'react';

/**
 * Hook that combines paginated designs with real-time WebSocket updates
 */
export function useDesignsWithLiveUpdates() {
  const {
    myDesigns,
    isLoading: isLoadingDesigns,
    isError: fetchError,
    mutate,
    ...paginationProps
  } = usePaginatedMyDesigns();

  const { data: wsData, error: wsError } = useDesignWebSocket();

  // Update the designs list when we receive WebSocket updates
  useEffect(() => {
    if (wsData?.type === 'image_data') {
      const updatedDesigns = wsData.data as UserDesign[];
      if (!Array.isArray(updatedDesigns)) return;

      mutate((currentPages: UserDesignListResponse[] | undefined) => {
        if (!currentPages) return currentPages;

        return currentPages.map((page) => ({
          ...page,
          results: page.results.map((design) => {
            const updatedDesign = updatedDesigns.find((d) => d.uuid === design.uuid);
            return updatedDesign || design;
          })
        }));
      }, false);
    }
  }, [wsData, mutate]);

  return {
    designs: myDesigns,
    isLoading: isLoadingDesigns,
    error: fetchError,
    wsError: wsError,
    mutate,
    ...paginationProps
  };
}
