import React, { useEffect, useRef, useCallback } from 'react';
import TutorialTooltip from './TutorialTooltip';
import { useTutorial, TrendingPageStep } from '@/contexts/TutorialContext';

const TrendingTutorial: React.FC = () => {
  const { tutorialState, advanceTrendingStep, dismissTutorial } = useTutorial();
  const { isTrendingTutorialActive, trendingStep } = tutorialState;
  const firstDesignRef = useRef<Element | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Initialize tutorial target (first design element)
  useEffect(() => {
    if (!isTrendingTutorialActive) {
      // Clean up on tutorial inactive
      cleanupTutorial();
      return;
    }

    if (hasInitializedRef.current) return;

    // Initialize the tutorial
    initializeTutorial();

    return () => {
      // Clean up when component unmounts
      cleanupTutorial();
    };
  }, [isTrendingTutorialActive]);

  // Set up the target element for the tutorial
  const initializeTutorial = () => {
    // Find the first design
    const firstDesign = document.querySelector('.grid-cols-1 > div:first-child');
    if (!firstDesign) {
      console.warn('First design not found for tutorial');
      return;
    }

    // Mark the first design with a special class
    firstDesign.classList.add('tutorial-target-design');
    firstDesignRef.current = firstDesign;

    // Mark as initialized
    hasInitializedRef.current = true;
  };

  // Clean up tutorial classes
  const cleanupTutorial = () => {
    // Remove the target class from the first design
    if (firstDesignRef.current instanceof HTMLElement) {
      firstDesignRef.current.classList.remove('tutorial-target-design');
    } else {
      const tutorialTarget = document.querySelector('.tutorial-target-design');
      if (tutorialTarget) {
        tutorialTarget.classList.remove('tutorial-target-design');
      }
    }

    // Reset initialization flag when cleaning up
    hasInitializedRef.current = false;
  };

  // Define tutorial steps content
  const steps: Record<
    TrendingPageStep,
    {
      title: string;
      content: string;
      selector: string;
      position?: 'top' | 'bottom' | 'left' | 'right';
    }
  > = {
    'view-designs': {
      title: 'Browse Trending Designs',
      content:
        'Here you can explore our most popular designs. Take a moment to browse through them.',
      selector: '.tutorial-target-design, .grid-cols-1 > div:first-child',
      position: 'right'
    },
    'interact-design': {
      title: 'Interact with Designs',
      content: 'Tap on a design to see more details, like the prompt used to generate it.',
      selector: '.tutorial-target-design, .grid-cols-1 > div:first-child',
      position: 'right'
    },
    'add-to-mydesigns': {
      title: 'Save to Your Designs',
      content:
        'Found a design you like? Save it to your personal collection by clicking the "Add to My Designs" button.',
      selector: '.tutorial-target-design, .grid-cols-1 > div:first-child',
      position: 'right'
    },
    completed: {
      title: 'Completed!',
      content: 'You have completed the trending designs tutorial.',
      selector: '.tutorial-target-design, .grid-cols-1 > div:first-child',
      position: 'right'
    }
  };

  // Get current step data
  const currentStep = steps[trendingStep];

  // Calculate step number
  const stepNumber = (() => {
    const stepKeys = Object.keys(steps).filter((key) => key !== 'completed');
    return stepKeys.indexOf(trendingStep as string) + 1;
  })();

  const totalSteps = Object.keys(steps).filter((key) => key !== 'completed').length;

  // Simple advance step handler
  const handleAdvanceStep = useCallback(() => {
    advanceTrendingStep();
  }, [advanceTrendingStep]);

  // Don't render anything if tutorial is not active or completed
  if (!isTrendingTutorialActive || trendingStep === 'completed') {
    return null;
  }

  return (
    <TutorialTooltip
      targetSelector={currentStep.selector}
      title={currentStep.title}
      content={currentStep.content}
      position={currentStep.position}
      isActive={isTrendingTutorialActive}
      onComplete={handleAdvanceStep}
      onDismiss={() => dismissTutorial('trending')}
      stepNumber={stepNumber}
      totalSteps={totalSteps}
    />
  );
};

export default TrendingTutorial;
