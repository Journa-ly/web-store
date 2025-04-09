'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
  useCallback
} from 'react';
import { UserDesign } from 'types/design';
import { LocalStorageCache } from 'utils/localStorage';
import { useDesignWebSocket } from 'hooks/useDesignWebSocket';

interface DesignContextType {
  selectedDesign: UserDesign | null;
  setSelectedDesign: (design: UserDesign | null) => void;
  previewImage: string | null;
  setPreviewImage: (image: string | null) => void;
  clearDesignContext: () => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

// Create a cache instance for designs
const designCache = new LocalStorageCache<{
  selectedDesign: UserDesign | null;
  previewImage: string | null;
}>('design:');

export function DesignProvider({ children }: { children: ReactNode }) {
  const [selectedDesign, setSelectedDesign] = useState<UserDesign | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Use WebSocket for real-time updates
  const { data: wsData } = useDesignWebSocket();

  // Update selected design when WebSocket data is received
  useEffect(() => {
    if (wsData?.type === 'image_data' && selectedDesign) {
      const updatedDesigns = wsData.data as UserDesign[];
      if (!Array.isArray(updatedDesigns)) return;

      const updatedDesign = updatedDesigns.find(d => d.uuid === selectedDesign.uuid);
      if (updatedDesign) {
        setSelectedDesign(updatedDesign);
      }
    }
  }, [wsData, selectedDesign]);

  // Load initial state from localStorage
  useEffect(() => {
    const cached = designCache.get('state');
    if (cached) {
      setSelectedDesign(cached.selectedDesign);
      setPreviewImage(cached.previewImage);
    }
  }, []);

  const clearDesignContext = useCallback(() => {
    setSelectedDesign(null);
    setPreviewImage(null);
    designCache.clear();
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    designCache.set('state', {
      selectedDesign,
      previewImage
    });
  }, [selectedDesign, previewImage]);

  const value = useMemo(
    () => ({
      selectedDesign,
      setSelectedDesign,
      previewImage,
      setPreviewImage,
      clearDesignContext
    }),
    [selectedDesign, previewImage, clearDesignContext]
  );

  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}
