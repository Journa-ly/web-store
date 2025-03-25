'use client';

import { TrendingDesign } from '@/types/design';
import Image from 'next/image';
import Link from 'next/link';

interface TrendingDesignsCarouselProps {
  designs: TrendingDesign[];
}

export default function TrendingDesignsCarousel({ designs }: TrendingDesignsCarouselProps) {
  // Split designs for different views
  const mobileDesigns = designs.slice(0, 8); // Show 8 designs on mobile
  const desktopFirstRow = designs.slice(0, 5);
  const desktopSecondRow = designs.slice(5, 10);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        {/* Mobile View - 8 designs in a grid */}
        <div className="flex flex-wrap justify-center gap-4 md:hidden">
          {mobileDesigns.map((design) => (
            <div key={design.uuid} className="w-[calc(50%-8px)] flex-none">
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

        {/* Desktop View - First Row */}
        <div className="hidden justify-center gap-4 md:flex">
          {desktopFirstRow.map((design) => (
            <div key={design.uuid} className="w-[calc(20%-16px)] flex-none">
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

        {/* Desktop View - Second Row */}
        <div className="hidden justify-center gap-4 md:flex">
          {desktopSecondRow.map((design) => (
            <div key={design.uuid} className="w-[calc(20%-16px)] flex-none">
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
