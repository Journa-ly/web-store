import { useEffect } from 'react';
import { get_generation_image_id_from_url } from './helpers';

const HandleMetaTag = () => {
  useEffect(() => {
    // Retrieve the custom image URL from the "image" parameter
    const customImageUrl = get_generation_image_id_from_url();

    if (customImageUrl) {
      // Update the OG image meta tag
      const ogImageTag = document.querySelector('meta[property="og:image"]');

      if (ogImageTag) {
        ogImageTag.setAttribute('content', customImageUrl);
      } else {
        // If no OG tag exists, create one
        const newMetaTag = document.createElement('meta');
        newMetaTag.setAttribute('property', 'og:image');
        newMetaTag.setAttribute('content', customImageUrl);
        document.head.appendChild(newMetaTag);
      }
    }
  }, []); // Run once when the component is mounted

  return null; // This component doesn't render anything to the UI
};

export default HandleMetaTag;
