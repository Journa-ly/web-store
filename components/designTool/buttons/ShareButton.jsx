import { useEffect, useRef, useState } from 'react';
import { FacebookIcon, FacebookShareButton, PinterestIcon, PinterestShareButton, RedditIcon, RedditShareButton, TwitterShareButton, XIcon } from 'react-share';
import { constructShareURL } from '../helpers';
import { useSelectedImage } from '../hooks';
import ShareIcon from '../icons/ShareIcon';
import IconButton from './IconButton';

const ShareButton = () => {
  const selectedImage = useSelectedImage();
  const imageId = selectedImage && selectedImage.id;
  const imageUrl = selectedImage && selectedImage.image && selectedImage.image.image;
  const shareUrl = constructShareURL(imageId, imageUrl);
  const [showSharePopover, setShowSharePopover] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState({ message: '', success: null });
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      event.stopPropagation();
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowSharePopover(false);
      }
    };

    if (showSharePopover) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSharePopover]);

  const toggleSharePopover = (e) => {
    e.stopPropagation();
    setShowSharePopover(!showSharePopover);
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyFeedback({ message: 'Link copied', success: true });
    } catch (err) {
      setCopyFeedback({ message: 'Failed to copy the link.', success: false });
    }

    setTimeout(() => setCopyFeedback({ message: '', success: null }), 3000);
  };

  return (
    <div style={{ position: "relative"}}>
      <IconButton
        icon={<ShareIcon />}
        text="Share"
        disabled={!selectedImage || !selectedImage.image}
        onClick={toggleSharePopover}
      />
      {showSharePopover && (
        <div className="share-popover popover-toolbar" ref={popoverRef}>
          <span>Share the selected image.</span>
          <div className="share-buttons-row">
            <TwitterShareButton
              url={shareUrl}
              title={`Checkout this awesome image that I created!`}
              via="journa_labs"
            >
              <XIcon size={35} round />
            </TwitterShareButton>
            <FacebookShareButton
              url={shareUrl}
              quote="Checkout this awesome image that I created!"
            >
              <FacebookIcon size={35} round />
            </FacebookShareButton>
            <PinterestShareButton
              url={shareUrl}
              media={selectedImage ? selectedImage.image.image : null }
              description="Checkout this awesome image that I created!"
            >
              <PinterestIcon size={35} round />
            </PinterestShareButton>
            <RedditShareButton
              url={shareUrl}
              title="Checkout this awesome image that I created!"
            >
              <RedditIcon size={35} round />
            </RedditShareButton>
          </div>
          <div className="share-link-row">
            <button className="link-button" onClick={handleCopy} type='button'>
              <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 7H16C18.7614 7 21 9.23858 21 12C21 14.7614 18.7614 17 16 17H14M10 7H8C5.23858 7 3 9.23858 3 12C3 14.7614 5.23858 17 8 17H10M8 12H16"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className={`copy-feedback ${copyFeedback.success === true ? 'success' : copyFeedback.success === false ? 'error' : ''}`}>
              {copyFeedback.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareButton;
