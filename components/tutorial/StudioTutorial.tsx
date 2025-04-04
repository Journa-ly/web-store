import React, { useEffect, useRef } from 'react';
import TutorialTooltip from './TutorialTooltip';
import { useTutorial, StudioPageStep } from '@/contexts/TutorialContext';

const StudioTutorial: React.FC = () => {
  const { tutorialState, advanceStudioStep, dismissTutorial } = useTutorial();
  const { isStudioTutorialActive, studioStep } = tutorialState;
  const hasInitializedRef = useRef<boolean>(false);

  // Add effect to mark target elements with appropriate classes
  useEffect(() => {
    if (!isStudioTutorialActive) {
      cleanupTargetClasses();
      return;
    }

    const initializeTargets = () => {
      if (hasInitializedRef.current) return;
      
      // Find the relevant elements and add classes for easier targeting
      const promptTextarea = document.querySelector('textarea[placeholder="Enter your design description..."]');
      const imageTextInput = document.querySelector('input[placeholder="Image Text"]');
      const generateButton = document.querySelector('button[type="submit"]');
      const productCarousel = document.querySelector('.max-w-4xl');

      // If we found at least one element, mark as initialized
      if (promptTextarea || imageTextInput || generateButton || productCarousel) {
        hasInitializedRef.current = true;
      } else {
        // If elements aren't found yet, try again after a short delay
        console.log('Tutorial targets not found yet, retrying...');
        return false;
      }

      // Add target classes to each element
      if (promptTextarea) promptTextarea.classList.add('tutorial-target-prompt');
      if (imageTextInput) imageTextInput.classList.add('tutorial-target-image-text');
      if (generateButton) generateButton.classList.add('tutorial-target-generate');
      if (productCarousel) productCarousel.classList.add('tutorial-target-products');
      
      return true;
    };

    // Try to initialize immediately
    if (!initializeTargets()) {
      // If initial attempt fails, try again after a delay when DOM might be ready
      const timerId = setTimeout(() => {
        initializeTargets();
      }, 500);
      
      return () => clearTimeout(timerId);
    }
    
    return () => {
      // Clean up classes on unmount
      cleanupTargetClasses();
      
      hasInitializedRef.current = false;
    };
  }, [isStudioTutorialActive]);
  
  // Helper function to clean up target classes
  const cleanupTargetClasses = () => {
    document.querySelectorAll('.tutorial-target-prompt, .tutorial-target-image-text, .tutorial-target-generate, .tutorial-target-products')
      .forEach(el => {
        el.classList.remove(
          'tutorial-target-prompt', 
          'tutorial-target-image-text', 
          'tutorial-target-generate', 
          'tutorial-target-products'
        );
      });
  };

  // Define tutorial steps content - with positions for the studio tutorial
  const steps: Record<StudioPageStep, {
    title: string;
    content: string;
    selector: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
  }> = {
    'input-prompt': {
      title: 'Enter Your Design Prompt',
      content: 'Start by entering a prompt that describes the design you want to create. Be specific about colors, style, and elements.',
      selector: '.tutorial-target-prompt, textarea[placeholder="Enter your design description..."]',
      position: 'bottom'
    },
    'input-image-text': {
      title: 'Add Image Text (Optional)',
      content: 'If you want text on your design, enter it here. This is optional but can enhance your design.',
      selector: '.tutorial-target-image-text, input[placeholder="Image Text"]',
      position: 'right'
    },
    'create-design': {
      title: 'Create Your Design',
      content: 'Click the generate button to create your design based on your prompt and text.',
      selector: '.tutorial-target-generate, button[type="submit"]',
      position: 'bottom'
    },
    'select-product': {
      title: 'Choose a Product',
      content: 'Select a product that you want to apply your design to from the carousel below.',
      selector: '.tutorial-target-products, .max-w-4xl',
      position: 'top'
    },
    'completed': {
      title: 'Completed!',
      content: 'You have completed the design studio tutorial.',
      selector: 'h1',
      position: 'bottom'
    }
  };
  
  // Get current step data
  const currentStep = steps[studioStep];
  
  // Calculate step number
  const getStepNumber = () => {
    const stepKeys = Object.keys(steps).filter(key => key !== 'completed');
    return stepKeys.indexOf(studioStep as string) + 1;
  };
  
  const stepNumber = getStepNumber();
  const totalSteps = Object.keys(steps).filter(key => key !== 'completed').length;
  
  if (!isStudioTutorialActive || studioStep === 'completed') {
    return null;
  }
  
  return (
    <TutorialTooltip
      targetSelector={currentStep.selector}
      title={currentStep.title}
      content={currentStep.content}
      position={currentStep.position}
      isActive={isStudioTutorialActive}
      onComplete={advanceStudioStep}
      onDismiss={() => dismissTutorial('studio')}
      stepNumber={stepNumber}
      totalSteps={totalSteps}
    />
  );
};

export default StudioTutorial; 