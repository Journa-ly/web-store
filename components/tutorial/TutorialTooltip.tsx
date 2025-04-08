import React, { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import ReactDOM from 'react-dom';

interface TutorialTooltipProps {
  targetSelector: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  isActive: boolean;
  onComplete: () => void;
  onDismiss: () => void;
  stepNumber: number;
  totalSteps: number;
}

const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
  targetSelector,
  title,
  content,
  position = 'bottom',
  isActive,
  onComplete,
  onDismiss,
  stepNumber,
  totalSteps
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [adjustedPosition, setAdjustedPosition] = useState<'top' | 'bottom' | 'left' | 'right'>(position);

  // Find target element and calculate initial tooltip position
  useEffect(() => {
    if (!isActive) return;

    // Try to get the element by class first, then by selector
    let target: Element | null = null;

    if (targetSelector.includes(',')) {
      const selectors = targetSelector.split(',').map((s) => s.trim());
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          target = element;
          break;
        }
      }
    } else {
      target =
        document.querySelector('.tutorial-target-design') || document.querySelector(targetSelector);
    }

    if (!target) {
      console.warn(`Tutorial target not found for selector: ${targetSelector}`);
      return;
    }

    setTargetElement(target);

    // Calculate the absolute position for the tooltip based on the target element
    const calculatePosition = () => {
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const tooltipWidth = tooltipRef.current?.offsetWidth || 288; // w-72 = 18rem = 288px
      const tooltipHeight = tooltipRef.current?.offsetHeight || 200; // Estimated height
      const margin = 16; // Space between target and tooltip

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Include scroll offsets for absolute positioning
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      // Start with the requested position
      let positionToUse = position;
      let top = 0;
      let left = 0;

      // Check if tooltip would extend beyond viewport in the requested position
      // and adjust position if necessary
      const calculateTopPosition = () => {
        top = rect.top - tooltipHeight - margin + scrollY;
        left = rect.left + rect.width / 2 - tooltipWidth / 2 + scrollX;
        
        // Check if tooltip would extend beyond top of viewport
        if (rect.top - tooltipHeight - margin < 0) {
          return false;
        }
        // Check if tooltip would extend beyond left/right edges
        if (left < scrollX || left + tooltipWidth > scrollX + viewportWidth) {
          // Center it as best as possible
          left = Math.max(scrollX + 10, Math.min(scrollX + viewportWidth - tooltipWidth - 10, left));
        }
        return true;
      };

      const calculateBottomPosition = () => {
        top = rect.bottom + margin + scrollY;
        left = rect.left + rect.width / 2 - tooltipWidth / 2 + scrollX;
        
        // Check if tooltip would extend beyond bottom of viewport
        if (rect.bottom + margin + tooltipHeight > viewportHeight + scrollY) {
          return false;
        }
        // Check if tooltip would extend beyond left/right edges
        if (left < scrollX || left + tooltipWidth > scrollX + viewportWidth) {
          // Center it as best as possible
          left = Math.max(scrollX + 10, Math.min(scrollX + viewportWidth - tooltipWidth - 10, left));
        }
        return true;
      };

      const calculateLeftPosition = () => {
        top = rect.top + rect.height / 2 - tooltipHeight / 2 + scrollY;
        left = rect.left - tooltipWidth - margin + scrollX;
        
        // Check if tooltip would extend beyond left of viewport
        if (rect.left - tooltipWidth - margin < 0) {
          return false;
        }
        // Check if tooltip would extend beyond top/bottom edges
        if (top < scrollY || top + tooltipHeight > scrollY + viewportHeight) {
          // Center it as best as possible
          top = Math.max(scrollY + 10, Math.min(scrollY + viewportHeight - tooltipHeight - 10, top));
        }
        return true;
      };

      const calculateRightPosition = () => {
        top = rect.top + rect.height / 2 - tooltipHeight / 2 + scrollY;
        left = rect.right + margin + scrollX;
        
        // Check if tooltip would extend beyond right of viewport
        if (rect.right + margin + tooltipWidth > viewportWidth + scrollX) {
          return false;
        }
        // Check if tooltip would extend beyond top/bottom edges
        if (top < scrollY || top + tooltipHeight > scrollY + viewportHeight) {
          // Center it as best as possible
          top = Math.max(scrollY + 10, Math.min(scrollY + viewportHeight - tooltipHeight - 10, top));
        }
        return true;
      };

      // Try the requested position first
      let positionFits = false;
      switch (positionToUse) {
        case 'top':
          positionFits = calculateTopPosition();
          break;
        case 'bottom':
          positionFits = calculateBottomPosition();
          break;
        case 'left':
          positionFits = calculateLeftPosition();
          break;
        case 'right':
          positionFits = calculateRightPosition();
          break;
      }

      // If the requested position doesn't fit, try alternatives
      if (!positionFits) {
        // Order of fallback positions
        const positions: ('top' | 'bottom' | 'left' | 'right')[] = ['bottom', 'top', 'right', 'left'];
        
        // Remove the position we already tried
        const remainingPositions = positions.filter(p => p !== positionToUse);
        
        // Try each remaining position until one fits
        for (const pos of remainingPositions) {
          switch (pos) {
            case 'top':
              if (calculateTopPosition()) {
                positionToUse = 'top';
                positionFits = true;
                break;
              }
              continue;
            case 'bottom':
              if (calculateBottomPosition()) {
                positionToUse = 'bottom';
                positionFits = true;
                break;
              }
              continue;
            case 'left':
              if (calculateLeftPosition()) {
                positionToUse = 'left';
                positionFits = true;
                break;
              }
              continue;
            case 'right':
              if (calculateRightPosition()) {
                positionToUse = 'right';
                positionFits = true;
                break;
              }
              continue;
          }
          if (positionFits) break;
        }
        
        // If no position fits perfectly, use the original position but ensure
        // the tooltip remains within viewport bounds
        if (!positionFits) {
          switch (positionToUse) {
            case 'top':
              calculateTopPosition();
              break;
            case 'bottom':
              calculateBottomPosition();
              break;
            case 'left':
              calculateLeftPosition();
              break;
            case 'right':
              calculateRightPosition();
              break;
          }
          
          // Final adjustments to keep tooltip within viewport
          top = Math.max(scrollY + 10, Math.min(scrollY + viewportHeight - tooltipHeight - 10, top));
          left = Math.max(scrollX + 10, Math.min(scrollX + viewportWidth - tooltipWidth - 10, left));
        }
      }

      setAdjustedPosition(positionToUse);
      setTooltipPosition({ top, left });
    };

    // Calculate initial position
    calculatePosition();

    // Recalculate if window is resized or scrolled
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);

    // Highlight target element
    if (target instanceof HTMLElement) {
      // Add a highlight style to the target
      target.classList.add('tutorial-highlight');

      // Apply styles that don't affect layout
      const originalStyle = target.getAttribute('style') || '';
      target.setAttribute(
        'style',
        `${originalStyle}; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.4); border-radius: 4px;`
      );
    }

    // Clean up function
    return () => {
      // Remove event listeners
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);

      // Remove highlight
      if (target instanceof HTMLElement) {
        target.classList.remove('tutorial-highlight');
        // Restore original style without the highlight
        const style = target.getAttribute('style') || '';
        target.setAttribute(
          'style',
          style.replace('box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.4); border-radius: 4px;', '')
        );
      }
    };
  }, [isActive, targetSelector, position]);

  if (!isActive || !targetElement) return null;

  // Create arrow class based on adjusted position
  const getArrowClass = () => {
    switch (adjustedPosition) {
      case 'top':
        return 'tooltip-arrow tooltip-arrow-bottom';
      case 'bottom':
        return 'tooltip-arrow tooltip-arrow-top';
      case 'left':
        return 'tooltip-arrow tooltip-arrow-right';
      case 'right':
        return 'tooltip-arrow tooltip-arrow-left';
    }
  };

  // Create the tooltip content
  const tooltipContent = (
    <Transition
      show={true}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <div
        ref={tooltipRef}
        className={clsx(
          'tutorial-tooltip w-72 rounded-lg border border-indigo-100 bg-indigo-50 shadow-lg',
          `tutorial-tooltip-${adjustedPosition}`
        )}
        style={{
          position: 'absolute', // Use absolute instead of fixed positioning
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          zIndex: 9999,
          maxWidth: '90vw' // Ensure tooltip doesn't exceed viewport width on mobile
        }}
      >
        <div className={getArrowClass()} />

        <div className="relative p-4">
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss tutorial"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          {/* Title */}
          <h3 className="mb-1 text-lg font-medium text-indigo-900">{title}</h3>

          {/* Content */}
          <p className="mb-4 text-sm text-gray-600">{content}</p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Step {stepNumber} of {totalSteps}
            </div>

            <button
              onClick={onComplete}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              {stepNumber === totalSteps ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  );

  // Render the tooltip directly in the body to avoid layout issues
  return ReactDOM.createPortal(tooltipContent, document.body);
};

export default TutorialTooltip;
