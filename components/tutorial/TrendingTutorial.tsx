import React, { useEffect, useRef, useState } from 'react';
import TutorialTooltip from './TutorialTooltip';
import { useTutorial, TrendingPageStep } from '@/contexts/TutorialContext';

const TrendingTutorial: React.FC = () => {
  const { tutorialState, advanceTrendingStep, dismissTutorial } = useTutorial();
  const { isTrendingTutorialActive, trendingStep } = tutorialState;
  const hasInitializedRef = useRef<boolean>(false);
  const [isTargetReady, setIsTargetReady] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 5;
  const retryInterval = 1000; // 1 second

  // Initialize target elements with retry logic
  useEffect(() => {
    if (!isTrendingTutorialActive) {
      cleanupTargets();
      setIsTargetReady(false);
      return;
    }

    if (hasInitializedRef.current) return;

    const findAndMarkTarget = () => {
      // Find and mark target elements using ID
      const firstDesign = document.getElementById('first-trending-design');
      
      if (firstDesign) {
        firstDesign.classList.add('tutorial-target-design');
        setIsTargetReady(true);
        hasInitializedRef.current = true;
      } else {
        console.log('First trending design not found for tutorial, retrying...');
        retryCountRef.current++;
        
        if (retryCountRef.current < maxRetries) {
          setTimeout(findAndMarkTarget, retryInterval);
        } else {
          console.error('Failed to find first trending design after multiple attempts');
          // If we can't find the target, we should dismiss the tutorial
          dismissTutorial('trending');
        }
      }
    };

    findAndMarkTarget();

    return () => {
      cleanupTargets();
      setIsTargetReady(false);
      retryCountRef.current = 0;
    };
  }, [isTrendingTutorialActive, dismissTutorial]);

  // Cleanup function
  const cleanupTargets = () => {
    document.querySelectorAll('.tutorial-target-design')
      .forEach(el => {
        el.classList.remove('tutorial-target-design');
      });
    
    hasInitializedRef.current = false;
  };

  // Define tutorial steps content
  const steps: Record<TrendingPageStep, {
    title: string;
    content: string;
    selector: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
  }> = {
    'view-designs': {
      title: 'Browse Trending Designs',
      content: 'Here you can explore our most popular designs. Take a moment to browse through them.',
      selector: '.tutorial-target-design, #first-trending-design',
      position: 'right'
    },
    'interact-design': {
      title: 'Interact with Designs',
      content: 'Tap on a design to see more details, like the prompt used to generate it.',
      selector: '.tutorial-target-design, #first-trending-design',
      position: 'right'
    },
    'add-to-mydesigns': {
      title: 'Save to Your Designs',
      content: 'Found a design you like? Save it to your personal collection by clicking the "Add to My Designs" button.',
      selector: '.tutorial-target-design, #first-trending-design',
      position: 'right'
    },
    'completed': {
      title: 'Completed!',
      content: 'You have completed the trending designs tutorial.',
      selector: 'h1',
      position: 'bottom'
    }
  };

  // Get current step data
  const currentStep = steps[trendingStep];

  // Calculate step number
  const getStepNumber = () => {
    const stepKeys = Object.keys(steps).filter(key => key !== 'completed');
    return stepKeys.indexOf(trendingStep as string) + 1;
  };

  const stepNumber = getStepNumber();
  const totalSteps = Object.keys(steps).filter(key => key !== 'completed').length;

  // Don't render the tooltip until we've found the target
  if (!isTrendingTutorialActive || trendingStep === 'completed' || !isTargetReady) {
    return null;
  }

  return (
    <TutorialTooltip
      targetSelector={currentStep.selector}
      title={currentStep.title}
      content={currentStep.content}
      position={currentStep.position}
      isActive={isTrendingTutorialActive}
      onComplete={advanceTrendingStep}
      onDismiss={() => dismissTutorial('trending')}
      stepNumber={stepNumber}
      totalSteps={totalSteps}
    />
  );
};

export default TrendingTutorial;
