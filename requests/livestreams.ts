'use client';

import { fetcher, serverClient } from '../clients/server';
import useSWR from 'swr';
import { useState, useEffect, useCallback } from 'react';
import { TrendingDesign, TrendingDesignListResponse } from '../types/design';
import { useDesignWebSocket } from '../hooks/useDesignWebSocket';

export interface LiveStream {
  uuid: string;
  title: string;
  active_at: string | null;
  inactive_at: string | null;
  is_active: boolean;
  designs_count: number;
  status: 'ACTIVE' | 'ENDED' | 'UPCOMING' | 'SCHEDULED';
}

/**
 * Fetches the currently active livestream, if one exists
 */
export const useActiveLiveStream = () => {
  const { data, error, isLoading, mutate } = useSWR<LiveStream>(
    '/designs/livestreams/active/',
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 30000 // Check for updates every 30 seconds
    }
  );

  return {
    activeLiveStream: data,
    isLoading,
    isError: error,
    mutate
  };
};

/**
 * Fetches the list of previous livestreams
 */
export const usePreviousLiveStreams = () => {
  const { data, error, isLoading, mutate } = useSWR<LiveStream[]>(
    '/designs/livestreams/previous/',
    fetcher,
    {
      revalidateOnFocus: true
    }
  );

  return {
    previousLiveStreams: data || [],
    isLoading,
    isError: error,
    mutate
  };
};

/**
 * Fetches designs associated with a specific livestream
 */
export const getLiveStreamDesigns = async (
  livestreamUuid: string,
  cursor?: string
): Promise<TrendingDesignListResponse> => {
  try {
    const url = `/designs/trending/livestream/${livestreamUuid}/${cursor ? `?cursor=${cursor}` : ''}`;
    const response = await serverClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching livestream designs:', error);
    throw error;
  }
};

/**
 * Hook for fetching designs associated with a specific livestream
 * Uses both REST API and WebSocket for real-time updates
 */
export const useLiveStreamDesigns = (livestreamUuid: string) => {
  // Initial data fetch with SWR
  const { data, error, isLoading: isSWRLoading, mutate } = useSWR<TrendingDesignListResponse>(
    livestreamUuid ? `/designs/trending/livestream/${livestreamUuid}/` : null,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );

  // State for designs and loading status
  const [isLoading, setIsLoading] = useState(isSWRLoading);
  const [localDesigns, setLocalDesigns] = useState<TrendingDesign[]>([]);
  const [wsInitialized, setWsInitialized] = useState(false);

  // Use the existing WebSocket hook
  const { data: wsData, error: wsError } = useDesignWebSocket(livestreamUuid || null);
  const isConnected = wsData !== undefined && !wsError;

  // Initialize local designs with API data when it first loads
  useEffect(() => {
    if (data?.results && data.results.length > 0 && !wsInitialized) {
      setLocalDesigns(data.results);
      setWsInitialized(true);
    }
  }, [data, wsInitialized]);

  // Process WebSocket messages
  useEffect(() => {
    if (!wsData) return;

    try {
      if (wsData.type === 'image_data' && Array.isArray(wsData.data)) {
        const newDesigns = wsData.data as TrendingDesign[];
        
        // If we received new designs, update our local state
        if (newDesigns.length > 0) {
          setLocalDesigns(prevDesigns => {
            // Start with existing designs
            const updatedDesigns = [...prevDesigns];
            
            newDesigns.forEach(newDesign => {
              const existingIndex = updatedDesigns.findIndex(d => d.uuid === newDesign.uuid);
              
              if (existingIndex >= 0) {
                // Update existing design
                updatedDesigns[existingIndex] = newDesign;
              } else {
                // Add new design to the beginning
                updatedDesigns.unshift(newDesign);
              }
            });
            
            return updatedDesigns;
          });
        }
      }
    } catch (e) {
      console.error('Error processing WebSocket message:', e);
    }
  }, [wsData]);

  // Update loading state when SWR loading changes
  useEffect(() => {
    setIsLoading(isSWRLoading);
  }, [isSWRLoading]);

  // Get designs from localDesigns if available, otherwise fall back to API results
  const designs = wsInitialized ? localDesigns : (data?.results || []);

  // Custom refresh function to update both local state and SWR cache
  const refreshDesigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await mutate();
      if (result?.results) {
        setLocalDesigns(result.results);
        setWsInitialized(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [mutate]);

  return {
    designs,
    next: data?.next,
    previous: data?.previous,
    count: data?.count || 0,
    isLoading,
    isConnected,
    isError: error || wsError,
    mutate: refreshDesigns
  };
}; 