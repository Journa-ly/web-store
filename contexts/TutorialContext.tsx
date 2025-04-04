'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Tutorial step types for each page
export type TrendingPageStep =
  | 'view-designs'
  | 'interact-design'
  | 'add-to-mydesigns'
  | 'completed';
export type StudioPageStep =
  | 'input-prompt'
  | 'input-image-text'
  | 'create-design'
  | 'select-product'
  | 'completed';
export type ProductPageStep = 'select-design' | 'add-to-cart' | 'completed';

// Main tutorial state interface
interface TutorialState {
  isTrendingTutorialActive: boolean;
  isStudioTutorialActive: boolean;
  isProductTutorialActive: boolean;
  trendingStep: TrendingPageStep;
  studioStep: StudioPageStep;
  productStep: ProductPageStep;
  isDismissed: {
    trending: boolean;
    studio: boolean;
    product: boolean;
  };
}

// Context interface with state and actions
interface TutorialContextType {
  tutorialState: TutorialState;
  advanceTrendingStep: () => void;
  advanceStudioStep: () => void;
  advanceProductStep: () => void;
  dismissTutorial: (page: 'trending' | 'studio' | 'product') => void;
  resetTutorial: (page: 'trending' | 'studio' | 'product') => void;
}

// Default tutorial state
const defaultTutorialState: TutorialState = {
  isTrendingTutorialActive: false,
  isStudioTutorialActive: false,
  isProductTutorialActive: false,
  trendingStep: 'view-designs',
  studioStep: 'input-prompt',
  productStep: 'select-design',
  isDismissed: {
    trending: false,
    studio: false,
    product: false
  }
};

// Create context with default values
const TutorialContext = createContext<TutorialContextType>({
  tutorialState: defaultTutorialState,
  advanceTrendingStep: () => {},
  advanceStudioStep: () => {},
  advanceProductStep: () => {},
  dismissTutorial: () => {},
  resetTutorial: () => {}
});

// Hook to use tutorial context
export const useTutorial = () => useContext(TutorialContext);

