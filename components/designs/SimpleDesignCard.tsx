import { Design } from 'types/design';
import Image from 'next/image';
import Link from 'next/link';

interface SimpleDesignCardProps {
  design: Design;
}

export default function SimpleDesignCard({ design }: SimpleDesignCardProps) {
  return (
    <Link
      href="/designs/trending"
      className="group relative block aspect-square overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
    >
      <Image
        src={design.product_image?.image || ''}
        alt={design.name || 'Design'}
        width={400}
        height={400}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </Link>
  );
}
