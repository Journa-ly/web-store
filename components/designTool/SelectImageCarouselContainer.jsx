import { useAllGenerationGroupImages } from './hooks';
import SelectImageCarousel from './SelectImageCarousel';
import SelectImageDefault from './SelectImageDefault';


export default function SelectImageCarouselContainer() {
  const generatedImages = useAllGenerationGroupImages();

  return (
    <div>
      {generatedImages && generatedImages.length > 0 ? (
          <SelectImageCarousel images={generatedImages}/>
        ) : (
          <SelectImageDefault />
        )}
    </div>
  );
}