import { useSwipeable } from 'react-swipeable';
import CarouselImage from './CarouselImage';
import { SELECT_IMAGE, useWebSocketDispatch } from './WebSocketContext';

const ImageCarousel = ({ images, generationGroupID }) => {
  const selectedIndex = images.findIndex(image => image.selected === true);
  const imageIndex = selectedIndex !== -1 ? selectedIndex : 0
  const dispatch = useWebSocketDispatch();

  function setSelectedImage(imageUUID) {
    dispatch({
      type: SELECT_IMAGE,
      data: { imageUUID, generationGroupID }
    });
  }

  const handleNavigation = (direction) => {
    let newIndex = imageIndex;
    if (direction === 'left' && imageIndex === 0) {
      const generationForm = document.getElementById(`generationGroupID`);
      if (generationForm) {
        generationForm.submit();
      }
    } else if (direction === 'left' && imageIndex > 0) {
      newIndex = imageIndex - 1;
    } else if (direction === 'right' && imageIndex < images.length - 1) {
      newIndex = imageIndex + 1;
    }

    setSelectedImage(images[newIndex].uuid);  // Set the selected image in context
  };

  const handleClick = (event) => {
    const carousel = event.currentTarget; // Reference to the carousel container
    const boundingRect = carousel.getBoundingClientRect(); // Get the bounding box of the carousel
    const clickPosition = event.clientX;
    const middle = boundingRect.left + boundingRect.width / 2; // Calculate the middle relative to the carousel
  
    if (clickPosition < middle) {
      handleNavigation('left');
    } else {
      handleNavigation('right');
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      eventData.event.stopPropagation();  // Prevent the swipe from affecting parent elements
      handleNavigation('right');
    },
    onSwipedRight: (eventData) => {
      eventData.event.stopPropagation();  // Prevent the swipe from affecting parent elements
      handleNavigation('left');
    },
    onSwiping: (eventData) => {
      const { deltaX, deltaY } = eventData;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // If horizontal movement is greater than vertical, prevent vertical scrolling
        eventData.event.preventDefault();
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="carousel-container" onClick={handleClick} {...handlers}>
      <div
        className="carousel-images"
        style={{
          transform: `translateX(-${imageIndex * 100}%)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {images.map((imageData) => (
          <CarouselImage key={imageData.uuid} imageData={imageData} />
        ))}
      </div>
      { images && images.length > 1 && (
        <div className="image-count">{imageIndex + 1} / {images.length} </div>
      )}
    </div>
  );
};

export default ImageCarousel;
