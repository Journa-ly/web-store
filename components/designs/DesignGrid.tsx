'use client';

import { TrendingDesign } from '../../types/design';
import DesignCard from './DesignCard';

interface DesignGridProps {
  designs: TrendingDesign[];
  columns?: number;
}

export default function DesignGrid({ designs, columns = 3 }: DesignGridProps) {
  if (!designs || designs.length === 0) {
    return <div className="py-8 text-center text-base-content/70">No designs to display</div>;
  }

  const getGridClass = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    }
  };

  return (
    <div className={`grid ${getGridClass()} gap-6`}>
      {designs.map((design) => (
        <DesignCard key={design.uuid} design={design} />
      ))}
    </div>
  );
}
