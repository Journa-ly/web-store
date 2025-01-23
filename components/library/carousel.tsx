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
    <div className={clsx('carousel relative w-full', className)}>
      {/* Slides */}
      <div className="relative h-64 overflow-hidden">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={clsx(
              'absolute flex h-full w-full items-center justify-center transition-transform duration-700',
              index === currentIndex ? 'translate-x-0' : 'translate-x-full'
            )}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`
            }}
          >
            {item.content}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
        <button className="btn btn-circle" onClick={handlePrev}>
          ❮
        </button>
        <button className="btn btn-circle" onClick={handleNext}>
          ❯
        </button>
      </div>

      {/* Indicators */}
      <div className="flex w-full justify-center gap-2 py-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={clsx('btn btn-xs', idx === currentIndex ? 'btn-active' : 'btn-ghost')}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
