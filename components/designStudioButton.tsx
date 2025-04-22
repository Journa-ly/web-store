import { PaintBrushIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const DesignStudioButton = () => (
  <Link href="/designs/studio">
    <button className="btn btn-ghost flex items-center px-2">
      {/* Icon is always visible */}
      <PaintBrushIcon width={16} height={16} />

      {/* Text is hidden on small screens and shown on sm+ */}
      <span className="hidden md:inline">Design Studio</span>
    </button>
  </Link>
);

export default DesignStudioButton;
