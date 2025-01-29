import Link from "next/link";
import PaintBrushIcon from "./icons/paintBrush";

const DesignStudioButton = () => (
  <Link href="/design-studio">
    <button className="btn btn-secondary mr-4 text-white flex items-center gap-2">
      {/* Icon is always visible */}
      <PaintBrushIcon />
      
      {/* Text is hidden on small screens and shown on sm+ */}
      <span className="hidden md:inline">Design Studio</span>
    </button>
  </Link>
);

export default DesignStudioButton;
