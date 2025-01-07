import { useMemo } from 'react';
import { SELECT_PIPELINE_JOB_AND_IMAGE, useWebSocketDispatch } from './WebSocketContext';
import ImageGridButton from './buttons/ImageGridButton';
import { useSelectedImage } from './hooks';

export default function SelectImageCarousel({ images = [] }) {
  const dispatch = useWebSocketDispatch();
  const selectedImage = useSelectedImage();

  const generatedImages = useMemo(() => {
    return images.filter((image) => image.image);
  }, [images]);

  const handleClick = (image) => {
    const imageUUID = image.uuid;
    const generationGroupID = image.pipeline_job.generation_group;
    dispatch({
      type: SELECT_PIPELINE_JOB_AND_IMAGE,
      data: { imageUUID, generationGroupID }
    });
  };

  return (
    <div>
      <div style={{ color: '#757575' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '12px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '12px',
                width: '35px',
                borderRadius: '50%',
                height: '35px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <span>1</span>
            </div>
            <span>Select an Image.</span>
          </div>
          <div>
            <ImageGridButton />
          </div>
        </div>
        <div
          style={{ overflowX: 'auto', display: 'flex', padding: '10px 0', alignItems: 'center' }}
        >
          {generatedImages.map((generatedImage) => {
            const isSelected = selectedImage && generatedImage.uuid === selectedImage.uuid;

            const imageStyle = {
              flex: '0 0 auto',
              cursor: 'pointer',
              aspectRatio: '1/1',
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              margin: '0 5px',
              borderRadius: '12px',
              filter: isSelected ? 'none' : 'blur(.5px)'
            };

            if (isSelected) {
              imageStyle.transform = 'scale(1.1)';
            }

            return (
              <img
                className={isSelected ? '' : 'hover-grow'}
                key={generatedImage.uuid}
                src={generatedImage.image.image}
                onClick={() => handleClick(generatedImage)}
                style={imageStyle}
              />
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '12px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '12px',
            borderRadius: '50%',
            width: '35px',
            height: '35px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <span>2</span>
        </div>
        <span>Preview and Add to Cart.</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {selectedImage && selectedImage.image ? (
          <img
            src={selectedImage.image.image}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '12px'
            }}
          />
        ) : (
          <div style={{ color: '#757575', textAlign: 'center' }}>
            Select an image above to preview and add to cart.
          </div>
        )}
      </div>
    </div>
  );
}
