'use client';

import IconButton from 'components/designTool/buttons/IconButton';
import ShareIcon from 'icons/Share';
import { useDesign } from 'components/designs/design-context';
import {
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterShareButton,
  XIcon
} from 'react-share';
import { useState, useEffect } from 'react';

export default function ShareButton() {
  const { selectedDesign } = useDesign();
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Get the base URL from environment or default to the current origin
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : window.location.origin;

    // Construct share URL that points to the share route with full domain
    if (selectedDesign?.uuid) {
      setShareUrl(
        `${baseUrl}/share?design=${selectedDesign.uuid}&return=${encodeURIComponent(window.location.pathname)}`
      );
    } else {
      setShareUrl(window.location.href);
    }
  }, [selectedDesign]);

  const title = selectedDesign?.name || 'Check out this design!';
  const media = selectedDesign?.product_image?.image || selectedDesign?.image?.image?.image;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(shareUrl);
    // You might want to add a toast notification here
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button">
        <IconButton
          icon={<ShareIcon />}
          text="Share"
          onClick={() => {}} // Empty click handler to satisfy type
          disabled={!selectedDesign}
        />
      </div>
      <div className="menu dropdown-content z-[1] mt-4 w-52 rounded-box bg-base-100 p-4 shadow-lg">
        <div className="flex flex-col gap-3">
          <FacebookShareButton
            url={shareUrl}
            hashtag="#design"
            className="flex items-center gap-2 hover:opacity-80"
          >
            <FacebookIcon size={32} round />
            <span className="text-sm">Facebook</span>
          </FacebookShareButton>

          <TwitterShareButton
            url={shareUrl}
            title={title}
            className="flex items-center gap-2 hover:opacity-80"
          >
            <XIcon size={32} round />
            <span className="text-sm">Twitter</span>
          </TwitterShareButton>

          {media && (
            <PinterestShareButton
              url={shareUrl}
              media={media}
              description={title}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <PinterestIcon size={32} round />
              <span className="text-sm">Pinterest</span>
            </PinterestShareButton>
          )}

          <RedditShareButton
            url={shareUrl}
            title={title}
            className="flex items-center gap-2 hover:opacity-80"
          >
            <RedditIcon size={32} round />
            <span className="text-sm">Reddit</span>
          </RedditShareButton>

          <button type="button" className="btn btn-outline btn-sm mt-2" onClick={handleCopyLink}>
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
