// components/ui/Carousel.tsx

import clsx from 'clsx';
import React, { useState } from 'react';

export interface CarouselItem {
  id: number;
  content: React.ReactNode; // e.g. <img />, text, etc.
}

export interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number; // in ms
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  interval = 3000,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (autoPlay) {
      timer = setTimeout(() => {
        handleNext();
      }, interval);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentIndex, autoPlay, interval]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={clsx('relative w-full', className)}>
      {/* Slides Container */}
      <div className="relative w-full overflow-hidden">
        <div className="aspect-square w-full">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={clsx(
                'absolute inset-0 h-full w-full transition-all duration-500 ease-in-out',
                {
                  'translate-x-0 opacity-100': index === currentIndex,
                  'translate-x-full opacity-0': index > currentIndex,
                  '-translate-x-full opacity-0': index < currentIndex
                }
              )}
            >
              <div className="h-full w-full">{item.content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
        <button
          onClick={handlePrev}
          className="btn btn-circle btn-ghost btn-sm text-base-content"
          aria-label="Previous slide"
        >
          ❮
        </button>
        <button
          onClick={handleNext}
          className="btn btn-circle btn-ghost btn-sm text-base-content"
          aria-label="Next slide"
        >
          ❯
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-2 left-0 right-0">
        <div className="flex justify-center gap-1">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={clsx(
                'h-1.5 rounded-full transition-all duration-300',
                idx === currentIndex
                  ? 'w-6 bg-accent'
                  : 'w-1.5 bg-base-300 hover:bg-base-content/50'
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
