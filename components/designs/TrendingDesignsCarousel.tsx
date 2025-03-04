'use client';

import { Design } from '@/types/design';
import Image from 'next/image';
import Link from 'next/link';

interface TrendingDesignsCarouselProps {
  designs: Design[];
}

export default function TrendingDesignsCarousel({ designs }: TrendingDesignsCarouselProps) {
  // Split designs into two rows
  const firstRowDesigns = designs.slice(0, 4);
  const secondRowDesigns = designs.slice(4, 8);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        {/* First Row - Always visible */}
        <div className="flex flex-wrap justify-center gap-4">
          {firstRowDesigns.map((design) => (
            <div key={design.uuid} className="w-[calc(50%-8px)] flex-none sm:w-64">
              <Link
                href="/designs/trending"
                className="group block aspect-square overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
              >
                <Image
                  src={design.product_image?.image || '/images/product-placeholder.jpg'}
                  alt={design.name || 'Design'}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Second Row - Hidden on mobile */}
        <div className="hidden justify-center gap-4 md:flex">
          {secondRowDesigns.map((design) => (
            <div key={design.uuid} className="w-64 flex-none">
              <Link
                href="/designs/trending"
                className="group block aspect-square overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
              >
                <Image
                  src={design.product_image?.image || '/images/product-placeholder.jpg'}
                  alt={design.name || 'Design'}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
