import useSWRInfinite from 'swr/infinite';
import { fetcher, serverClient } from '../clients/server';
import {
  CreateDesignRequest,
  TrendingDesign,
  UserDesign,
  TrendingDesignListResponse,
  UserDesignListResponse,
  ToggleFavoriteResponse,
  ToggleInteractionResponse,
  ShareDesignResponse,
  AttachUserResponse
} from '../types/design';

// Define the page size for pagination
const PAGE_SIZE = 21;

/**
 * getCategoryDesigns - fetches designs for a specific category
 */
export async function getCategoryDesigns(categoryId: string, cursor?: string) {
  try {
    const url = `/designs/trending/category/${categoryId}/${cursor ? `?cursor=${cursor}` : ''}`;
    const response = await serverClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching category designs:', error);
    return { results: [], next: null, previous: null, count: 0 };
  }
}

/**
 * usePaginatedCategoryDesigns - hook for fetching paginated designs for a category
 */
export function usePaginatedCategoryDesigns(categoryId: string) {
  const getKey = (pageIndex: number, previousPageData: TrendingDesignListResponse | null) => {
    // reached the end
    if (previousPageData && !previousPageData.next) return null;

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return [categoryId, null];

    // add the cursor to the API endpoint
    return [categoryId, previousPageData?.next ?? null];
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    ([categoryId, cursor]: [string, string | null]) =>
      getCategoryDesigns(categoryId, cursor ?? undefined)
  );

  const designs = data ? data.flatMap((page) => page.results) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.results?.length === 0;
  const hasNextPage = Boolean(data?.[data.length - 1]?.next);
  const isRefreshing = isValidating && data && data.length === size;

  return {
    designs,
    error,
    isLoadingMore,
    size,
    setSize,
    isEmpty,
    hasNextPage,
    isRefreshing
  };
}

/**
 * usePaginatedDesigns - fetches all designs with pagination.
 */
export const usePaginatedDesigns = () => {
  const getKey = (pageIndex: number, previousPageData: UserDesignListResponse | null) => {
    // If the previous page is empty, we've reached the end.
    if (previousPageData && !previousPageData.next) return null;
    // Page numbers are 1-indexed in our API.
    return `/designs/designs/?page=${pageIndex + 1}&page_size=${PAGE_SIZE}`;
  };

  const { data, error, size, setSize } = useSWRInfinite<UserDesignListResponse>(getKey, fetcher);

  // Flatten the paginated results
  const designs = data ? data.map((page) => page.results).flat() : [];
  // Total count is taken from the first page if available
  const totalCount = data && data[0] ? data[0].count : 0;

  return {
    designs,
    totalCount,
    isLoading: !error && !data,
    isError: error,
    size,
    setSize,
    pages: data
  };
};

/**
 * usePaginatedTrendingDesigns - fetches trending designs with pagination.
 */
export const usePaginatedTrendingDesigns = () => {
  const getKey = (pageIndex: number, previousPageData: TrendingDesignListResponse | null) => {
    // First page, no cursor needed
    if (pageIndex === 0) return `/designs/trending/?page_size=${PAGE_SIZE}`;

    // If the previous page is empty or doesn't have next cursor, we've reached the end
    if (!previousPageData || !previousPageData.next) return null;

    // Use the cursor value directly
    return `/designs/trending/?cursor=${previousPageData.next}&page_size=${PAGE_SIZE}`;
  };

  const { data, error, size, setSize } = useSWRInfinite<TrendingDesignListResponse>(
    getKey,
    fetcher
  );

  const trendingDesigns = data ? data.map((page) => page.results).flat() : [];
  const totalCount = data && data[0] ? data[0].count : 0;

  // Add isLoadingMore and hasNextPage helpers
  const isLoadingMore = data && typeof data[size - 1] === 'undefined';
  const hasNextPage = data ? data[data.length - 1]?.next !== null : false;

  return {
    trendingDesigns,
    totalCount,
    isLoading: !error && !data,
    isError: error,
    size,
    setSize,
    pages: data,
    isLoadingMore,
    hasNextPage
  };
};

/**
 * usePaginatedMyDesigns - fetches designs shared with the current user
 */
