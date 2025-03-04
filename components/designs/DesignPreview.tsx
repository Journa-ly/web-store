'use client';

import { useRef, useEffect } from 'react';

interface CanvasPreviewProps {
  templateImageUrl: string;
  designImageUrl: string;
  templateWidth: number; // e.g. 560
  templateHeight: number; // e.g. 295
  printAreaWidth: number; // e.g. 520
  printAreaHeight: number; // e.g. 202
  printAreaTop: number; // e.g. 18
  printAreaLeft: number; // e.g. 20
  isTemplateOnFront: boolean;
  // Optional: orientation, if needed
  orientation?: string;
}

const DesignPreview: React.FC<CanvasPreviewProps> = ({
  templateImageUrl,
  designImageUrl,
  templateWidth,
  templateHeight,
  printAreaWidth,
  printAreaHeight,
  printAreaTop,
  printAreaLeft,
  isTemplateOnFront,
  orientation
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set the canvas size based on the template dimensions.
    canvas.width = templateWidth;
    canvas.height = templateHeight;

    // Create Image objects for both the template and the design.
    const templateImg = new Image();
    const designImg = new Image();
    let imagesLoaded = 0;

    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded < 2) return;

      // Clear the canvas.
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isTemplateOnFront) {
        // Draw the design image first within the print area.
        ctx.drawImage(
          designImg,
          0,
          0,
          designImg.width,
          designImg.height,
          printAreaLeft,
          printAreaTop,
          printAreaWidth,
          printAreaHeight
        );
        // Then overlay the template image.
        ctx.drawImage(templateImg, 0, 0, templateWidth, templateHeight);
      } else {
        // Draw the template first.
        ctx.drawImage(templateImg, 0, 0, templateWidth, templateHeight);
        // Then draw the design image on top within the print area.
        ctx.drawImage(
          designImg,
          0,
          0,
          designImg.width,
          designImg.height,
          printAreaLeft,
          printAreaTop,
          printAreaWidth,
          printAreaHeight
        );
      }
    };

    // Set crossOrigin to allow image drawing if the URLs are on a different domain.
    templateImg.crossOrigin = 'Anonymous';
    designImg.crossOrigin = 'Anonymous';
    templateImg.src = templateImageUrl;
    designImg.src = designImageUrl;
    templateImg.onload = onImageLoad;
    designImg.onload = onImageLoad;
  }, [
    templateImageUrl,
    designImageUrl,
    templateWidth,
    templateHeight,
    printAreaWidth,
    printAreaHeight,
    printAreaTop,
    printAreaLeft,
    isTemplateOnFront,
    orientation
  ]);

  return <canvas ref={canvasRef} />;
};

export default DesignPreview;
