import { useState } from 'react';
import { useAllGenerationGroupImages } from './hooks';
import CircleXIcon from './icons/CircleXIcon';
import { SELECT_PIPELINE_JOB_AND_IMAGE, useWebSocketDispatch } from './WebSocketContext';

export default function ImageGrid({ handleClose }) {
  const generationImages = useAllGenerationGroupImages();
  const dispatch = useWebSocketDispatch();
  const [activeTab, setActiveTab] = useState('all'); // Default to 'all' tab

  const handleImageClick = (e, image) => {
    e.nativeEvent.stopImmediatePropagation();
    const imageUUID = image.uuid;
    const generationGroupID = image.pipeline_job.generation_group;
    dispatch({
      type: SELECT_PIPELINE_JOB_AND_IMAGE,
      data: { imageUUID, generationGroupID }
    });
    handleClose();
  };

  // Filter images based on the active tab
  let imagesToDisplay = generationImages.filter(
    (generationImage) => generationImage.image !== null
  );
  if (activeTab === 'favorites') {
    imagesToDisplay = imagesToDisplay.filter((generationImage) => generationImage.favorited);
  }

  return (
    <div className="image-grid-container">
      <div>
        <button
          type="button"
          className="hover-grow"
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation();
            handleClose();
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: '12px'
          }}
        >
          <CircleXIcon />
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </button>
      </div>

      {imagesToDisplay.length === 0 && (
        <div style={{ textAlign: 'center' }}>
          <p>
            {activeTab === 'favorites'
              ? 'You have no favorite images.'
              : "You haven't generated any images."}
          </p>
        </div>
      )}

      <div className="image-grid">
        {imagesToDisplay.length > 0 &&
          imagesToDisplay.map((generationImage) => (
            <div
              key={generationImage.uuid}
              className="image-grid-item"
              onClick={(e) => handleImageClick(e, generationImage)}
            >
              <img src={generationImage.image.image} alt="generated image" />
            </div>
          ))}
      </div>
    </div>
  );
}
