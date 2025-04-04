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
      const tooltipWidth = 288; // w-72 = 18rem = 288px
      const tooltipHeight = tooltipRef.current?.offsetHeight || 200; // Estimated height
      const margin = 16; // Space between target and tooltip

      let top = 0;
      let left = 0;

      // Include scroll offsets for absolute positioning
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      switch (position) {
        case 'top':
          top = rect.top - tooltipHeight - margin + scrollY;
          left = rect.left + rect.width / 2 - tooltipWidth / 2 + scrollX;
          break;
        case 'bottom':
          top = rect.bottom + margin + scrollY;
          left = rect.left + rect.width / 2 - tooltipWidth / 2 + scrollX;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2 + scrollY;
          left = rect.left - tooltipWidth - margin + scrollX;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2 + scrollY;
          left = rect.right + margin + scrollX;
          break;
      }

      setTooltipPosition({ top, left });
    };

    // Calculate initial position
    calculatePosition();

    // Recalculate if window is resized
    window.addEventListener('resize', calculatePosition);

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

  // Create arrow class based on position
  const getArrowClass = () => {
    switch (position) {
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
          `tutorial-tooltip-${position}`
        )}
        style={{
          position: 'absolute', // Use absolute instead of fixed positioning
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          zIndex: 9999
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