export const usePaginatedMyDesigns = () => {
  const getKey = (pageIndex: number, previousPageData: UserDesignListResponse | null) => {
    // First page, no cursor needed
    if (pageIndex === 0) return `/designs/designs/my_designs/?page_size=${PAGE_SIZE}`;

    // If the previous page is empty or doesn't have next cursor, we've reached the end
    if (previousPageData && !previousPageData.next) return null;

    // Extract cursor from previous page's next value
    const cursor = previousPageData?.next;
    if (!cursor) return null;

    // Use the cursor for subsequent pages
    return `/designs/designs/my_designs/?cursor=${cursor}&page_size=${PAGE_SIZE}`;
  };

  const { data, error, size, setSize, mutate } = useSWRInfinite<UserDesignListResponse>(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      persistSize: true
    }
  );

  const myDesigns = data ? data.map((page) => page.results).flat() : [];
  const totalCount = data && data[0] ? data[0].count : 0;

  // Add isLoadingMore and hasNextPage helpers
  const isLoadingMore = data && typeof data[size - 1] === 'undefined';
  const hasNextPage = data ? data[data.length - 1]?.next !== null : false;

  return {
    myDesigns,
    totalCount,
    isLoading: !error && !data,
    isError: error,
    size,
    setSize,
    pages: data,
    mutate,
    isLoadingMore,
    hasNextPage
  };
};

/**
 * toggleInteraction - toggles a reaction on a design.
 */
export const toggleInteraction = async (
  uuid: string,
  reactionType: string
): Promise<ToggleInteractionResponse> => {
  const response = await serverClient.post(`/designs/trending/${uuid}/toggle_interaction/`, null, {
    params: { reaction_type: reactionType }
  });
  return response.data;
};

/**
 * shareDesign - shares a design by adding the current user or session to the design.
 */
export const shareDesign = async (uuid: string): Promise<ShareDesignResponse> => {
  try {
    const response = await serverClient.post(`/designs/designs/${uuid}/share/`);
    return response.data;
  } catch (error) {
    console.error('Error sharing design:', error);
    throw error;
  }
};

/**
 * toggleFavorite - toggles the favorite status of a design for the current user.
 */
export const toggleFavorite = async (uuid: string): Promise<ToggleFavoriteResponse> => {
  const response = await serverClient.post(`/designs/designs/${uuid}/toggle_favorite/`);
  return response.data;
};

/**
 * useToggleFavorite - hook to toggle favorite status with automatic cache updates
 */
export const useToggleFavorite = () => {
  const { myDesigns, mutate } = usePaginatedMyDesigns();

  const toggleFavoriteWithMutation = async (uuid: string) => {
    try {
      // Optimistically update the cache
      const optimisticData = (pages: UserDesignListResponse[] | undefined) => {
        if (!pages) return pages;
        return pages.map((page) => ({
          ...page,
          results: page.results.map((design) =>
            design.uuid === uuid ? { ...design, favorite: !design.favorite } : design
          )
        }));
      };

      // Optimistically update all pages
      await mutate(optimisticData, false);

      // Make the actual API call
      const response = await toggleFavorite(uuid);

      // Update with the server response to ensure consistency
      const serverData = (pages: UserDesignListResponse[] | undefined) => {
        if (!pages) return pages;
        return pages.map((page) => ({
          ...page,
          results: page.results.map((design) =>
            design.uuid === uuid ? { ...design, favorite: response.design.favorite } : design
          )
        }));
      };

      await mutate(serverData, false);
      return response;
    } catch (error) {
      // Revalidate on error to ensure cache is correct
      await mutate();
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  return {
    toggleFavorite: toggleFavoriteWithMutation
  };
};

/**
 * createDesign - creates a new design.
 */
export const createDesign = async (designData: CreateDesignRequest): Promise<UserDesign[]> => {
  const response = await serverClient.post<UserDesign[]>('/designs/designs/', designData);
  return response.data;
};

/**
 * deleteDesign - soft-deletes a design.
 */
export const deleteDesign = async (uuid: string): Promise<void> => {
  await serverClient.delete(`/designs/designs/${uuid}/`);
};

/**
 * attachUserToSession - attaches the current user to all designs from a session.
 */
export const attachUserToSession = async (sessionId: string): Promise<AttachUserResponse> => {
  const response = await serverClient.post(`/designs/designs/attach-user/`, null, {
    params: { session_id: sessionId }
  });
  return response.data;
};

export async function addToMyDesigns(designId: string) {
  try {
    const response = await serverClient.post(`/designs/designs/${designId}/share/`);
    return response.data;
  } catch (error) {
    console.error('Error adding design to my designs:', error);
    throw error;
  }
}
