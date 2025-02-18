'use client';

import { Design } from 'types/design';
import SimpleDesignCard from './SimpleDesignCard';

interface TrendingDesignsCarouselProps {
  designs: Design[];
}

export default function TrendingDesignsCarousel({ designs }: TrendingDesignsCarouselProps) {
  return (
    <div className="relative">
      <div className="scrollbar-hide overflow-x-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4">
          {designs.map((design) => (
            <div key={design.uuid} className="w-64 flex-none">
              <SimpleDesignCard design={design} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