// Provider component
export const TutorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tutorialState, setTutorialState] = useState<TutorialState>(defaultTutorialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize tutorial state from server on mount
  useEffect(() => {
    const fetchTutorialState = async () => {
      try {
        const response = await axios.get('/api/tutorial/state');
        console.log('Tutorial state from server:', response.data);

        // If there's no server state yet or it's a new user, use default with tutorials active
        const isNewUser = !response.data || Object.keys(response.data).length === 0;

        if (isNewUser) {
          // For new users, activate all tutorials
          setTutorialState({
            ...defaultTutorialState,
            isTrendingTutorialActive: true,
            isStudioTutorialActive: true,
            isProductTutorialActive: true
          });
          console.log('New user detected, activating all tutorials');
        } else if (response.data) {
          // For existing users with data, use their saved state
          const productTutorialActive =
            !response.data.isDismissed?.product && response.data.productStep !== 'completed';

          setTutorialState({
            ...defaultTutorialState,
            ...response.data,
            isTrendingTutorialActive:
              !response.data.isDismissed?.trending && response.data.trendingStep !== 'completed',
            isStudioTutorialActive:
              !response.data.isDismissed?.studio && response.data.studioStep !== 'completed',
            isProductTutorialActive: productTutorialActive
          });

          console.log('Existing user, product tutorial active:', productTutorialActive);
          console.log('Tutorial state set:', {
            trending:
              !response.data.isDismissed?.trending && response.data.trendingStep !== 'completed',
            studio: !response.data.isDismissed?.studio && response.data.studioStep !== 'completed',
            product: productTutorialActive
          });
        }
      } catch (error) {
        console.error('Failed to fetch tutorial state:', error);
        // On error, use default state but activate tutorials
        setTutorialState({
          ...defaultTutorialState,
          isTrendingTutorialActive: true,
          isStudioTutorialActive: true,
          isProductTutorialActive: true
        });
      } finally {
        setIsInitialized(true);
      }
    };

    fetchTutorialState();
  }, []);

  // Update server when tutorial state changes
  useEffect(() => {
    if (!isInitialized) return;

    const updateServerState = async () => {
      try {
        await axios.post('/api/tutorial/state', {
          trendingStep: tutorialState.trendingStep,
          studioStep: tutorialState.studioStep,
          productStep: tutorialState.productStep,
          isDismissed: tutorialState.isDismissed
        });
      } catch (error) {
        console.error('Failed to update tutorial state:', error);
      }
    };

    updateServerState();
  }, [tutorialState, isInitialized]);

  // Advance trending tutorial step
  const advanceTrendingStep = () => {
    setTutorialState((prev) => {
      const nextStep = getNextTrendingStep(prev.trendingStep);
      const isCompleted = nextStep === 'completed';

      return {
        ...prev,
        trendingStep: nextStep,
        isTrendingTutorialActive: !isCompleted && !prev.isDismissed.trending
      };
    });
  };

  // Advance studio tutorial step
  const advanceStudioStep = () => {
    setTutorialState((prev) => {
      const nextStep = getNextStudioStep(prev.studioStep);
      const isCompleted = nextStep === 'completed';

      return {
        ...prev,
        studioStep: nextStep,
        isStudioTutorialActive: !isCompleted && !prev.isDismissed.studio
      };
    });
  };

  // Advance product tutorial step
  const advanceProductStep = () => {
    setTutorialState((prev) => {
      const nextStep = getNextProductStep(prev.productStep);
      const isCompleted = nextStep === 'completed';

      return {
        ...prev,
        productStep: nextStep,
        isProductTutorialActive: !isCompleted && !prev.isDismissed.product
      };
    });
  };

  // Dismiss tutorial for specific page
  const dismissTutorial = (page: 'trending' | 'studio' | 'product') => {
    setTutorialState((prev) => ({
      ...prev,
      isDismissed: {
        ...prev.isDismissed,
        [page]: true
      },
      isTrendingTutorialActive: page === 'trending' ? false : prev.isTrendingTutorialActive,
      isStudioTutorialActive: page === 'studio' ? false : prev.isStudioTutorialActive,
      isProductTutorialActive: page === 'product' ? false : prev.isProductTutorialActive
    }));
  };

  // Reset tutorial for specific page
  const resetTutorial = (page: 'trending' | 'studio' | 'product') => {
    setTutorialState((prev) => {
      const updates: Partial<TutorialState> = {
        isDismissed: {
          ...prev.isDismissed,
          [page]: false
        }
      };

      if (page === 'trending') {
        updates.trendingStep = 'view-designs';
        updates.isTrendingTutorialActive = true;
      } else if (page === 'studio') {
        updates.studioStep = 'input-prompt';
        updates.isStudioTutorialActive = true;
      } else if (page === 'product') {
        updates.productStep = 'select-design';
        updates.isProductTutorialActive = true;
      }

      return { ...prev, ...updates };
    });
  };

  // Helper functions to get next steps
  const getNextTrendingStep = (currentStep: TrendingPageStep): TrendingPageStep => {
    switch (currentStep) {
      case 'view-designs':
        return 'interact-design';
      case 'interact-design':
        return 'add-to-mydesigns';
      case 'add-to-mydesigns':
        return 'completed';
      default:
        return 'completed';
    }
  };

  const getNextStudioStep = (currentStep: StudioPageStep): StudioPageStep => {
    switch (currentStep) {
      case 'input-prompt':
        return 'input-image-text';
      case 'input-image-text':
        return 'create-design';
      case 'create-design':
        return 'select-product';
      case 'select-product':
        return 'completed';
      default:
        return 'completed';
    }
  };

  const getNextProductStep = (currentStep: ProductPageStep): ProductPageStep => {
    switch (currentStep) {
      case 'select-design':
        return 'add-to-cart';
      case 'add-to-cart':
        return 'completed';
      default:
        return 'completed';
    }
  };

  return (
    <TutorialContext.Provider
      value={{
        tutorialState,
        advanceTrendingStep,
        advanceStudioStep,
        advanceProductStep,
        dismissTutorial,
        resetTutorial
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};
