import React, { useEffect, useRef } from 'react';
import TutorialTooltip from './TutorialTooltip';
import { useTutorial, ProductPageStep } from '@/contexts/TutorialContext';

const ProductTutorial: React.FC = () => {
  const { tutorialState, advanceProductStep, dismissTutorial } = useTutorial();
  const { isProductTutorialActive, productStep } = tutorialState;
  const hasInitializedRef = useRef<boolean>(false);
  
  // Initialize target elements
  useEffect(() => {
    if (!isProductTutorialActive) {
      cleanupTargets();
      return;
    }
    
    if (hasInitializedRef.current) return;
    
    // Find and mark target elements
    const designsSection = document.querySelector('.w-full.overflow-hidden');
    // Target Add to Cart button by its ID - most reliable approach
    const addToCartButton = document.getElementById('add-to-cart-button');
    
    if (designsSection) {
      designsSection.classList.add('tutorial-target-designs');
    }
    
    if (addToCartButton) {
      addToCartButton.classList.add('tutorial-target-cart');
    } else {
      console.log('Add to Cart button not found for tutorial');
    }
    
    hasInitializedRef.current = true;
    
    return () => {
      cleanupTargets();
    };
  }, [isProductTutorialActive]);
  
  // Cleanup function
  const cleanupTargets = () => {
    document.querySelectorAll('.tutorial-target-designs, .tutorial-target-cart')
      .forEach(el => {
        el.classList.remove('tutorial-target-designs', 'tutorial-target-cart');
      });
    
    hasInitializedRef.current = false;
  };

  // Define tutorial steps content
  const steps: Record<ProductPageStep, {
    title: string;
    content: string;
    selector: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
  }> = {
    'select-design': {
      title: 'Select a Design',
      content: 'Choose a design to apply to this product. You can click on any design to see it on the product.',
      selector: '.tutorial-target-designs, .w-full.overflow-hidden',
      position: 'bottom'
    },
    'add-to-cart': {
      title: 'Add to Cart',
      content: 'When you are satisfied with your selection, add the product to your cart.',
      selector: '.tutorial-target-cart, #add-to-cart-button',
      position: 'left'
    },
    'completed': {
      title: 'Completed!',
      content: 'You have completed the product page tutorial.',
      selector: 'h1',
      position: 'bottom'
    }
  };
  
  // Get current step data
  const currentStep = steps[productStep];
  
  // Calculate step number
  const getStepNumber = () => {
    const stepKeys = Object.keys(steps).filter(key => key !== 'completed');
    return stepKeys.indexOf(productStep as string) + 1;
  };
  
  const stepNumber = getStepNumber();
  const totalSteps = Object.keys(steps).filter(key => key !== 'completed').length;
  
  if (!isProductTutorialActive || productStep === 'completed') {
    return null;
  }
  
  return (
    <TutorialTooltip
      targetSelector={currentStep.selector}
      title={currentStep.title}
      content={currentStep.content}
      position={currentStep.position}
      isActive={isProductTutorialActive}
      onComplete={advanceProductStep}
      onDismiss={() => dismissTutorial('product')}
      stepNumber={stepNumber}
      totalSteps={totalSteps}
    />
  );
};

export default ProductTutorial; 