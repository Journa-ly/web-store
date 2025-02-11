import { PaintBrushIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const DesignStudioButton = () => (
  <Link href="/designs/studio">
    <button className="btn btn-secondary flex items-center gap-2 text-white">
      {/* Icon is always visible */}
      <PaintBrushIcon width={24} height={24} />

      {/* Text is hidden on small screens and shown on sm+ */}
      <span className="hidden md:inline">Design Studio</span>
    </button>
  </Link>
);

export default DesignStudioButton;
